/**
 * server/adminDashboard.ts
 *
 * Admin Dashboard API for itsdad.io
 * Protected endpoint — only accessible with admin PIN.
 *
 * GET /api/admin/dashboard?pin=XXXX
 *
 * Returns: members by tier, revenue summary, recent signups,
 *          email captures, product clicks, referral stats.
 */
import { Request, Response } from "express";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import * as referralSchema from "../drizzle/schema-referral";
import * as emailSchema from "../drizzle/schema-email-sequences";
import { sql, desc, eq, count } from "drizzle-orm";

// Admin PIN — set in Railway env, fallback for dev
const ADMIN_PIN = process.env.ADMIN_DASHBOARD_PIN || "DAD2026";

export async function getAdminDashboard(req: Request, res: Response): Promise<void> {
  const { pin } = req.query;
  if (pin !== ADMIN_PIN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const db = await getDb() as any;
  if (!db) {
    res.status(503).json({ error: "Database unavailable" });
    return;
  }

  try {
    // ── Members by tier ──
    const tierCounts = await db
      .select({
        tier: schema.memberships.tier,
        status: schema.memberships.status,
        total: count(),
      })
      .from(schema.memberships)
      .groupBy(schema.memberships.tier, schema.memberships.status);

    // ── Total users ──
    const [userCount] = await db
      .select({ total: count() })
      .from(schema.users);

    // ── Recent signups (last 20) ──
    const recentSignups = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt))
      .limit(20);

    // ── Recent memberships (last 20) ──
    const recentMemberships = await db
      .select({
        id: schema.memberships.id,
        userId: schema.memberships.userId,
        tier: schema.memberships.tier,
        status: schema.memberships.status,
        createdAt: schema.memberships.createdAt,
      })
      .from(schema.memberships)
      .orderBy(desc(schema.memberships.createdAt))
      .limit(20);

    // ── Email captures ──
    const [captureCount] = await db
      .select({ total: count() })
      .from(schema.blueprintCaptures);

    const recentCaptures = await db
      .select({
        id: schema.blueprintCaptures.id,
        email: schema.blueprintCaptures.email,
        name: schema.blueprintCaptures.name,
        source: schema.blueprintCaptures.source,
        createdAt: schema.blueprintCaptures.createdAt,
      })
      .from(schema.blueprintCaptures)
      .orderBy(desc(schema.blueprintCaptures.createdAt))
      .limit(20);

    // ── Product clicks ──
    const [clickCount] = await db
      .select({ total: count() })
      .from(schema.affiliateClicks);

    const [conversionCount] = await db
      .select({ total: count() })
      .from(schema.affiliateClicks)
      .where(eq(schema.affiliateClicks.converted, 1));

    // ── Referral signups ──
    const [referralCount] = await db
      .select({ total: count() })
      .from(referralSchema.referralSignups);

    // ── Commissions total ──
    const commissionResult = await db
      .select({
        totalCents: sql<number>`COALESCE(SUM(${referralSchema.allianceCommissions.amountCents}), 0)`,
        totalCount: count(),
      })
      .from(referralSchema.allianceCommissions);

    // ── Email sequences ──
    const emailStats = await db
      .select({
        status: emailSchema.emailSequenceQueue.status,
        total: count(),
      })
      .from(emailSchema.emailSequenceQueue)
      .groupBy(emailSchema.emailSequenceQueue.status);

    res.json({
      timestamp: new Date().toISOString(),
      overview: {
        totalUsers: userCount?.total || 0,
        totalEmailCaptures: captureCount?.total || 0,
        totalProductClicks: clickCount?.total || 0,
        totalConversions: conversionCount?.total || 0,
        totalReferralSignups: referralCount?.total || 0,
        totalCommissionsCents: commissionResult[0]?.totalCents || 0,
        totalCommissionsCount: commissionResult[0]?.totalCount || 0,
      },
      membersByTier: tierCounts,
      recentSignups,
      recentMemberships,
      recentEmailCaptures: recentCaptures,
      emailSequenceStats: emailStats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[AdminDashboard] Error: ${message}`);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
}
