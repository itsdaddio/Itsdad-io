/**
 * server/auth.ts
 *
 * Authentication routes for itsdad.io.
 *
 * Endpoints:
 *   POST /api/auth/login           — Email-based login for existing members
 *   POST /api/auth/logout          — Destroy session and clear cookie
 *   GET  /api/auth/me              — Get current authenticated user info
 *   POST /api/auth/session-login   — Create session from Stripe checkout session ID
 *
 * Login flow:
 *   1. User enters their email on the login page
 *   2. Server checks if email exists in the users table
 *   3. If found, creates a session and sets the cookie
 *   4. User is redirected to their dashboard / Alliance page
 *
 * Post-checkout auto-login:
 *   1. After Stripe checkout, user lands on /checkout/success?session_id=XXX
 *   2. Frontend calls POST /api/auth/session-login with the Stripe session ID
 *   3. Server looks up the user by Stripe session ID and creates a session
 *   4. User is automatically logged in — no manual login needed
 */

import { Request, Response } from "express";
import { getDb } from "./db";
import { users, memberships } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import {
  createSession,
  setSessionCookie,
  clearSessionCookie,
} from "./sessionMiddleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
// Email-based login for existing members

export async function loginWithEmail(req: Request, res: Response): Promise<void> {
  const { email } = req.body as { email?: string };

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Valid email address required." });
    return;
  }

  const db = (await getDb()) as any;
  if (!db) {
    res.status(503).json({ error: "Database unavailable." });
    return;
  }

  // Look up user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user) {
    res.status(404).json({
      error: "No account found with that email. Please sign up for a membership first.",
    });
    return;
  }

  // Create session
  const sessionId = await createSession(user.id);
  if (!sessionId) {
    res.status(500).json({ error: "Failed to create session." });
    return;
  }

  setSessionCookie(res, sessionId);

  // Get membership info
  const [membership] = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, user.id))
    .limit(1);

  console.log(`[Auth] Email login successful for ${email} (userId=${user.id})`);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: membership?.tier || "member",
      status: membership?.status || "active",
    },
  });
}

// ─── POST /api/auth/logout ───────────────────────────────────────────────────

export async function logout(req: Request, res: Response): Promise<void> {
  const session = (req as any).session;

  if (session?.sessionId) {
    // Delete session from database
    try {
      const db = (await getDb()) as any;
      if (db) {
        const { sessions } = await import("../drizzle/schema");
        await db.delete(sessions).where(eq(sessions.id, session.sessionId));
        console.log(`[Auth] Session destroyed for userId=${session.userId}`);
      }
    } catch (err) {
      console.error("[Auth] Failed to delete session from DB:", err);
    }
  }

  clearSessionCookie(res);
  res.json({ success: true });
}

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
// Returns current user info if authenticated

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const session = (req as any).session;

  if (!session?.userId) {
    res.status(401).json({ error: "Not authenticated", authenticated: false });
    return;
  }

  const db = (await getDb()) as any;
  if (!db) {
    res.status(503).json({ error: "Database unavailable." });
    return;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    clearSessionCookie(res);
    res.status(401).json({ error: "User not found", authenticated: false });
    return;
  }

  const [membership] = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, user.id))
    .limit(1);

  res.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: membership?.tier || "member",
      status: membership?.status || "active",
    },
  });
}

// ─── POST /api/auth/session-login ────────────────────────────────────────────
// Auto-login after Stripe checkout — uses the Stripe session ID to find the user

export async function sessionLoginFromStripe(req: Request, res: Response): Promise<void> {
  const { stripeSessionId } = req.body as { stripeSessionId?: string };

  if (!stripeSessionId) {
    res.status(400).json({ error: "stripeSessionId required." });
    return;
  }

  const db = (await getDb()) as any;
  if (!db) {
    res.status(503).json({ error: "Database unavailable." });
    return;
  }

  try {
    // Look up the Stripe session to get customer email
    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const customerEmail =
      stripeSession.customer_email || stripeSession.customer_details?.email;

    if (!customerEmail) {
      res.status(404).json({ error: "No email found for this checkout session." });
      return;
    }

    // Find the user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, customerEmail.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      // User might not have been created yet (webhook delay) — retry once
      res.status(404).json({
        error: "Account not yet created. Please wait a moment and try again.",
      });
      return;
    }

    // Create session
    const sessionId = await createSession(user.id);
    if (!sessionId) {
      res.status(500).json({ error: "Failed to create session." });
      return;
    }

    setSessionCookie(res, sessionId);

    const [membership] = await db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, user.id))
      .limit(1);

    console.log(`[Auth] Auto-login after Stripe checkout for ${customerEmail} (userId=${user.id})`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: membership?.tier || "member",
        status: membership?.status || "active",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Auth] Session login from Stripe failed:", message);
    res.status(500).json({ error: "Failed to create session from checkout." });
  }
}
