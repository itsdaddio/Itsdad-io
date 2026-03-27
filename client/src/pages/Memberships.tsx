/**
 * client/src/pages/Memberships.tsx
 *
 * itsdad.io — Memberships page.
 *
 * ZERO FRICTION / FIRST DOLLAR PRIORITY:
 * - NO quiz at entry point — user takes action immediately
 * - Starter Pack is the ONLY highlighted tier for new users
 * - "If you're new, start here." messaging
 * - Other tiers visible but dimmed — positioned as upgrades
 * - Quiz moved to bottom as an UPGRADE tool, not entry tool
 *
 * UPDATED: Starter Pack features now accurately reflect the full value
 * (course, prompts, swipe files) while leading with the "one product focus"
 * action strategy.
 *
 * Route: /memberships
 */

import { useState } from "react";
import { Check, Zap, Star, Shield, ArrowRight, Loader2, Handshake, Rocket, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MembershipQuiz } from "@/components/MembershipQuiz";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tier {
  id: string;
  name: string;
  price: string;
  monthlyPrice: string;
  trialCopy: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  features: string[];
  bonusFeatures?: string[];
  cta: string;
}

// ─── Tier Data ────────────────────────────────────────────────────────────────

const STARTER: Tier = {
  id: "starter",
  name: "Starter Pack",
  price: "$7/mo",
  monthlyPrice: "$7",
  trialCopy: "$1 for 7 days — then $7/mo — cancel anytime",
  icon: <Zap className="w-7 h-7 text-amber-400" />,
  features: [
    "First Dollar System\u2122 — your step-by-step action plan",
    "1 product to promote (single-offer focus)",
    "1 viral script (copy-and-post ready)",
    "Step-by-step posting instructions",
    "Immediate action onboarding",
  ],
  bonusFeatures: [
    "Affiliated Degree course (8 self-paced modules)",
    "40,000 ChatGPT Prompt Vault",
    "Done-for-you swipe files & templates",
    "30% recurring commissions",
  ],
  cta: "Start for $1",
};

const UPGRADE_TIERS: Tier[] = [
  {
    id: "builder",
    name: "Builder Club",
    price: "$19/mo",
    monthlyPrice: "$19",
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Best Value",
    badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    icon: <Star className="w-6 h-6 text-amber-400" />,
    features: [
      "Everything in Starter Pack",
      "Multiple products to promote (expand your catalog)",
      "Daily content prompts",
      "Content rotation engine",
      "Scaling method (increase output + consistency)",
      "Priority execution path",
    ],
    cta: "Join Builder Club",
  },
  {
    id: "pro",
    name: "Pro Club",
    price: "$49.99/mo",
    monthlyPrice: "$49.99",
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Scale Up",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    icon: <Rocket className="w-6 h-6 text-emerald-400" />,
    features: [
      "Everything in Builder Club",
      "Full library of 51 products unlocked",
      "Automation frameworks",
      "Funnel strategies",
      "Content scaling systems",
      "Performance optimization tools",
    ],
    cta: "Join Pro Club",
  },
  {
    id: "inner-circle",
    name: "Inner Circle Club",
    price: "$99.99/mo",
    monthlyPrice: "$99.99",
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Full Access",
    badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    icon: <Handshake className="w-6 h-6 text-purple-400" />,
    features: [
      "Everything in Pro Club",
      "All 51 products + 40% commissions",
      "Advanced monetization systems",
      "Early access tools and features",
      "Strategy drops and system updates",
      "High-level income expansion methods",
    ],
    cta: "Join Inner Circle Club",
  },
];

// ─── Checkout Hook ────────────────────────────────────────────────────────────

function useCheckout() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(tierId: string) {
    setLoading(tierId);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout. Please try again.");
      }

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(null);
    }
  }

  return { startCheckout, loading, error };
}

// ─── Banners ─────────────────────────────────────────────────────────────────

function SuccessBanner() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("session_id")) return null;

  return (
    <div className="mb-8 rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center">
      <p className="text-green-400 font-semibold text-lg">
        Welcome to Affiliation Nation. Your membership is active — check your email for next steps.
      </p>
    </div>
  );
}

function CancelledBanner() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("cancelled")) return null;

  return (
    <div className="mb-8 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
      <p className="text-amber-400 font-semibold">
        No worries — your spot is still here whenever you're ready.
      </p>
    </div>
  );
}

