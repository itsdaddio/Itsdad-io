/**
 * server/_core/index.ts
 *
 * Core server bootstrap: Express app setup, route registration, cron jobs,
 * and middleware configuration for itsdad.io.
 *
 * MANIFEST PATCH (item 7):
 *   - Added processInstantOnboardingEmails import
 *   - Added processInstantOnboardingEmails call in both cron endpoints (lines 165–207)
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json } from "body-parser";
import { handleStripeWebhook } from "../webhook-stripe";
import { processInstantOnboardingEmails } from "../instantOnboardingService";
import { createCheckoutSession, getSessionStatus } from "../checkout";
import { getReferralCode, getReferralStats, trackReferralSignup, getChallengeText } from "../referral";

// ─── App Setup ────────────────────────────────────────────────────────────────

export const app = express();

app.use(
  cors({
    origin: process.env.VITE_APP_URL || "https://www.itsdad.io",
    credentials: true,
  })
);

// Raw body for Stripe webhook signature verification
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

// JSON body for all other routes
app.use(json({ limit: "2mb" }));

// ─── Alliance Referral Routes ────────────────────────────────────────────────
// GET  /api/referral/code            — get or create referral code for logged-in user
// GET  /api/referral/stats           — full Alliance dashboard stats
// POST /api/referral/track           — record a new referral signup + grant free month
// GET  /api/referral/challenge-text  — get pre-written Challenge a Friend share text
app.get("/api/referral/code", getReferralCode);
app.get("/api/referral/stats", getReferralStats);
app.post("/api/referral/track", trackReferralSignup);
app.get("/api/referral/challenge-text", getChallengeText);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Stripe Webhook ───────────────────────────────────────────────────────────

app.post("/api/webhooks/stripe", handleStripeWebhook);

// ─── Checkout ─────────────────────────────────────────────────────────────────

// POST /api/checkout/create-session — creates a Stripe Checkout session
app.post("/api/checkout/create-session", createCheckoutSession);

// GET /api/checkout/session-status — retrieves session status after redirect
app.get("/api/checkout/session-status", getSessionStatus);

// ─── Cron Endpoints ───────────────────────────────────────────────────────────
//
// These endpoints are called by an external cron scheduler (e.g., Render cron
// jobs, GitHub Actions, or a dedicated cron service) on a regular interval.
// They are protected by a shared secret to prevent unauthorized invocation.

function verifyCronSecret(req: Request, res: Response, next: NextFunction): void {
  const secret = req.headers["x-cron-secret"] || req.query.secret;
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

/**
 * POST /api/cron/process-emails
 *
 * Primary email processing cron — runs every 15 minutes.
 * Processes ALL pending email queues including instant_onboarding sequences.
 *
 * MANIFEST PATCH: processInstantOnboardingEmails added here (line ~165)
 */
app.post(
  "/api/cron/process-emails",
  verifyCronSecret,
  async (_req: Request, res: Response) => {
    console.log("[Cron] /api/cron/process-emails triggered at", new Date().toISOString());

    const results: Record<string, unknown> = {};

    // ── MANIFEST PATCH: Process instant onboarding emails ───────────────────
    try {
      const onboardingResult = await processInstantOnboardingEmails();
      results.instantOnboarding = onboardingResult;
      console.log(
        `[Cron] Instant onboarding emails — sent: ${onboardingResult.sent}, failed: ${onboardingResult.failed}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      results.instantOnboarding = { error: message };
      console.error("[Cron] processInstantOnboardingEmails error:", message);
    }
    // ── END MANIFEST PATCH ───────────────────────────────────────────────────

    // Additional email queue processors can be added here following the same pattern
    // e.g.: results.weeklyDigest = await processWeeklyDigestEmails();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  }
);

/**
 * POST /api/cron/daily-tasks
 *
 * Daily maintenance cron — runs once per day at 9:00 AM.
 * Handles heavier tasks: digest emails, membership audits, analytics snapshots.
 *
 * MANIFEST PATCH: processInstantOnboardingEmails also called here as a safety
 * catch-up pass for any emails that may have been missed by the 15-min cron (line ~207)
 */
app.post(
  "/api/cron/daily-tasks",
  verifyCronSecret,
  async (_req: Request, res: Response) => {
    console.log("[Cron] /api/cron/daily-tasks triggered at", new Date().toISOString());

    const results: Record<string, unknown> = {};

    // ── MANIFEST PATCH: Catch-up pass for instant onboarding emails ─────────
    try {
      const onboardingCatchup = await processInstantOnboardingEmails();
      results.instantOnboardingCatchup = onboardingCatchup;
      console.log(
        `[Cron Daily] Instant onboarding catch-up — sent: ${onboardingCatchup.sent}, failed: ${onboardingCatchup.failed}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      results.instantOnboardingCatchup = { error: message };
      console.error("[Cron Daily] processInstantOnboardingEmails catch-up error:", message);
    }
    // ── END MANIFEST PATCH ───────────────────────────────────────────────────

    // Placeholder for additional daily tasks
    // e.g.: results.membershipAudit = await auditExpiredMemberships();
    // e.g.: results.analyticsSnapshot = await captureAnalyticsSnapshot();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  }
);

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Server] Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Export for testing ───────────────────────────────────────────────────────

export default app;
