/**
 * server/products.ts
 *
 * Its Dad LLC — Affiliate-ly Product Endpoints
 *
 * Handles:
 *  - POST /api/products/click              — Track a product link click (with optional referrer)
 *  - POST /api/products/checkout           — Create a Stripe one-time checkout for a product (supports funnel types)
 *  - POST /api/products/purchase-complete  — Record purchase + attribute commission
 *  - GET  /api/products/stats              — Return per-product click + conversion stats for a user
 *
 * Funnel Types:
 *  - tripwire:  Entry-level product ($7–$47)
 *  - order-bump: Add-on at checkout ($17)
 *  - upsell:    Premium upgrade ($47–$197)
 *  - downsell:  Reduced alternative ($27)
 */

import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "./db";
import * as schema from "../drizzle/schema";
import * as referralSchema from "../drizzle/schema-referral";
import { eq, desc, sql, and } from "drizzle-orm";

// ─── Stripe ───────────────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

const APP_URL = process.env.VITE_APP_URL || "https://itsdad.io";

// ─── Product Price Maps ───────────────────────────────────────────────────────
// Tripwire prices (in cents) — the main entry-level product price
const PRODUCT_PRICES_CENTS: Record<number, number> = {
  1: 700, 2: 700, 3: 700, 4: 700, 5: 700,
  6: 700, 7: 700, 8: 700, 9: 700, 10: 700,
  11: 700, 12: 700, 13: 700, 14: 700, 15: 700,
  16: 700, 17: 700, 18: 700, 19: 700, 20: 700,
  21: 700, 22: 700, 23: 700, 24: 700, 25: 700,
  26: 700, 27: 700, 28: 700, 29: 700, 30: 700,
  31: 700, 32: 700, 33: 700, 34: 700, 35: 700,
  36: 700, 37: 700, 38: 700, 39: 700, 40: 700,
  41: 700, 42: 700, 43: 700, 44: 700, 45: 700,
  46: 700, 47: 700, 48: 700, 49: 700, 50: 700,
  51: 700,
};

// Order bump prices (in cents) — $17 add-on at checkout
const ORDER_BUMP_PRICES_CENTS: Record<number, number> = {};
for (let i = 1; i <= 51; i++) ORDER_BUMP_PRICES_CENTS[i] = 1700;

// Upsell prices (in cents) — varies by product
const UPSELL_PRICES_CENTS: Record<number, number> = {
  1: 6700, 2: 6700, 3: 9700, 4: 7700, 5: 9700,
  6: 7700, 7: 7700, 8: 6700, 9: 9700, 10: 6700,
  11: 6700, 12: 6700, 13: 6700, 14: 6700, 15: 6700,
  16: 6700, 17: 6700, 18: 6700, 19: 6700, 20: 6700,
  21: 9700, 22: 6700, 23: 14700, 24: 5700, 25: 9700,
  26: 19700, 27: 14700, 28: 19700, 29: 6700, 30: 19700,
  31: 9700, 32: 9700, 33: 14700, 34: 6700, 35: 6700,
  36: 4700, 37: 9700, 38: 14700, 39: 14700, 40: 9700,
  41: 4700, 42: 6700, 43: 4700, 44: 9700, 45: 6700,
  46: 9700, 47: 4700, 48: 6700, 49: 4700, 50: 4700,
  51: 6700,
};

// Downsell prices (in cents) — $27 for all
const DOWNSELL_PRICES_CENTS: Record<number, number> = {};
for (let i = 1; i <= 51; i++) DOWNSELL_PRICES_CENTS[i] = 2700;

// Commission rates per product (30–40%)
const PRODUCT_COMMISSION_RATES: Record<number, number> = {
  1: 0.40, 2: 0.35, 3: 0.40, 4: 0.35, 5: 0.40,
  6: 0.35, 7: 0.40, 8: 0.35, 9: 0.40, 10: 0.35,
  11: 0.40, 12: 0.35, 13: 0.40, 14: 0.35, 15: 0.40,
  16: 0.35, 17: 0.40, 18: 0.35, 19: 0.40, 20: 0.35,
  21: 0.40, 22: 0.35, 23: 0.40, 24: 0.35, 25: 0.40,
  26: 0.35, 27: 0.40, 28: 0.35, 29: 0.40, 30: 0.35,
  31: 0.40, 32: 0.35, 33: 0.40, 34: 0.35, 35: 0.40,
  36: 0.35, 37: 0.40, 38: 0.35, 39: 0.40, 40: 0.35,
  41: 0.40, 42: 0.35, 43: 0.40, 44: 0.40, 45: 0.35,
  46: 0.40, 47: 0.35, 48: 0.40, 49: 0.35, 50: 0.40,
  51: 0.35,
};

