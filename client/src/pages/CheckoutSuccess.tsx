/**
 * client/src/pages/CheckoutSuccess.tsx
 *
 * itsdad.io — Post-Purchase Success + Upsell Page
 *
 * Shown immediately after Stripe Checkout completes.
 * Stripe redirects to: /checkout/success?session_id=XXX&tier=starter
 *
 * Tier IDs (matching Memberships.tsx and checkout.ts):
 *   starter      — Starter Pass    $9.99/mo
 *   builder      — Builder Access  $19.99/mo
 *   inner-circle — Inner Circle    $24.99/mo
 *
 * Route: /checkout/success
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";

// ─── Tier Display Names ───────────────────────────────────────────────────────

const TIER_NAMES: Record<string, string> = {
  "starter":      "Starter Pass",
  "builder":      "Builder Access",
  "inner-circle": "Inner Circle",
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
  // Starter buyer → show Builder Access (most popular upgrade)
  starter: [
    {
      tierId: "builder",
      name: "Builder Access",
      price: "$19.99/mo",
      headline: "3x your product library. Unlock the full swipe file system.",
      features: [
        "30 curated affiliate products (vs 10)",
        "Advanced email + social swipe file library",
        "Affiliated Degree — Modules 1–6",
        "Done-for-you sales page templates",
        "Priority commission processing",
        "35% direct commission rate (vs 30%)",
      ],
      cta: "Upgrade to Builder Access — $19.99/mo",
      highlight: true,
    },
  ],
  // Builder buyer → show Inner Circle
  builder: [
    {
      tierId: "inner-circle",
      name: "Inner Circle",
      price: "$24.99/mo",
      headline: "All 51 products. Complete degree. Direct support from Dad.",
      features: [
        "All 51 curated affiliate products",
        "Complete Affiliated Degree — all 8 modules",
        "Inner Circle community access",
        "Done-for-you funnel system",
        "Direct support from Dad",
        "40% direct commission rate",
        "First access to new products and drops",
      ],
      cta: "Go All In — Inner Circle $24.99/mo",
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
        <p className="text-slate-400 text-sm">{offer.price} — same $1 trial applies</p>
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
        onClick={() => onUpgrade(offer.tierId)}
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
  const tierName = TIER_NAMES[tier] ?? "Starter Pass";
  const upsells = UPSELL_MAP[tier] ?? UPSELL_MAP.starter;

  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);

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
                Want more products and higher commissions?
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Upgrade now and your $1 trial applies to the higher tier. No extra charge today.
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
                onClick={() => setDeclined(true)}
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
