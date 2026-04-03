/**
 * client/src/pages/Memberships.tsx
 *
 * itsdad.io — Memberships page.
 *
 * LOCKED SYSTEM CONFIG:
 *   Starter Pack — $7/mo (Entry)
 *   Builder Club — $19/mo (BEST VALUE)
 *   Pro Club — $49.99/mo (Scale Up)
 *   Inner Circle Club — $99.99/mo (MOST VALUE / Full Access)
 *
 * DESIGN SYSTEM:
 *   Background: #0B0B0F / #0F172A
 *   Text: #F9FAFB / #9CA3AF
 *   Accent: Royal Gold #D4AF37
 *   CTA: #D4AF37 bg, #0B0B0F text
 *   No teal/green accents. Sharp contrast. Premium feel.
 *
 * FUNNEL: Traffic → $7 Entry → $19 Upsell → $49/$99 Ascension
 *
 * Route: /memberships
 */

import { useState } from "react";
import { Check, Zap, Star, Shield, ArrowRight, Loader2, Handshake, Rocket, ChevronDown, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MembershipQuiz } from "@/components/MembershipQuiz";
import { trackCTAClick, trackCheckoutInitiated } from "@/lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tier {
  id: string;
  name: string;
  price: string;
  monthlyPrice: string;
  pricingCopy: string;
  badge?: string;
  highlight?: boolean;
  mostValue?: boolean;
  icon: React.ReactNode;
  features: string[];
  bonusFeatures?: string[];
  cta: string;
}

// ─── Tier Data (LOCKED — DO NOT CHANGE NAMES OR PRICING) ─────────────────────

const STARTER: Tier = {
  id: "starter",
  name: "Starter Pack",
  price: "$7/mo",
  monthlyPrice: "$7",
  pricingCopy: "$7/month. Cancel anytime.",
  icon: <Zap className="w-7 h-7" style={{ color: "#D4AF37" }} />,
  features: [
    "Step-by-step action plan — no guesswork",
    "Done-for-you products with resell rights",
    "Copy-and-post viral scripts",
    "Step-by-step posting instructions",
    "Immediate action onboarding",
  ],
  bonusFeatures: [
    "Affiliated Degree course (8 self-paced modules)",
    "40,000 ChatGPT Prompt Vault",
    "Done-for-you swipe files & templates",
    "30% recurring commissions",
  ],
  cta: "Activate My Starter Pack",
};

