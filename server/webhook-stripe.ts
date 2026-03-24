/**
 * webhook-stripe.ts
 *
 * Stripe webhook handler for Its Dad LLC.
 * Processes payment events and triggers downstream actions including
 * membership activation, email onboarding sequences, and MailerLite sync.
 *
 * MANIFEST PATCH (items 6):
 *   - Added triggerInstantOnboarding import
 *   - Added triggerInstantOnboarding call in handleAffiliateMembership (~line 530)
 *   - Added triggerInstantOnboarding call in handleRentalMembership (~line 661)
 */

import Stripe from "stripe";
import { Request, Response } from "express";
import { getDb } from "./db";
import { users, memberships } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { triggerInstantOnboarding } from "./instantOnboardingService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// ─── Utility ──────────────────────────────────────────────────────────────────

function getMembershipTierFromPriceId(priceId: string): {
  tier: string;
  tierName: string;
} {
  // Map Stripe price IDs to internal tier names
  // Update these IDs to match your live Stripe dashboard
  const tierMap: Record<string, { tier: string; tierName: string }> = {
    [process.env.STRIPE_PRICE_STARTER_PACK || "price_starter_pack"]: {
      tier: "starter",
      tierName: "Starter Pack",
    },
    [process.env.STRIPE_PRICE_BUILDER_CLUB || "price_builder_club"]: {
      tier: "builder",
      tierName: "Builder Club",
    },
    [process.env.STRIPE_PRICE_PRO_CLUB || "price_pro_club"]: {
      tier: "pro-creator",
      tierName: "Pro Creator",
    },
    [process.env.STRIPE_PRICE_INNER_CIRCLE_CLUB || "price_inner_circle_club"]: {
      tier: "inner-circle",
      tierName: "Inner Circle",
    },
  };

  return tierMap[priceId] || { tier: "member", tierName: "Member" };
}

// ─── Affiliate Membership Handler ─────────────────────────────────────────────

/**
 * handleAffiliateMembership
 * Activates an affiliate membership and fires the instant onboarding sequence.
 */
async function handleAffiliateMembership(
  session: Stripe.Checkout.Session
): Promise<void> {
  const db = await getDb() as any;
  if (!db) throw new Error("Database unavailable in handleAffiliateMembership");

  const customerEmail = session.customer_email || session.customer_details?.email;
  const customerName =
    session.customer_details?.name || customerEmail?.split("@")[0] || "Friend";
  const priceId =
    session.line_items?.data?.[0]?.price?.id ||
    (session as any).metadata?.priceId ||
    "";

  if (!customerEmail) {
    console.warn("[Stripe Webhook] handleAffiliateMembership: no customer email found");
    return;
  }

  // Look up or create user
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, customerEmail))
    .limit(1);

  let userId: number;
  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
  } else {
    const inserted = await db
      .insert(users)
      .values({
        email: customerEmail,
        name: customerName,
        stripeCustomerId: session.customer as string,
      })
      .$returningId();
    userId = inserted[0].id;
  }

  const { tier, tierName } = getMembershipTierFromPriceId(priceId);

  // Upsert membership record
  await db
    .insert(memberships)
    .values({
      userId,
      tier,
      stripeSessionId: session.id,
      stripeSubscriptionId: session.subscription as string | null,
      status: "active",
    })
    .onDuplicateKeyUpdate({ set: { tier, status: "active" } });

  console.log(`[Stripe Webhook] Affiliate membership activated for ${customerEmail} — tier: ${tierName}`);

  // ── MANIFEST PATCH: Trigger instant onboarding (line ~530) ──────────────────
  try {
    const onboardingResult = await triggerInstantOnboarding({
      userId,
      userEmail: customerEmail,
      userName: customerName,
      membershipTier: tier,
      tierName,
    });

    console.log(
      `[Stripe Webhook] Instant onboarding result for ${customerEmail}:`,
      JSON.stringify(onboardingResult)
    );
  } catch (onboardingError) {
    // Non-fatal — membership is already activated; log and continue
    console.error(
      `[Stripe Webhook] Instant onboarding failed for ${customerEmail}:`,
      onboardingError
    );
  }
  // ── END MANIFEST PATCH ───────────────────────────────────────────────────────
}