// Product names for Stripe line items
const PRODUCT_NAMES: Record<number, string> = {
  1: "AI Starter Kit", 2: "AI Content Engine", 3: "AI Ad Creative Vault",
  4: "AI Email Profit Pack", 5: "Affiliate Funnel Templates", 6: "SEO Domination Guide",
  7: "YouTube Growth Accelerator", 8: "TikTok Viral Secrets", 9: "Copywriting Cash Machine",
  10: "Landing Page Mastery", 11: "Instagram Reels Mastery", 12: "TikTok Monetization Masterclass",
  13: "YouTube Shorts Profit System", 14: "Pinterest Traffic Machine", 15: "Twitter/X Authority Builder",
  16: "LinkedIn Lead Generation Course", 17: "Facebook Group Monetization", 18: "Social Media Content Calendar",
  19: "Shopify Dropshipping Blueprint", 20: "Digital Product Creation System", 21: "Dropshipping Accelerator",
  22: "Print on Demand Empire", 23: "Amazon FBA Starter", 24: "Etsy Shop Blueprint",
  25: "Digital Product Creator", 26: "Course Creation Mastery", 27: "Membership Site Builder",
  28: "Coaching Business Blueprint", 29: "Freelance Freedom Kit", 30: "Agency Launch System",
  31: "Crypto Trading Basics", 32: "Stock Market Starter", 33: "Real Estate Investing 101",
  34: "Credit Repair Blueprint", 35: "Debt Freedom System", 36: "Side Hustle Starter",
  37: "Passive Income Playbook", 38: "Tax Savings Secrets", 39: "Retirement Planning Kit",
  40: "NFT Profit System", 41: "Productivity Mastery", 42: "Public Speaking Secrets",
  43: "Networking Mastery", 44: "Personal Branding Blueprint", 45: "Negotiation Secrets",
  46: "Leadership Accelerator", 47: "Remote Work Mastery", 48: "Health & Energy Optimizer",
  49: "Mindset Mastery", 50: "Goal Achievement System", 51: "Ultimate Success Bundle",
};

// ─── Funnel Type → Price Resolution ──────────────────────────────────────────
type FunnelType = "tripwire" | "order-bump" | "upsell" | "downsell";

function resolveFunnelPrice(productId: number, funnelType: FunnelType): number {
  switch (funnelType) {
    case "order-bump": return ORDER_BUMP_PRICES_CENTS[productId] || 1700;
    case "upsell":     return UPSELL_PRICES_CENTS[productId] || 6700;
    case "downsell":   return DOWNSELL_PRICES_CENTS[productId] || 2700;
    case "tripwire":
    default:           return PRODUCT_PRICES_CENTS[productId] || 700;
  }
}

function funnelLabel(funnelType: FunnelType): string {
  switch (funnelType) {
    case "order-bump": return "Order Bump Add-On";
    case "upsell":     return "Premium Upgrade";
    case "downsell":   return "Lite Version";
    case "tripwire":
    default:           return "Instant Access";
  }
}

// ─── Helper: get session user ID ──────────────────────────────────────────────
function getSessionUserId(req: Request): number | null {
  const session = (req as any).session;
  return session?.userId ?? null;
}

// ─── POST /api/products/click ─────────────────────────────────────────────────
// Track a product link click. Body: { productId, referralCode? }
export async function trackProductClick(req: Request, res: Response): Promise<void> {
  const { productId, referralCode } = req.body as {
    productId: number;
    referralCode?: string;
  };

  if (!productId || typeof productId !== "number") {
    res.status(400).json({ error: "productId required" });
    return;
  }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  // Resolve referrer user ID from referral code (if provided)
  let referrerId: number | null = null;
  if (referralCode) {
    const [codeRow] = await db
      .select()
      .from(referralSchema.referralCodes)
      .where(eq(referralSchema.referralCodes.code, referralCode))
      .limit(1);
    if (codeRow) referrerId = codeRow.userId;
  }

  // Also check logged-in user
  const sessionUserId = getSessionUserId(req);
  if (!referrerId && sessionUserId) referrerId = sessionUserId;

  await db.insert(schema.affiliateClicks).values({
    referrerId,
    productId,
    ipAddress: (req.ip || "").slice(0, 45),
    userAgent: (req.headers["user-agent"] || "").slice(0, 500),
    converted: 0,
  });

  res.json({ success: true });
}

