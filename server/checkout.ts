/**
 * server/checkout.ts
 *
 * Stripe Checkout Session API for Its Dad LLC.
 *
 * Endpoints:
 *   POST /api/checkout/create-session  — creates a Stripe Checkout session
 *   GET  /api/checkout/success         — handles post-payment success redirect
 *   GET  /api/checkout/cancel          — handles cancelled checkout redirect
 *
 * Membership tiers:
 *   boss     $9.99/mo  — $1 trial for 7 days
 *   chief    $19.99/mo — $1 trial for 7 days
 *   kingpin  $24.99/mo — $1 trial for 7 days
 */

import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const APP_URL = process.env.VITE_APP_URL || "https://www.itsdad.io";

// ─── Tier Configuration ───────────────────────────────────────────────────────

interface TierConfig {
  name: string;
  priceId: string;       // Stripe Price ID (set in env)
  trialDays: number;
  trialAmount: number;   // in cents ($1 = 100)
  fullPrice: string;     // display string
}

const TIER_CONFIG: Record<string, TierConfig> = {
  boss: {
    name: "Boss",
    priceId: process.env.STRIPE_PRICE_BOSS || "",
    trialDays: 7,
    trialAmount: 100, // $1.00
    fullPrice: "$9.99/mo",
  },
  chief: {
    name: "Chief",
    priceId: process.env.STRIPE_PRICE_CHIEF || "",
    trialDays: 7,
    trialAmount: 100,
    fullPrice: "$19.99/mo",
  },
  kingpin: {
    name: "Kingpin",
    priceId: process.env.STRIPE_PRICE_KINGPIN || "",
    trialDays: 7,
    trialAmount: 100,
    fullPrice: "$24.99/mo",
  },
};

// ─── POST /api/checkout/create-session ───────────────────────────────────────

export async function createCheckoutSession(req: Request, res: Response): Promise<void> {
  const { tier, email, promoCode } = req.body as {
    tier: string;
    email?: string;
    promoCode?: string;
  };

  if (!tier || !TIER_CONFIG[tier]) {
    res.status(400).json({ error: "Invalid membership tier. Must be boss, chief, or kingpin." });
    return;
  }

  const config = TIER_CONFIG[tier];

  if (!config.priceId) {
    console.error(`[Checkout] STRIPE_PRICE_${tier.toUpperCase()} env var not set`);
    res.status(500).json({ error: "Checkout not configured. Contact support." });
    return;
  }

  try {
    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      // $1 trial — charge $1 now, full price after 7 days
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        trial_period_days: config.trialDays,
        metadata: {
          tier,
          tierName: config.name,
        },
      },
      // Collect payment method upfront even during trial
      payment_method_collection: "always",
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url: `${APP_URL}/memberships?cancelled=true`,
      metadata: {
        tier,
        tierName: config.name,
        type: "affiliate",
      },
      allow_promotion_codes: true,
    };

    // Pre-fill email if provided
    if (email) {
      sessionParams.customer_email = email;
    }

    // Apply promo code if provided (admin-issued codes only)
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
        console.warn("[Checkout] Promo code lookup failed:", promoErr);
        // Continue without promo — don't block checkout
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(
      `[Checkout] Session created for tier=${tier} email=${email || "unknown"} session=${session.id}`
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Checkout] Failed to create session:", message);
    res.status(500).json({ error: "Failed to create checkout session. Please try again." });
  }
}

// ─── GET /api/checkout/session-status ────────────────────────────────────────

export async function getSessionStatus(req: Request, res: Response): Promise<void> {
  const { session_id } = req.query as { session_id: string };

  if (!session_id) {
    res.status(400).json({ error: "session_id required" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription", "customer"],
    });

    res.json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      tier: session.metadata?.tier,
      tierName: session.metadata?.tierName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Checkout] Failed to retrieve session:", message);
    res.status(500).json({ error: "Failed to retrieve session status." });
  }
}
