/**
 * client/src/lib/analytics.ts
 *
 * GA4 Analytics utility for itsdad.io.
 *
 * Provides type-safe helpers for tracking:
 *   - Page views (SPA route changes)
 *   - CTA button clicks (Activate My Starter Pack, Unlock Builder Club, etc.)
 *   - Checkout initiation (Stripe redirect)
 *   - Purchase completion (landing on /checkout/success)
 *
 * Measurement ID: G-3GTYG69H4E
 */

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

// ─── Page View (SPA) ────────────────────────────────────────────────────────

export function trackPageView(path: string, title?: string) {
  gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
  });
}

// ─── CTA Click ──────────────────────────────────────────────────────────────

export function trackCTAClick(tierId: string, tierName: string, location: string) {
  gtag("event", "cta_click", {
    event_category: "engagement",
    event_label: tierName,
    tier_id: tierId,
    click_location: location, // e.g. "memberships_hero", "starter_landing", "hubs_cta"
  });
}

// ─── Checkout Initiated ─────────────────────────────────────────────────────

export function trackCheckoutInitiated(tierId: string, tierName: string, price: string) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: parseFloat(price.replace(/[^0-9.]/g, "")) || 0,
    items: [
      {
        item_id: tierId,
        item_name: tierName,
        price: parseFloat(price.replace(/[^0-9.]/g, "")) || 0,
        quantity: 1,
      },
    ],
  });
}

// ─── Purchase Complete ──────────────────────────────────────────────────────

const TIER_PRICES: Record<string, number> = {
  starter: 7,
  builder: 19,
  pro: 49.99,
  "inner-circle": 99.99,
};

export function trackPurchaseComplete(
  tierId: string,
  tierName: string,
  sessionId: string
) {
  const value = TIER_PRICES[tierId] || 0;
  gtag("event", "purchase", {
    transaction_id: sessionId,
    value,
    currency: "USD",
    items: [
      {
        item_id: tierId,
        item_name: tierName,
        price: value,
        quantity: 1,
      },
    ],
  });
}

// ─── Upsell Click ───────────────────────────────────────────────────────────

export function trackUpsellClick(fromTier: string, toTier: string) {
  gtag("event", "upsell_click", {
    event_category: "conversion",
    from_tier: fromTier,
    to_tier: toTier,
  });
}

// ─── Upsell Declined ────────────────────────────────────────────────────────

export function trackUpsellDeclined(tier: string) {
  gtag("event", "upsell_declined", {
    event_category: "conversion",
    tier,
  });
}

// ─── Generic Event Tracker ─────────────────────────────────────────────────
// Flexible event tracking for product funnels, course progress, etc.

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  gtag("event", eventName, params || {});
}