// ─── Rental Membership Handler ────────────────────────────────────────────────

/**
 * handleRentalMembership
 * Activates a rental membership and fires the instant onboarding sequence.
 */
async function handleRentalMembership(
  session: Stripe.Checkout.Session
): Promise<void> {
  const db = await getDb() as any;
  if (!db) throw new Error("Database unavailable in handleRentalMembership");

  const customerEmail = session.customer_email || session.customer_details?.email;
  const customerName =
    session.customer_details?.name || customerEmail?.split("@")[0] || "Friend";
  const priceId =
    session.line_items?.data?.[0]?.price?.id ||
    (session as any).metadata?.priceId ||
    "";

  if (!customerEmail) {
    console.warn("[Stripe Webhook] handleRentalMembership: no customer email found");
    return;
  }

  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, customerEmail))
    .limit(1);

  let userId: number;
  if (existingUsers.length > 0) {
    userId = existingUsers[0].id;
  } else {
    const inserted = await db
      .insert(users)
      .values({
        email: customerEmail,
        name: customerName,
        stripeCustomerId: session.customer as string,
      })
      .$returningId();
    userId = inserted[0].id;
  }

  const { tier, tierName } = getMembershipTierFromPriceId(priceId);

  await db
    .insert(memberships)
    .values({
      userId,
      tier,
      stripeSessionId: session.id,
      stripeSubscriptionId: session.subscription as string | null,
      status: "active",
    })
    .onDuplicateKeyUpdate({ set: { tier, status: "active" } });

  console.log(`[Stripe Webhook] Rental membership activated for ${customerEmail} — tier: ${tierName}`);

  // ── MANIFEST PATCH: Trigger instant onboarding (line ~661) ──────────────────
  try {
    const onboardingResult = await triggerInstantOnboarding({
      userId,
      userEmail: customerEmail,
      userName: customerName,
      membershipTier: tier,
      tierName,
    });

    console.log(
      `[Stripe Webhook] Instant onboarding result for ${customerEmail}:`,
      JSON.stringify(onboardingResult)
    );
  } catch (onboardingError) {
    console.error(
      `[Stripe Webhook] Instant onboarding failed for ${customerEmail}:`,
      onboardingError
    );
  }
  // ── END MANIFEST PATCH ───────────────────────────────────────────────────────
}

// ─── Subscription Cancellation Handler ───────────────────────────────────────

async function handleSubscriptionCancelled(
  subscription: Stripe.Subscription
): Promise<void> {
  const db = await getDb() as any;
  if (!db) return;

  const customerId = subscription.customer as string;

  const matchedUsers = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (matchedUsers.length === 0) {
    console.warn(`[Stripe Webhook] No user found for customer ${customerId} on cancellation`);
    return;
  }

  await db
    .update(memberships)
    .set({ status: "cancelled" })
    .where(eq(memberships.userId, matchedUsers[0].id));

  console.log(`[Stripe Webhook] Membership cancelled for user ${matchedUsers[0].id}`);
}

// ─── Main Webhook Handler ─────────────────────────────────────────────────────

export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const mode = (session as any).metadata?.mode || session.mode;

        if (mode === "affiliate" || session.metadata?.type === "affiliate") {
          await handleAffiliateMembership(session);
        } else if (mode === "rental" || session.metadata?.type === "rental") {
          await handleRentalMembership(session);
        } else {
          // Default: treat as affiliate membership
          await handleAffiliateMembership(session);
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.status === "canceled") {
          await handleSubscriptionCancelled(subscription);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (handlerError) {
    const message = handlerError instanceof Error ? handlerError.message : "Unknown error";
    console.error(`[Stripe Webhook] Handler error for ${event.type}: ${message}`);
    res.status(500).json({ error: "Internal webhook handler error" });
  }
}
