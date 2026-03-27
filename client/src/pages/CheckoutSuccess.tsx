/**
 * client/src/pages/CheckoutSuccess.tsx
 *
 * itsdad.io — Post-Purchase Success + Upsell Page
 *
 * Shown immediately after Stripe Checkout completes.
 * Stripe redirects to: /checkout/success?session_id=XXX&tier=starter
 *
 * Tier IDs (matching Memberships.tsx and checkout.ts):
 *   starter      — Starter Pack       $7/mo
 *   builder      — Builder Club       $19/mo
 *   pro          — Pro Club           $49.99/mo
 *   inner-circle — Inner Circle Club  $99.99/mo
 *
 * Route: /checkout/success
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trackPurchaseComplete, trackUpsellClick, trackUpsellDeclined } from "@/lib/analytics";

// ─── Tier Display Names ───────────────────────────────────────────────────────

const TIER_NAMES: Record<string, string> = {
  "starter":      "Starter Pack",
  "builder":      "Builder Club",
  "pro":          "Pro Club",
  "inner-circle": "Inner Circle Club",
};

// ─── Upsell Config ────────────────────────────────────────────────────────────
// Maps the purchased tier to what upsell(s) to show immediately after checkout.

interface UpsellOffer {
  tierId: string;
  name: string;
  price: string;
  headline: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const UPSELL_MAP: Record<string, UpsellOffer[]> = {
  // Starter buyer → show Builder Club
  starter: [
    {
      tierId: "builder",
      name: "Builder Club",
      price: "$19/mo",
      headline: "Build consistency with daily content prompts and multiple products.",
      features: [
        "Everything in Starter Pack",
        "Daily content prompts",
        "Multiple product options (unlocked after first action)",
        "Content rotation engine",
        "Scaling method (increase output + consistency)",
        "Priority execution path",
      ],
      cta: "Upgrade to Builder Club — $19/mo",
      highlight: true,
    },
  ],
  // Builder buyer → show Pro Club
  builder: [
    {
      tierId: "pro",
      name: "Pro Club",
      price: "$49.99/mo",
      headline: "Automate your income with funnels and scaling systems.",
      features: [
        "Everything in Builder Club",
        "Automation frameworks",
        "Funnel strategies",
        "Content scaling systems",
        "Performance optimization tools",
      ],
      cta: "Upgrade to Pro Club — $49.99/mo",
      highlight: true,
    },
  ],
  // Pro buyer → show Inner Circle Club
  pro: [
    {
      tierId: "inner-circle",
      name: "Inner Circle Club",
      price: "$99.99/mo",
      headline: "Advanced monetization, early access tools, and strategy drops.",
      features: [
        "Everything in Pro Club",
        "Advanced monetization systems",
        "Early access tools and features",
        "Strategy drops and system updates",
        "High-level income expansion methods",
      ],
      cta: "Go All In — Inner Circle Club $99.99/mo",
      highlight: true,
    },
  ],
  // Inner Circle buyer → no upsell, just celebrate
  "inner-circle": [],
};

// ─── Next Steps ───────────────────────────────────────────────────────────────

const NEXT_STEPS = [
  {
    icon: "📧",
    title: "Check your email",
    desc: "Your welcome email is on its way with your login credentials and first steps.",
  },
  {
    icon: "🔗",
    title: "Get your referral link",
    desc: "Head to the Alliance page to grab your unique referral link and start earning inside Affiliation Nation.",
  },
  {
    icon: "📚",
    title: "Start the Affiliated Degree",
    desc: "Your first module is unlocked. 15 minutes a day is all it takes.",
  },
  {
    icon: "💬",
    title: "Challenge one person",
    desc: "Text one person who has talked about wanting extra income. One referral = one free month.",
  },
];

// ─── Upsell Card ─────────────────────────────────────────────────────────────

function UpsellCard({
  offer,
  onUpgrade,
  upgrading,
}: {
  offer: UpsellOffer;
  onUpgrade: (tierId: string) => void;
  upgrading: string | null;
}) {
  const isUpgrading = upgrading === offer.tierId;
  return (
    <div className="rounded-2xl p-6 border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-amber-900/10 ring-2 ring-amber-500/30">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
        ⚡ One-Time Upgrade Offer
      </div>
      <div className="mb-3">
        <h3 className="text-white font-bold text-xl">{offer.name}</h3>
        <p className="text-slate-400 text-sm">{offer.price} — cancel anytime</p>
      </div>
      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{offer.headline}</p>
      <ul className="space-y-2 mb-6">
        {offer.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-green-400 mt-0.5 shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          trackUpsellClick("current", offer.tierId);
          onUpgrade(offer.tierId);
        }}
        disabled={upgrading !== null}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isUpgrading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
            Redirecting…
          </>
        ) : (
          <>{offer.cta} →</>
        )}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutSuccess() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const tier = params.get("tier") ?? "starter";
  const tierName = TIER_NAMES[tier] ?? "Starter Pack";
  const upsells = UPSELL_MAP[tier] ?? UPSELL_MAP.starter;

  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);

  // GA4: Track purchase completion
  useEffect(() => {
    if (sessionId) {
      trackPurchaseComplete(tier, tierName, sessionId);
    }
  }, [sessionId, tier, tierName]);

  // Track referral if one was stored in cookie or sessionStorage
  useEffect(() => {
    const refFromSession = sessionStorage.getItem("itsdad_ref");
    const refFromCookie = document.cookie
      .split("; ")
      .find((r) => r.startsWith("itsdad_ref="))
      ?.split("=")[1];
    const refCode = refFromSession || (refFromCookie ? decodeURIComponent(refFromCookie) : null);

    if (refCode && sessionId) {
      fetch("/api/referral/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: refCode, newUserId: sessionId, tier }),
      }).catch(() => {/* silent — don't block the success page */});
    }
  }, [sessionId, tier]);

  async function handleUpgrade(tierId: string) {
    setUpgrading(tierId);
    setUpgradeError(null);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upgrade failed.");
      window.location.href = data.url;
    } catch (err) {
      setUpgradeError(err instanceof Error ? err.message : "Something went wrong.");
      setUpgrading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* ── Welcome Header ── */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-4">
            ✅ Payment Confirmed
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            You're In — Welcome to Affiliation Nation.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Your{" "}
            <span className="text-amber-400 font-semibold">{tierName}</span>{" "}
            membership is active. Your place in Affiliation Nation is confirmed.
          </p>
        </div>

        {/* ── Upsell Section ── */}
        {upsells.length > 0 && !declined && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <p className="text-slate-300 text-sm uppercase tracking-widest font-semibold mb-2">
                Before You Dive In
              </p>
              <h2 className="text-2xl font-bold text-white">
                Ready to level up?
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Upgrade now — same cancel-anytime policy. Level up your commissions and product access.
              </p>
            </div>

            {upgradeError && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {upgradeError}
              </div>
            )}

            {upsells.map((offer) => (
              <UpsellCard
                key={offer.tierId}
                offer={offer}
                onUpgrade={handleUpgrade}
                upgrading={upgrading}
              />
            ))}

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  trackUpsellDeclined(tier);
                  setDeclined(true);
                }}
                className="text-slate-500 hover:text-slate-400 text-sm transition-colors underline underline-offset-2"
              >
                No thanks, {tierName} is right for me right now
              </button>
            </div>
          </div>
        )}

        {/* ── Next Steps ── */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
          <h3 className="text-white font-bold text-lg mb-5">Your Next 4 Moves</h3>
          <div className="space-y-4">
            {NEXT_STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-xl shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{step.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/alliance"
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-center hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            Get My Referral Link →
          </Link>
          <Link
            href="/"
            className="flex-1 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-center hover:bg-slate-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          Questions? Email{" "}
          <a href="mailto:itsdad@itsdad.io" className="text-amber-400 hover:text-amber-300 transition-colors">
            itsdad@itsdad.io
          </a>
        </p>
      </div>
    </div>
  );
}
