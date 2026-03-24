/**
 * client/src/pages/Memberships.tsx
 *
 * itsdad.io — Memberships page.
 *
 * Displays the three membership tiers (Starter Pass, Builder Access, Inner Circle) with a $1 trial
 * CTA for each. On click, calls POST /api/checkout/create-session and redirects
 * the user to Stripe Checkout.
 *
 * Route: /memberships
 */

import { useState } from "react";
import { Check, Users, Zap, Star, Shield, ArrowRight, Loader2, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    name: "Starter Pass",
    price: "$9.99/mo",
    trialCopy: "Start for $1 — 7-day trial",
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    features: [
      "Access to 10 curated affiliate products",
      "Done-for-you swipe files & ad copy",
      "Affiliated Degree — Modules 1–3",
      "40,000 ChatGPT Prompt Vault",
      "Automated commission tracking dashboard",
      "Personal affiliate referral link",
    ],
    cta: "Get Instant Access",
  },
  {
    id: "builder",
    name: "Builder Access",
    price: "$19.99/mo",
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Most Popular",
    badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    highlighted: true,
    icon: <Star className="w-6 h-6 text-amber-400" />,
    features: [
      "Everything in Starter Pass",
      "Access to 30 curated affiliate products",
      "Advanced swipe file library (email + social)",
      "Affiliated Degree — Modules 1–6",
      "Done-for-you sales page templates",
      "Priority commission processing",
      "30–40% recurring referral commissions",
    ],
    cta: "Start Building Today",
  },
  {
    id: "inner-circle",
    name: "Inner Circle",
    price: "$24.99/mo",
    trialCopy: "Start for $1 — 7-day trial",
    badge: "Full Access",
    badgeColor: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    icon: <Handshake className="w-6 h-6 text-purple-400" />,
    features: [
      "Everything in Builder Access",
      "All 51 curated affiliate products",
      "Complete Affiliated Degree — all 8 modules",
      "Inner Circle community access",
      "Done-for-you funnel system",
      "Direct support from Dad",
      "First access to new products & drops",
    ],
    cta: "Join the Inner Circle",
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

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(null);
    }
  }

  return { startCheckout, loading, error };
}

// ─── Success Banner ───────────────────────────────────────────────────────────

function SuccessBanner() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("session_id")) return null;

  return (
    <div className="mb-8 rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center">
      <p className="text-green-400 font-semibold text-lg">
        Welcome to the Alliance, Dad. Your membership is active. Check your email for next steps.
      </p>
    </div>
  );
}

// ─── Cancelled Banner ─────────────────────────────────────────────────────────

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

// ─── Invited Banner ─────────────────────────────────────────────────────────

function InvitedBanner() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("invited")) return null;
  const ref = params.get("ref") ?? "";

  return (
    <div className="mb-8 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 p-5 text-center">
      <p className="text-amber-400 font-bold text-lg mb-1">🤝 You Were Invited to the Table</p>
      <p className="text-slate-300 text-sm">
        Someone in the Alliance brought you here. Join today and your first month is on them.
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
}: {
  tier: Tier;
  onSelect: (id: string) => void;
  isLoading: boolean;
}) {
  return (
    <Card
      className={`relative flex flex-col h-full transition-all duration-200 ${
        tier.highlighted
          ? "border-amber-500/50 bg-gradient-to-b from-amber-950/30 to-slate-900 shadow-lg shadow-amber-900/20 scale-105"
          : "border-slate-700/50 bg-slate-900/80"
      }`}
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
          onClick={() => onSelect(tier.id)}
          disabled={isLoading}
          className={`w-full font-semibold text-base py-5 mt-2 ${
            tier.highlighted
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="pt-16 pb-10 px-4 text-center">
        <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm px-3 py-1">
          The Its Dad Alliance
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Try for <span className="text-amber-400">$1</span>.<br />
          Change everything.
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Built for people who've tried affiliate marketing and haven't made it work yet.
          Dad built the system — you just have to show up.
        </p>
      </div>

      {/* Banners */}
      <div className="max-w-5xl mx-auto px-4">
        <SuccessBanner />
        <CancelledBanner />
        <InvitedBanner />
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 mb-6">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Tier Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onSelect={startCheckout}
              isLoading={loading === tier.id}
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
