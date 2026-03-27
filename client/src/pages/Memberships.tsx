/**
 * client/src/pages/Memberships.tsx
 *
 * itsdad.io — Memberships page.
 *
 * FIRST DOLLAR PRIORITY:
 * - Quiz at top helps users determine which tier is right for them
 * - All 4 tiers visible below with clear pricing and features
 * - One clear path: Take Quiz → See Recommendation → Checkout
 *
 * Route: /memberships
 */

import { useState } from "react";
import { Check, Zap, Star, Shield, ArrowRight, Loader2, Handshake, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MembershipQuiz } from "@/components/MembershipQuiz";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tier {
  id: string;
  name: string;
  price: string;
  trialCopy: string;
  badge?: string;
  badgeColor?: string;
  highlighted?: boolean;
  icon: React.ReactNode;
  features: string[];
  cta: string;
}

// ─── Tier Data ────────────────────────────────────────────────────────────────

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter Pack",
    price: "$7/mo",
    trialCopy: "Start for $1 — 7-day trial",
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    features: [
      "First Dollar System\u2122",
      "1 product to promote (single-offer focus)",
      "1 viral script (copy-and-post ready)",
      "Step-by-step posting instructions",
      "Immediate action onboarding",
    ],
    cta: "Get Starter Pack",
  },
  {
    id: "builder",
    name: "Builder Club",
    price: "$19/mo",
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Best Value",
    badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    highlighted: true,
    icon: <Star className="w-6 h-6 text-amber-400" />,
    features: [
      "Everything in Starter Pack",
      "Daily content prompts",
      "Multiple product options (unlocked after first action)",
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
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Scale Up",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    icon: <Rocket className="w-6 h-6 text-emerald-400" />,
    features: [
      "Everything in Builder Club",
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
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Full Access",
    badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    icon: <Handshake className="w-6 h-6 text-purple-400" />,
    features: [
      "Everything in Pro Club",
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

// ─── Tier Card ────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  onSelect,
  isLoading,
  recommended,
}: {
  tier: Tier;
  onSelect: (id: string) => void;
  isLoading: boolean;
  recommended?: boolean;
}) {
  const isHighlighted = tier.highlighted || recommended;

  return (
    <Card
      className={`relative flex flex-col h-full transition-all duration-300 ${
        isHighlighted
          ? "border-amber-500/50 bg-gradient-to-b from-amber-950/30 to-slate-900 shadow-lg shadow-amber-900/20 md:scale-105"
          : "border-slate-700/50 bg-slate-900/80"
      } ${recommended ? "ring-2 ring-amber-400/60" : ""}`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="text-xs font-bold px-4 py-1 rounded-full bg-amber-500 text-black">
            Recommended for You
          </span>
        </div>
      )}
      {!recommended && tier.badge && (
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
          onClick={() => onSelect(tier.id)}
          disabled={isLoading}
          className={`w-full font-semibold text-base py-5 mt-2 ${
            isHighlighted
              ? "bg-amber-500 hover:bg-amber-400 text-black"
              : "bg-slate-700 hover:bg-slate-600 text-white"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Loading..." : tier.cta}
        </Button>

        <p className="text-center text-xs text-slate-500">{tier.trialCopy}</p>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Memberships() {
  const { startCheckout, loading, error } = useCheckout();
  const [recommendedTier, setRecommendedTier] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="pt-16 pb-10 px-4 text-center">
        <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm px-3 py-1">
          Affiliation Nation
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Not Sure Where to Start?<br />
          <span className="text-amber-400">We'll Help You Pick.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Take the 60-second quiz below and we'll recommend the perfect plan based on where you are right now. Every plan starts at just $1.
        </p>
      </div>

      {/* Banners */}
      <div className="max-w-6xl mx-auto px-4">
        <SuccessBanner />
        <CancelledBanner />
        <InvitedBanner />
      </div>

      {/* Quiz Section */}
      <div className="max-w-3xl mx-auto px-4 pb-12" id="quiz">
        <MembershipQuiz onRecommend={(tierId: string) => {
          setRecommendedTier(tierId);
          // Scroll to the tier cards after recommendation
          setTimeout(() => {
            document.getElementById("tier-cards")?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }} />
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Tier Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16" id="tier-cards">
        <h2 className="text-2xl font-bold text-center mb-8">
          {recommendedTier ? "Here's Your Best Fit" : "All Membership Tiers"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onSelect={startCheckout}
              isLoading={loading === tier.id}
              recommended={recommendedTier === tier.id}
            />
          ))}
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-500 text-sm">
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

        {/* Fine print */}
        <p className="mt-6 text-center text-xs text-slate-600 max-w-lg mx-auto">
          * $1 trial lasts 7 days. After the trial period, your card will be charged the full
          membership price. You can cancel at any time before the trial ends with no charge.
          Commission rates of 30–40% apply to eligible referred sales only.
        </p>
      </div>
    </div>
  );
}
