/**
 * server/_core/email.ts
 *
 * Transactional email sender for itsdad.io.
 * Supports SendGrid (primary) with a console-log fallback for development.
 *
 * Environment variables required:
 *   SENDGRID_API_KEY  — SendGrid API key
 *   EMAIL_FROM        — Verified sender address (e.g., hello@itsdad.io)
 *   EMAIL_FROM_NAME   — Sender display name (e.g., itsdad.io)
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── SendGrid Sender ──────────────────────────────────────────────────────────

async function sendViaSendGrid(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error("SENDGRID_API_KEY not configured");

  const fromEmail = process.env.EMAIL_FROM || "hello@itsdad.io";
  const fromName = process.env.EMAIL_FROM_NAME || "itsdad.io";

  const payload = {
    personalizations: [{ to: [{ email: options.to }] }],
    from: { email: fromEmail, name: fromName },
    reply_to: options.replyTo
      ? { email: options.replyTo }
      : { email: fromEmail, name: fromName },
    subject: options.subject,
    content: [{ type: "text/html", value: options.html }],
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid error ${response.status}: ${body}`);
  }

  // SendGrid returns 202 with no body on success
  const messageId = response.headers.get("x-message-id") || undefined;
  return { success: true, messageId };
}

// ─── Dev Console Fallback ─────────────────────────────────────────────────────

function sendViaConsole(options: SendEmailOptions): SendEmailResult {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║  [DEV EMAIL — Not actually sent]                 ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log(`  To:      ${options.to}`);
  console.log(`  Subject: ${options.subject}`);
  console.log(`  Body:    [HTML — ${options.html.length} chars]`);
  console.log("══════════════════════════════════════════════════\n");
  return { success: true, messageId: `dev-${Date.now()}` };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a transactional email.
 * Uses SendGrid in production; falls back to console logging in development.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const isDev = process.env.NODE_ENV !== "production";
  const hasSendGrid = !!process.env.SENDGRID_API_KEY;

  if (!hasSendGrid) {
    if (!isDev) {
      console.error("[Email] SENDGRID_API_KEY not set in production — email not sent.");
      return { success: false, error: "Email provider not configured" };
    }
    return sendViaConsole(options);
  }

  try {
    return await sendViaSendGrid(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Email] Failed to send to ${options.to}: ${message}`);

    if (isDev) {
      console.warn("[Email] Falling back to console output in dev mode.");
      return sendViaConsole(options);
    }

    return { success: false, error: message };
  }
}