function InvitedBanner() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("invited")) return null;
  const ref = params.get("ref") ?? "";

  return (
    <div className="mb-8 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 p-5 text-center">
      <p className="text-amber-400 font-bold text-lg mb-1">You Were Invited to Affiliation Nation</p>
      <p className="text-slate-300 text-sm">
        Someone in the community brought you here. Join today and your first month is on them.
      </p>
      {ref && (
        <p className="text-slate-500 text-xs mt-2 font-mono">Invite code: {ref}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Memberships() {
  const { startCheckout, loading, error } = useCheckout();
  const [showUpgradeTiers, setShowUpgradeTiers] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Banners ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <SuccessBanner />
        <CancelledBanner />
        <InvitedBanner />
      </div>

      {/* ── STARTER PACK HERO — The only thing new users see ─────────── */}
      <section className="pt-16 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm px-3 py-1">
            If you're new, start here.
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Your First Dollar<br />
            <span className="text-amber-400">Starts With This.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            One product to promote. One script to post. Plus the full course, 40K prompts, and swipe files to back you up. Everything you need — nothing you don't.
          </p>
        </div>

        {/* Starter Pack Card — Large, centered, unmissable */}
        <div className="max-w-md mx-auto">
          <Card className="relative border-2 border-amber-500/60 bg-gradient-to-b from-amber-950/40 to-slate-900 shadow-2xl shadow-amber-900/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="text-xs font-bold px-5 py-1.5 rounded-full bg-amber-500 text-black">
                Start Here
              </span>
            </div>

            <CardHeader className="pb-4 pt-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  {STARTER.icon}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{STARTER.name}</h2>
              <p className="text-slate-400 text-sm">{STARTER.price} after trial</p>

              <div className="rounded-xl bg-slate-800/60 border border-amber-500/20 px-6 py-4 text-center mt-4">
                <span className="text-4xl font-extrabold text-white">$1</span>
                <span className="text-slate-400 text-lg ml-2">for 7 days</span>
                <p className="text-xs text-slate-500 mt-1">Then {STARTER.price} — cancel anytime</p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pb-8">
              {/* Core action features */}
              <div>
                <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider mb-3">Your Action Plan</p>
                <ul className="space-y-3">
                  {STARTER.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bonus/included features */}
              {STARTER.bonusFeatures && (
                <div className="mt-2 pt-3 border-t border-white/10">
                  <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider mb-3">Also Included</p>
                  <ul className="space-y-3">
                    {STARTER.bonusFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => startCheckout(STARTER.id)}
                disabled={loading === STARTER.id}
                className="w-full font-bold text-lg py-6 mt-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl"
              >
                {loading === STARTER.id ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {loading === STARTER.id ? "Loading..." : "Start for $1"}
              </Button>

              <p className="text-center text-xs text-slate-500">{STARTER.trialCopy}</p>
            </CardContent>
          </Card>
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secured by Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Cancel anytime — no questions asked</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Instant access after payment</span>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* ── UPGRADE TIERS — Dimmed, expandable ──────────────────────── */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm mb-2">Already earning? Ready for more?</p>
            <button
              onClick={() => setShowUpgradeTiers(!showUpgradeTiers)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              View upgrade options
              <ChevronDown className={`w-4 h-4 transition-transform ${showUpgradeTiers ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showUpgradeTiers && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-in fade-in slide-in-from-top-4 duration-500">
              {UPGRADE_TIERS.map((tier) => (
                <Card
                  key={tier.id}
                  className="relative flex flex-col h-full border-slate-700/50 bg-slate-900/60 opacity-90 hover:opacity-100 transition-opacity"
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-slate-800">{tier.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <p className="text-slate-400 text-sm">{tier.price} after trial</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-4 py-3 text-center">
                      <span className="text-2xl font-extrabold text-white">$1</span>
                      <span className="text-slate-400 text-sm ml-1">for 7 days</span>
                      <p className="text-xs text-slate-500 mt-0.5">Then {tier.price} — cancel anytime</p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 gap-4">
                    <ul className="space-y-2.5 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => startCheckout(tier.id)}
                      disabled={loading === tier.id}
                      className="w-full font-semibold text-base py-5 mt-2 bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      {loading === tier.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      {loading === tier.id ? "Loading..." : tier.cta}
                    </Button>

                    <p className="text-center text-xs text-slate-500">{tier.trialCopy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── QUIZ — Post-onboarding upgrade tool ────────────────────── */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-2">Already a member?</p>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Take the upgrade quiz to find your next tier
            <ChevronDown className={`w-4 h-4 transition-transform ${showQuiz ? "rotate-180" : ""}`} />
          </button>

          {showQuiz && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <MembershipQuiz onRecommend={(tierId: string) => {
                // If quiz recommends a tier, expand the upgrade section and scroll to it
                setShowUpgradeTiers(true);
                setTimeout(() => {
                  document.getElementById("tier-cards")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }} />
            </div>
          )}
        </div>
      </section>

      {/* Fine print */}
      <div className="max-w-lg mx-auto px-4 pb-16">
        <p className="text-center text-xs text-slate-600">
          * $1 trial lasts 7 days. After the trial period, your card will be charged the full
          membership price. You can cancel at any time before the trial ends with no charge.
          Commission rates of 30–40% apply to eligible referred sales only.
        </p>
      </div>
    </div>
  );
}
