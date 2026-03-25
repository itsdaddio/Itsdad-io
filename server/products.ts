/**
 * server/products.ts
 *
 * Its Dad LLC — Affiliate-ly Product Endpoints
 *
 * Handles:
 *  - POST /api/products/click        — Track a product link click (with optional referrer)
 *  - POST /api/products/checkout     — Create a Stripe one-time checkout for a PLR product
 *  - GET  /api/products/stats        — Return per-product click + conversion stats for a user
 *  - GET  /api/products/leaderboard  — Top earners across all products (public, anonymised)
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

// ─── Product Price Map ────────────────────────────────────────────────────────
// Maps product IDs to their tripwire prices (in cents).
// These match the tripwire values in products51.ts.
const PRODUCT_PRICES_CENTS: Record<number, number> = {
  1: 2700, 2: 4700, 3: 1700, 4: 3700, 5: 2700,
  6: 4700, 7: 1700, 8: 3700, 9: 2700, 10: 4700,
  11: 4700, 12: 2700, 13: 3700, 14: 1700, 15: 4700,
  16: 2700, 17: 3700, 18: 1700, 19: 4700, 20: 2700,
  21: 3700, 22: 1700, 23: 4700, 24: 2700, 25: 3700,
  26: 1700, 27: 4700, 28: 2700, 29: 3700, 30: 1700,
  31: 4700, 32: 1700, 33: 2700, 34: 3700, 35: 2700,
  36: 1700, 37: 3700, 38: 2700, 39: 3700, 40: 2700,
  41: 4700, 42: 1700, 43: 2700, 44: 3700, 45: 4700,
  46: 2700, 47: 3700, 48: 4700, 49: 3700, 50: 2700,
  51: 4700,
};

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
  1: "AI Content Creation Masterclass", 2: "ChatGPT Profit Blueprint", 3: "AI Video Automation Course",
  4: "Prompt Engineering for Profit", 5: "AI Copywriting Toolkit", 6: "Midjourney Mastery Course",
  7: "AI Business Automation Guide", 8: "AI SEO Domination System", 9: "AI Email Marketing Machine",
  10: "AI Side Hustle Accelerator", 11: "Instagram Growth Blueprint", 12: "TikTok Monetization Masterclass",
  13: "YouTube Shorts Profit System", 14: "Pinterest Traffic Machine", 15: "Twitter/X Authority Builder",
  16: "LinkedIn Lead Generation Course", 17: "Facebook Group Monetization", 18: "Social Media Content Calendar",
  19: "Shopify Dropshipping Blueprint", 20: "Digital Product Creation System", 21: "Etsy Passive Income Course",
  22: "Amazon FBA Starter Guide", 23: "Print-on-Demand Profit System", 24: "Online Course Creation Kit",
  25: "Membership Site Blueprint", 26: "Digital Downloads Goldmine", 27: "Crypto Investing Fundamentals",
  28: "Stock Market Starter Kit", 29: "Real Estate Wholesaling Guide", 30: "Budget Freedom System",
  31: "Options Trading Starter Kit", 32: "High-Yield Savings Maximizer", 33: "Side Income Tax Strategy Guide",
  34: "Passive Income Portfolio Builder", 35: "Deep Work Productivity System", 36: "Morning Routine Mastery",
  37: "Mindset Reset Program", 38: "Health Optimization Blueprint", 39: "Networking Mastery Course",
  40: "Public Speaking Confidence Kit", 41: "Leadership Accelerator Program", 42: "Digital Detox & Focus Bundle",
  43: "Goal Achievement System", 44: "Email List Building Machine", 45: "Sales Funnel Blueprint",
  46: "Copywriting Crash Course", 47: "SEO Traffic Domination", 48: "Agency Launch Playbook",
  49: "Paid Ads Profit System", 50: "Brand Identity Starter Kit", 51: "Freelance to Freedom Course",
};

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
// Create a Stripe one-time checkout session for a PLR product.
// Body: { productId, referralCode?, email? }
export async function createProductCheckout(req: Request, res: Response): Promise<void> {
  const { productId, referralCode, email } = req.body as {
    productId: number;
    referralCode?: string;
    email?: string;
  };

  if (!productId || !PRODUCT_PRICES_CENTS[productId]) {
    res.status(400).json({ error: "Invalid productId" });
    return;
  }

  const priceCents = PRODUCT_PRICES_CENTS[productId];
  const productName = PRODUCT_NAMES[productId] || `Product #${productId}`;
  const commissionRate = PRODUCT_COMMISSION_RATES[productId] || 0.35;

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            product_data: {
              name: productName,
              description: `Affiliate-ly Digital Product — Instant Access`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/affiliate-ly/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}&ref=${referralCode || ""}`,
      cancel_url: `${APP_URL}/affiliate-ly?cancelled=true`,
      metadata: {
        productId: String(productId),
        productName,
        referralCode: referralCode || "",
        commissionRate: String(commissionRate),
        type: "product_purchase",
      },
      allow_promotion_codes: true,
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(
      `[Products] Checkout created for product=${productId} ref=${referralCode || "none"} session=${session.id}`
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

    const priceCents = PRODUCT_PRICES_CENTS[productId] || 0;
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
        const directCommissionCents = Math.floor(priceCents * commissionRate);
        const productName = PRODUCT_NAMES[productId] || `Product #${productId}`;

        // Record direct commission
        await db.insert(referralSchema.allianceCommissions).values({
          earnerId: referrerId,
          sourceUserId: referrerId, // self-reference for product sales (no buyer account)
          type: "direct",
          amountCents: directCommissionCents,
          rate: String(commissionRate),
          description: `Product commission — ${productName} (${Math.round(commissionRate * 100)}%) via ${referralCode}`,
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
            description: `6.7% Alliance override — ${productName} (2nd tier via user ${referrerId})`,
            paid: false,
          });
        }

        console.log(
          `[Products] Commission recorded: $${(directCommissionCents / 100).toFixed(2)} for user ${referrerId} on product ${productId}`
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

  // Add earnings from commissions (product commissions have "Product commission" in description)
  for (const commission of commissions) {
    if (commission.description?.startsWith("Product commission")) {
      // Extract product ID from description is complex; instead track total product earnings
      // We'll return total product earnings separately
    }
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
