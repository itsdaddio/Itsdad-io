/**
 * server/mailerlite.ts
 *
 * MailerLite API integration for Its Dad LLC.
 * Handles subscriber upserts and group assignments for paid members.
 *
 * Environment variables required:
 *   MAILERLITE_API_KEY            — MailerLite API key (v2 or v3)
 *   MAILERLITE_PAID_MEMBERS_GROUP_ID — Group ID for paid members
 *
 * API Reference: https://developers.mailerlite.com/docs/subscribers
 */

const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api";

interface UpsertSubscriberOptions {
  email: string;
  name?: string;
  groups?: string[];
  status?: "active" | "unsubscribed" | "unconfirmed" | "bounced" | "junk";
  fields?: Record<string, string | number | boolean>;
}

interface UpsertSubscriberResult {
  success: boolean;
  subscriberId?: string;
  error?: string;
}

/**
 * Upsert a subscriber in MailerLite.
 * Creates the subscriber if they don't exist; updates if they do.
 * Optionally assigns them to one or more groups.
 */
export async function upsertSubscriber(
  options: UpsertSubscriberOptions
): Promise<UpsertSubscriberResult> {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    console.warn("[MailerLite] MAILERLITE_API_KEY not set — subscriber sync skipped.");
    return { success: false, error: "MAILERLITE_API_KEY not configured" };
  }

  const { email, name, groups, status = "active", fields = {} } = options;

  // Build the subscriber payload
  const payload: Record<string, unknown> = {
    email,
    status,
    fields: {
      name: name || "",
      ...fields,
    },
  };

  if (groups && groups.length > 0) {
    payload.groups = groups;
  }

  try {
    const response = await fetch(`${MAILERLITE_API_BASE}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`MailerLite API error ${response.status}: ${body}`);
    }

    const data = (await response.json()) as { data?: { id?: string } };
    const subscriberId = data?.data?.id;

    console.log(`[MailerLite] Subscriber upserted: ${email} (id: ${subscriberId})`);
    return { success: true, subscriberId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[MailerLite] Failed to upsert subscriber ${email}: ${message}`);
    return { success: false, error: message };
  }
}

/**
 * Add an existing subscriber to a MailerLite group by subscriber ID.
 */
export async function addSubscriberToGroup(
  subscriberId: string,
  groupId: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return { success: false, error: "MAILERLITE_API_KEY not configured" };

  try {
    const response = await fetch(
      `${MAILERLITE_API_BASE}/subscribers/${subscriberId}/groups/${groupId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`MailerLite group assign error ${response.status}: ${body}`);
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[MailerLite] Failed to add subscriber ${subscriberId} to group ${groupId}: ${message}`);
    return { success: false, error: message };
  }
}