// ─── POST /api/products/checkout ──────────────────────────────────────────────
// Create a Stripe one-time checkout session for a product.
// Supports full funnel: tripwire, order-bump, upsell, downsell
// Body: { productId, referralCode?, email?, funnelType?, includeOrderBump?, promoCode? }
export async function createProductCheckout(req: Request, res: Response): Promise<void> {
  const { productId, referralCode, email, funnelType, includeOrderBump, promoCode } = req.body as {
    productId: number;
    referralCode?: string;
    email?: string;
    funnelType?: FunnelType;
    includeOrderBump?: boolean;
    promoCode?: string;
  };

  if (!productId || !PRODUCT_NAMES[productId]) {
    res.status(400).json({ error: "Invalid productId" });
    return;
  }

  const type: FunnelType = funnelType || "tripwire";
  const priceCents = resolveFunnelPrice(productId, type);
  const productName = PRODUCT_NAMES[productId] || `Product #${productId}`;
  const commissionRate = PRODUCT_COMMISSION_RATES[productId] || 0.35;

  try {
    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          unit_amount: priceCents,
          product_data: {
            name: productName,
            description: `${funnelLabel(type)} — Its Dad Digital Product`,
          },
        },
        quantity: 1,
      },
    ];

    // If order bump is included, add it as a second line item
    if (includeOrderBump && type === "tripwire") {
      const bumpPrice = ORDER_BUMP_PRICES_CENTS[productId] || 1700;
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: bumpPrice,
          product_data: {
            name: `${productName} — Bonus Pack`,
            description: "One-Time Order Bump Add-On",
          },
        },
        quantity: 1,
      });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${APP_URL}/affiliate-ly/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}&ref=${referralCode || ""}&funnel=${type}`,
      cancel_url: `${APP_URL}/product/${productId}?cancelled=true`,
      metadata: {
        productId: String(productId),
        productName,
        referralCode: referralCode || "",
        commissionRate: String(commissionRate),
        funnelType: type,
        includeOrderBump: includeOrderBump ? "true" : "false",
        type: "product_purchase",
      },
      allow_promotion_codes: true,
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    // Apply promo code if provided (admin-issued codes)
    if (promoCode) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        });
        if (promotionCodes.data.length > 0) {
          sessionParams.discounts = [
            { promotion_code: promotionCodes.data[0].id },
          ];
          // When using discounts, disable allow_promotion_codes
          delete sessionParams.allow_promotion_codes;
        }
      } catch (promoErr) {
        console.warn("[Products] Promo code lookup failed:", promoErr);
        // Continue without promo -- don't block checkout
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(
      `[Products] Checkout created: product=${productId} funnel=${type} bump=${includeOrderBump || false} ref=${referralCode || "none"} session=${session.id}`
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Products] Failed to create checkout:", message);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
}

// ─── POST /api/products/purchase-complete ─────────────────────────────────────
// Called from the success page to record the conversion and attribute commission.
// Body: { sessionId, productId, referralCode }
export async function recordProductPurchase(req: Request, res: Response): Promise<void> {
  const { sessionId, productId, referralCode } = req.body as {
    sessionId: string;
    productId: number;
    referralCode?: string;
  };

  if (!sessionId || !productId) {
    res.status(400).json({ error: "sessionId and productId required" });
    return;
  }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  try {
    // Verify the Stripe session is paid
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession.payment_status !== "paid") {
      res.status(400).json({ error: "Payment not completed" });
      return;
    }

    // Get actual amount paid from the session
    const paidCents = stripeSession.amount_total || 0;
    const commissionRate = PRODUCT_COMMISSION_RATES[productId] || 0.35;

    // Mark click as converted (most recent click for this product)
    await db
      .update(schema.affiliateClicks)
      .set({ converted: 1 })
      .where(
        and(
          eq(schema.affiliateClicks.productId, productId),
          eq(schema.affiliateClicks.converted, 0)
        )
      );

    // If there's a referral code, attribute commission
    if (referralCode) {
      const [codeRow] = await db
        .select()
        .from(referralSchema.referralCodes)
        .where(eq(referralSchema.referralCodes.code, referralCode))
        .limit(1);

      if (codeRow) {
        const referrerId = codeRow.userId;
        const directCommissionCents = Math.floor(paidCents * commissionRate);
        const productName = PRODUCT_NAMES[productId] || `Product #${productId}`;
        const funnelType = (stripeSession.metadata?.funnelType as string) || "tripwire";

        // Record direct commission
        await db.insert(referralSchema.allianceCommissions).values({
          earnerId: referrerId,
          sourceUserId: referrerId,
          type: "direct",
          amountCents: directCommissionCents,
          rate: String(commissionRate),
          description: `Product commission — ${productName} [${funnelType}] (${Math.round(commissionRate * 100)}%) via ${referralCode}`,
          paid: false,
        });

        // Update referral code total earnings
        await db
          .update(referralSchema.referralCodes)
          .set({ totalEarnedCents: sql`total_earned_cents + ${directCommissionCents}` })
          .where(eq(referralSchema.referralCodes.userId, referrerId));

        // Check for second-tier (if referrer was themselves referred)
        const [referrerSignup] = await db
          .select()
          .from(referralSchema.referralSignups)
          .where(eq(referralSchema.referralSignups.referredUserId, referrerId))
          .limit(1);

        if (referrerSignup) {
          const secondTierEarnerId = referrerSignup.referrerId;
          const secondTierCents = Math.floor(directCommissionCents * 0.067);
          await db.insert(referralSchema.allianceCommissions).values({
            earnerId: secondTierEarnerId,
            sourceUserId: referrerId,
            type: "second_tier",
            amountCents: secondTierCents,
            rate: "0.0670",
            description: `6.7% Alliance override — ${productName} [${funnelType}] (2nd tier via user ${referrerId})`,
            paid: false,
          });
        }

        console.log(
          `[Products] Commission recorded: $${(directCommissionCents / 100).toFixed(2)} for user ${referrerId} on product ${productId} [${funnelType}]`
        );
      }
    }

    res.json({ success: true, message: "Purchase recorded." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Products] Failed to record purchase:", message);
    res.status(500).json({ error: "Failed to record purchase." });
  }
}