const UPGRADE_TIERS: Tier[] = [
  {
    id: "builder",
    name: "Builder Club",
    price: "$19/mo",
    monthlyPrice: "$19",
    pricingCopy: "$19/month. Cancel anytime.",
    badge: "BEST VALUE",
    highlight: true,
    icon: <Star className="w-6 h-6" style={{ color: "#D4AF37" }} />,
    features: [
      "Multiple products to promote (expand your catalog)",
      "Daily content prompts",
      "Content rotation engine",
      "Scaling method (increase output + consistency)",
      "Priority execution path",
    ],
    bonusFeatures: [
      "Everything in Starter Pack included",
      "Affiliated Degree course (8 modules)",
      "40,000 ChatGPT Prompt Vault",
      "Done-for-you swipe files & templates",
      "30% recurring commissions",
    ],
    cta: "Unlock Builder Club",
  },
  {
    id: "pro",
    name: "Pro Club",
    price: "$49.99/mo",
    monthlyPrice: "$49.99",
    pricingCopy: "$49.99/month. Cancel anytime.",
    badge: "Scale Up",
    icon: <Rocket className="w-6 h-6" style={{ color: "#D4AF37" }} />,
    features: [
      "Full library of 51 products unlocked",
      "Automation frameworks",
      "Funnel strategies",
      "Content scaling systems",
      "Performance optimization tools",
    ],
    bonusFeatures: [
      "Everything in Builder Club included",
      "Affiliated Degree course (8 modules)",
      "40,000 ChatGPT Prompt Vault",
      "Done-for-you swipe files & templates",
      "35% recurring commissions",
    ],
    cta: "Unlock Pro Club",
  },
  {
    id: "inner-circle",
    name: "Inner Circle Club",
    price: "$99.99/mo",
    monthlyPrice: "$99.99",
    pricingCopy: "$99.99/month. Cancel anytime.",
    badge: "MOST VALUE",
    mostValue: true,
    icon: <Crown className="w-6 h-6" style={{ color: "#D4AF37" }} />,
    features: [
      "All 51 products + highest commissions",
      "Advanced monetization systems",
      "Early access tools and features",
      "Strategy drops and system updates",
      "High-level income expansion methods",
    ],
    bonusFeatures: [
      "Everything in Pro Club included",
      "Affiliated Degree course (8 modules)",
      "40,000 ChatGPT Prompt Vault",
      "Done-for-you swipe files & templates",
      "40% recurring commissions (highest tier)",
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

    const tierNames: Record<string, string> = { starter: "Starter Pack", builder: "Builder Club", pro: "Pro Club", "inner-circle": "Inner Circle Club" };
    const tierPrices: Record<string, string> = { starter: "$7", builder: "$19", pro: "$49.99", "inner-circle": "$99.99" };
    trackCTAClick(tierId, tierNames[tierId] || tierId, "memberships_page");
    trackCheckoutInitiated(tierId, tierNames[tierId] || tierId, tierPrices[tierId] || "$0");

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
    <div className="mb-8 rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
      <p className="font-semibold text-lg" style={{ color: "#D4AF37" }}>
        Welcome to Affiliation Nation. Your membership is active — check your email for next steps.
      </p>
    </div>
  );
}

function CancelledBanner() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("cancelled")) return null;

  return (
    <div className="mb-8 rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
      <p className="font-semibold" style={{ color: "#9CA3AF" }}>
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
    <div className="mb-8 rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}>
      <p className="font-bold text-lg mb-1" style={{ color: "#D4AF37" }}>You Were Invited to Affiliation Nation</p>
      <p className="text-sm" style={{ color: "#9CA3AF" }}>
        Someone in the community brought you here. Join today and your first month is on them.
      </p>
      {ref && (
        <p className="text-xs mt-2 font-mono" style={{ color: "#6B7280" }}>Invite code: {ref}</p>
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
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0B0B0F" }}>

      {/* ── Banners ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <SuccessBanner />
        <CancelledBanner />
        <InvitedBanner />
      </div>

      {/* ── STARTER PACK HERO — The entry point ─────────────────────── */}
      <section className="pt-16 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span
            className="inline-block mb-4 text-sm font-bold px-4 py-1.5 rounded-full"
            style={{ backgroundColor: "rgba(212,175,55,0.12)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.25)" }}
          >
            If you're new, start here.
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" style={{ color: "#F9FAFB" }}>
            Affiliate Marketing<br />
            <span style={{ color: "#D4AF37" }}>Without the Guesswork.</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "#9CA3AF" }}>
            Done-for-you products. Step-by-step system. You follow the plan. You keep the profit.
          </p>
        </div>

        {/* Starter Pack Card */}
        <div className="max-w-md mx-auto">
          <Card
            className="relative shadow-2xl"
            style={{
              backgroundColor: "rgba(15,23,42,0.7)",
              border: "2px solid rgba(212,175,55,0.4)",
              boxShadow: "0 0 40px rgba(212,175,55,0.08)",
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span
                className="text-xs font-bold px-5 py-1.5 rounded-full"
                style={{ backgroundColor: "#D4AF37", color: "#0B0B0F" }}
              >
                Start Here
              </span>
            </div>

            <CardHeader className="pb-4 pt-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
                >
                  {STARTER.icon}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>{STARTER.name}</h2>

              <div
                className="rounded-xl px-6 py-4 text-center mt-4"
                style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(212,175,55,0.15)" }}
              >
                <span className="text-4xl font-extrabold" style={{ color: "#F9FAFB" }}>{STARTER.monthlyPrice}</span>
                <span className="text-lg ml-2" style={{ color: "#9CA3AF" }}>/month</span>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Cancel anytime — no contracts</p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#D4AF37" }}>Your Action Plan</p>
                <ul className="space-y-3">
                  {STARTER.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: "#F9FAFB" }}>
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#D4AF37" }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {STARTER.bonusFeatures && (
                <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>Also Included</p>
                  <ul className="space-y-3">
                    {STARTER.bonusFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: "#9CA3AF" }}>
                        <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "rgba(212,175,55,0.5)" }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => startCheckout(STARTER.id)}
                disabled={loading === STARTER.id}
                className="w-full font-bold text-lg py-6 mt-3 rounded-xl border-0 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#D4AF37", color: "#0B0B0F" }}
              >
                {loading === STARTER.id ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {loading === STARTER.id ? "Loading..." : STARTER.cta}
              </Button>

              <p className="text-center text-xs" style={{ color: "#6B7280" }}>{STARTER.pricingCopy}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
                <span className="text-xs font-semibold" style={{ color: "#D4AF37" }}>7-Day Money-Back Guarantee</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm" style={{ color: "#6B7280" }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span>Secured by Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span>Cancel anytime — no questions asked</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span style={{ color: "#D4AF37", fontWeight: 600 }}>7-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span>Instant access after payment</span>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* ── UPGRADE TIERS — Expandable ─────────────────────────────── */}
      <section className="py-12 px-4" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm mb-2" style={{ color: "#6B7280" }}>Already earning? Ready for more?</p>
            <button
              onClick={() => setShowUpgradeTiers(!showUpgradeTiers)}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "#D4AF37" }}
            >
              View upgrade options
              <ChevronDown className={`w-4 h-4 transition-transform ${showUpgradeTiers ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showUpgradeTiers && (
            <div id="tier-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-in fade-in slide-in-from-top-4 duration-500">
              {UPGRADE_TIERS.map((tier) => (
                <Card
                  key={tier.id}
                  className="relative flex flex-col h-full transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: tier.highlight
                      ? "2px solid rgba(212,175,55,0.5)"
                      : tier.mostValue
                        ? "2px solid rgba(212,175,55,0.3)"
                        : "1px solid rgba(212,175,55,0.08)",
                    boxShadow: tier.highlight ? "0 0 30px rgba(212,175,55,0.06)" : "none",
                  }}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span
                        className="text-xs font-bold px-4 py-1 rounded-full"
                        style={{
                          backgroundColor: tier.highlight ? "#D4AF37" : "rgba(212,175,55,0.15)",
                          color: tier.highlight ? "#0B0B0F" : "#D4AF37",
                          border: tier.highlight ? "none" : "1px solid rgba(212,175,55,0.25)",
                        }}
                      >
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.12)" }}
                      >
                        {tier.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: "#F9FAFB" }}>{tier.name}</h3>
                        <p className="text-sm" style={{ color: "#9CA3AF" }}>{tier.price}</p>
                      </div>
                    </div>

                    <div
                      className="rounded-lg px-4 py-3 text-center"
                      style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(212,175,55,0.08)" }}
                    >
                      <span className="text-2xl font-extrabold" style={{ color: "#F9FAFB" }}>{tier.monthlyPrice}</span>
                      <span className="text-sm ml-1" style={{ color: "#9CA3AF" }}>/month</span>
                      <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Cancel anytime — no contracts</p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#D4AF37" }}>Your Growth Plan</p>
                      <ul className="space-y-2.5">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: "#F9FAFB" }}>
                            <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#D4AF37" }} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tier.bonusFeatures && (
                      <div className="pt-3" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#9CA3AF" }}>Also Included</p>
                        <ul className="space-y-2.5">
                          {tier.bonusFeatures.map((feature) => (
                            <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: "#6B7280" }}>
                              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "rgba(212,175,55,0.4)" }} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button
                      onClick={() => startCheckout(tier.id)}
                      disabled={loading === tier.id}
                      className="w-full font-semibold text-base py-5 mt-2 rounded-xl border-0 transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: tier.highlight ? "#D4AF37" : "rgba(212,175,55,0.12)",
                        color: tier.highlight ? "#0B0B0F" : "#D4AF37",
                      }}
                    >
                      {loading === tier.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      {loading === tier.id ? "Loading..." : tier.cta}
                    </Button>

                    <p className="text-center text-xs" style={{ color: "#6B7280" }}>{tier.pricingCopy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── QUIZ — Post-onboarding upgrade tool ────────────────────── */}
      <section className="py-12 px-4" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm mb-2" style={{ color: "#6B7280" }}>Already a member?</p>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#D4AF37" }}
          >
            Take the upgrade quiz to find your next tier
            <ChevronDown className={`w-4 h-4 transition-transform ${showQuiz ? "rotate-180" : ""}`} />
          </button>

          {showQuiz && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <MembershipQuiz onRecommend={(tierId: string) => {
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
        <p className="text-center text-xs" style={{ color: "#4B5563" }}>
          Commission rates of 30–40% apply to eligible referred sales only.
          All memberships are billed monthly. Cancel anytime from your dashboard — no questions asked.
        </p>
      </div>
    </div>
  );
}
