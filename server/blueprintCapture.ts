/**
 * server/blueprintCapture.ts
 *
 * API handler for the Free Roadmap email capture form.
 * POST /api/email/blueprint-capture
 *
 * 1. Saves the lead to the `blueprint_captures` table (if DB is available)
 * 2. Creates/updates a HubSpot contact (if HUBSPOT_ACCESS_TOKEN is set)
 * 3. Returns success even if external services fail — the email is always captured
 *
 * First Dollar Priority: This is the primary lead capture for the funnel.
 * Funnel: Start Here → Free Roadmap (this) → Starter Pack ($7)
 */

import { Request, Response } from "express";
import { getDb } from "./db";
import { blueprintCaptures } from "../drizzle/schema";
import { sql } from "drizzle-orm";

// ─── HubSpot Contact Creation ────────────────────────────────────────────────

async function createHubSpotContact(
  email: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn("[BlueprintCapture] HUBSPOT_ACCESS_TOKEN not set — skipping HubSpot sync.");
    return { success: false, error: "HubSpot not configured" };
  }

  try {
    const properties: Record<string, string> = {
      email,
      lifecyclestage: "subscriber",
      hs_lead_status: "NEW",
    };

    if (name) {
      properties.firstname = name;
    }

    // Try to create the contact first
    const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    });

    if (createRes.ok) {
      console.log(`[BlueprintCapture] HubSpot contact created: ${email}`);
      return { success: true };
    }

    // If contact already exists (409 conflict), update instead
    if (createRes.status === 409) {
      const updateRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              hs_lead_status: "NEW",
              ...(name ? { firstname: name } : {}),
            },
          }),
        }
      );

      if (updateRes.ok) {
        console.log(`[BlueprintCapture] HubSpot contact updated: ${email}`);
        return { success: true };
      }

      const updateBody = await updateRes.text();
      console.error(`[BlueprintCapture] HubSpot update failed: ${updateRes.status} — ${updateBody}`);
      return { success: false, error: `HubSpot update error: ${updateRes.status}` };
    }

    const body = await createRes.text();
    console.error(`[BlueprintCapture] HubSpot create failed: ${createRes.status} — ${body}`);
    return { success: false, error: `HubSpot error: ${createRes.status}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[BlueprintCapture] HubSpot exception: ${message}`);
    return { success: false, error: message };
  }
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function handleBlueprintCapture(req: Request, res: Response): Promise<void> {
  try {
    const { email, name } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Valid email is required" });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || null;
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      null;

    console.log(`[BlueprintCapture] New capture: ${cleanEmail} (name: ${cleanName || "none"})`);

    // ── 1. Save to database ──────────────────────────────────────────────────
    let dbSaved = false;
    try {
      const db = await getDb();
      if (db) {
        // Use INSERT IGNORE to handle duplicate emails gracefully
        await db.execute(
          sql`INSERT INTO blueprint_captures (email, name, source, ip_address)
              VALUES (${cleanEmail}, ${cleanName}, 'homepage', ${ipAddress})
              ON DUPLICATE KEY UPDATE name = ${cleanName || ''}, source = 'homepage'`
        );
        dbSaved = true;
        console.log(`[BlueprintCapture] Saved to database: ${cleanEmail}`);
      } else {
        console.warn("[BlueprintCapture] Database not available — skipping DB save.");
      }
    } catch (dbErr) {
      const msg = dbErr instanceof Error ? dbErr.message : "Unknown DB error";
      console.error(`[BlueprintCapture] DB error: ${msg}`);
      // Don't fail the request — continue to HubSpot
    }

    // ── 2. Create/update HubSpot contact ─────────────────────────────────────
    const hubspotResult = await createHubSpotContact(cleanEmail, cleanName || undefined);

    // ── 3. Return success ────────────────────────────────────────────────────
    // Always return success to the user — we don't want a failed HubSpot call
    // to prevent someone from getting the roadmap
    res.json({
      success: true,
      message: "Roadmap is on its way!",
      dbSaved,
      hubspotSynced: hubspotResult.success,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[BlueprintCapture] Unhandled error: ${message}`);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
