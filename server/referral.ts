/**
 * server/referral.ts
 *
 * Its Dad LLC — Alliance Referral System
 *
 * Handles:
 * - Referral code generation (unique per member)
 * - Referral link tracking (who signed up via whom)
 * - Free month reward logic (1 referral = 1 free month)
 * - Direct commission tracking (30-40% based on tier)
 * - Second-tier commission tracking (6.7% override)
 * - Challenge a Friend share text generation
 * - Alliance dashboard stats API
 */

import { Request, Response } from "express";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import * as referralSchema from "../drizzle/schema-referral";
import { eq, and, desc, sql } from "drizzle-orm";
import crypto from "crypto";

// ─── Commission Rates ─────────────────────────────────────────────────────────
// Tier IDs match frontend Memberships.tsx: starter | builder | inner-circle
const DIRECT_COMMISSION_RATES: Record<string, number> = {
  "starter":      0.30, // 30% direct commission
  "builder":      0.35, // 35% direct commission
  "inner-circle": 0.40, // 40% direct commission
};
const SECOND_TIER_RATE = 0.067; // 6.7% Alliance override on direct commissions

// ─── Tier Monthly Prices (cents) ──────────────────────────────────────────────
const TIER_PRICES_CENTS: Record<string, number> = {
  "starter":      999,  // $9.99/mo
  "builder":      1999, // $19.99/mo
  "inner-circle": 2499, // $24.99/mo
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateCode(userId: number): string {
  const hash = crypto
    .createHash("sha256")
    .update(`itsdad-${userId}-${Date.now()}`)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase();
  return `DAD-${hash}`;
}

function getSessionUserId(req: Request): number | null {
  const session = (req as any).session;
  return session?.userId ?? null;
}

// ─── GET /api/referral/code ───────────────────────────────────────────────────
// Returns (or creates) the referral code for the logged-in user
export async function getReferralCode(req: Request, res: Response): Promise<void> {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  // Check if code already exists
  const existing = await db
    .select()
    .from(referralSchema.referralCodes)
    .where(eq(referralSchema.referralCodes.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const appUrl = process.env.VITE_APP_URL || "https://itsdad.io";
    res.json({
      code: existing[0].code,
      link: `${appUrl}/?ref=${existing[0].code}`,
      totalSignups: existing[0].totalSignups,
      totalEarnedCents: existing[0].totalEarnedCents,
    });
    return;
  }

  // Create new code
  const code = generateCode(userId);
  await db.insert(referralSchema.referralCodes).values({ userId, code });
  const appUrl = process.env.VITE_APP_URL || "https://itsdad.io";
  res.json({
    code,
    link: `${appUrl}/?ref=${code}`,
    totalSignups: 0,
    totalEarnedCents: 0,
  });
}

// ─── GET /api/referral/stats ──────────────────────────────────────────────────
// Returns full Alliance stats for the dashboard
export async function getReferralStats(req: Request, res: Response): Promise<void> {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  const [codeRow] = await db
    .select()
    .from(referralSchema.referralCodes)
    .where(eq(referralSchema.referralCodes.userId, userId))
    .limit(1);

  const signups = await db
    .select()
    .from(referralSchema.referralSignups)
    .where(eq(referralSchema.referralSignups.referrerId, userId))
    .orderBy(desc(referralSchema.referralSignups.createdAt))
    .limit(20);

  const commissions = await db
    .select()
    .from(referralSchema.allianceCommissions)
    .where(eq(referralSchema.allianceCommissions.earnerId, userId))
    .orderBy(desc(referralSchema.allianceCommissions.createdAt))
    .limit(50);

  const freeMonths = await db
    .select()
    .from(referralSchema.freeMonthRewards)
    .where(
      and(
        eq(referralSchema.freeMonthRewards.userId, userId),
        eq(referralSchema.freeMonthRewards.applied, false)
      )
    );

  const totalEarnedCents = commissions.reduce((sum, c) => sum + c.amountCents, 0);
  const pendingFreeMonths = freeMonths.length;

  const appUrl = process.env.VITE_APP_URL || "https://itsdad.io";
  res.json({
    code: codeRow?.code ?? null,
    link: codeRow ? `${appUrl}/?ref=${codeRow.code}` : null,
    totalSignups: codeRow?.totalSignups ?? 0,
    totalEarnedCents,
    pendingFreeMonths,
    recentSignups: signups,
    recentCommissions: commissions,
  });
}

// ─── POST /api/referral/track ─────────────────────────────────────────────────
// Called when a new user signs up with a referral code
// Body: { referralCode, newUserId, tier }
export async function trackReferralSignup(req: Request, res: Response): Promise<void> {
  const { referralCode, newUserId, tier } = req.body;
  if (!referralCode || !newUserId || !tier) {
    res.status(400).json({ error: "Missing referralCode, newUserId, or tier" });
    return;
  }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  // Find the referral code owner
  const [codeRow] = await db
    .select()
    .from(referralSchema.referralCodes)
    .where(eq(referralSchema.referralCodes.code, referralCode))
    .limit(1);

  if (!codeRow) { res.status(404).json({ error: "Invalid referral code" }); return; }

  const referrerId = codeRow.userId;

  // Record the signup
  const [signup] = await db
    .insert(referralSchema.referralSignups)
    .values({
      referrerId,
      referredUserId: newUserId,
      referralCode,
      tier,
      freeMonthGranted: false,
    })
    .$returningId();

  // Grant free month to referrer
  await db.insert(referralSchema.freeMonthRewards).values({
    userId: referrerId,
    referralSignupId: signup.id,
    applied: false,
  });

  // Mark free month granted on signup record
  await db
    .update(referralSchema.referralSignups)
    .set({ freeMonthGranted: true })
    .where(eq(referralSchema.referralSignups.id, signup.id));

  // Update referral code stats
  await db
    .update(referralSchema.referralCodes)
    .set({ totalSignups: sql`total_signups + 1` })
    .where(eq(referralSchema.referralCodes.userId, referrerId));

  // Record direct commission for referrer
  const tierPrice = TIER_PRICES_CENTS[tier] ?? 999;
  const rate = DIRECT_COMMISSION_RATES[tier] ?? 0.30;
  const directCommissionCents = Math.floor(tierPrice * rate);

  await db.insert(referralSchema.allianceCommissions).values({
    earnerId: referrerId,
    sourceUserId: newUserId,
    type: "direct",
    amountCents: directCommissionCents,
    rate: String(rate),
    description: `Direct commission — ${tier} signup via ${referralCode}`,
    paid: false,
  });

  // Check if referrer was themselves referred — if so, apply 6.7% second-tier
  const [referrerSignup] = await db
    .select()
    .from(referralSchema.referralSignups)
    .where(eq(referralSchema.referralSignups.referredUserId, referrerId))
    .limit(1);

  if (referrerSignup) {
    const secondTierEarnerId = referrerSignup.referrerId;
    const secondTierCents = Math.floor(directCommissionCents * SECOND_TIER_RATE);

    await db.insert(referralSchema.allianceCommissions).values({
      earnerId: secondTierEarnerId,
      sourceUserId: newUserId,
      type: "second_tier",
      amountCents: secondTierCents,
      rate: String(SECOND_TIER_RATE),
      description: `6.7% Alliance override — ${tier} signup (2nd tier via user ${referrerId})`,
      paid: false,
    });
  }

  res.json({ success: true, message: "Referral tracked. Free month granted to referrer." });
}

// ─── GET /api/referral/challenge-text ─────────────────────────────────────────
// Returns pre-written Challenge a Friend share text for the logged-in user
export async function getChallengeText(req: Request, res: Response): Promise<void> {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  let codeRow = (await db
    .select()
    .from(referralSchema.referralCodes)
    .where(eq(referralSchema.referralCodes.userId, userId))
    .limit(1))[0];

  if (!codeRow) {
    const code = generateCode(userId);
    await db.insert(referralSchema.referralCodes).values({ userId, code });
    codeRow = { userId, code, totalSignups: 0, totalEarnedCents: 0 } as any;
  }

  const appUrl = process.env.VITE_APP_URL || "https://itsdad.io";
  const link = `${appUrl}/?ref=${codeRow.code}`;

  res.json({
    sms: `You're always talking about wanting to build another income stream. Stop talking. I just joined the Founding 500 at itsdad.io. It's an affiliate system with 51 done-for-you products. I'm challenging you to do this with me. Link: ${link}`,
    social: `Tired of trying to figure out how to make money online by myself. Just joined the Founding 500 at itsdad.io. 51 products, 4 tiers, and an actual system that works. Who is building with me? ${link} #itsdad #founding500 #affiliatemarketing`,
    link,
  });
}