// ─── GET /api/products/stats ──────────────────────────────────────────────────
// Returns per-product click + commission stats for the logged-in user.
export async function getProductStats(req: Request, res: Response): Promise<void> {
  const userId = getSessionUserId(req);
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const db = await getDb() as any;
  if (!db) { res.status(503).json({ error: "Database unavailable" }); return; }

  // Get all product commissions for this user
  const commissions = await db
    .select()
    .from(referralSchema.allianceCommissions)
    .where(
      and(
        eq(referralSchema.allianceCommissions.earnerId, userId),
        eq(referralSchema.allianceCommissions.type, "direct")
      )
    )
    .orderBy(desc(referralSchema.allianceCommissions.createdAt));

  // Get click stats
  const clicks = await db
    .select()
    .from(schema.affiliateClicks)
    .where(eq(schema.affiliateClicks.referrerId, userId));

  // Aggregate by product
  const productStats: Record<number, { clicks: number; conversions: number; earnedCents: number }> = {};

  for (const click of clicks) {
    if (!click.productId) continue;
    if (!productStats[click.productId]) {
      productStats[click.productId] = { clicks: 0, conversions: 0, earnedCents: 0 };
    }
    productStats[click.productId].clicks++;
    if (click.converted) productStats[click.productId].conversions++;
  }

  const productCommissions = commissions.filter(
    (c: any) => c.description?.startsWith("Product commission")
  );
  const totalProductEarningsCents = productCommissions.reduce(
    (sum: number, c: any) => sum + c.amountCents,
    0
  );

  res.json({
    productStats,
    totalProductEarningsCents,
    recentProductCommissions: productCommissions.slice(0, 10),
  });
}
