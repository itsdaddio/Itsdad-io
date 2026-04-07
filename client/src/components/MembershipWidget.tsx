/**
 * MembershipWidget.tsx
 *
 * Compact membership tier selection widget for itsdad.io.
 * Displayed on the homepage and landing pages to drive conversions.
 *
 * MANIFEST PATCH (item 13):
 *   - Added commission disclaimer footnote (line 627 equivalent)
 *   - Replaced coaching features with done-for-you alternatives
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Users, Zap, Star, Crown, Info, Handshake } from "lucide-react";
import { Link } from "wouter";

interface MembershipTier {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
}

const TIERS: MembershipTier[] = [
  {
    id: "starter",
    name: "Starter Pack",
    price: "$7",
    period: "/mo",
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    features: [
      "First Dollar System\u2122 — step-by-step action plan",
      "1 product to promote (single-offer focus)",
      "1 viral script (copy-and-post ready)",
      "Affiliated Degree course (8 modules)",
      "40,000 ChatGPT Prompt Vault",
      "Done-for-you swipe files & templates",
      "30% recurring commissions",
    ],
    cta: "Get Starter Pack",
    ctaHref: "/memberships?tier=starter",
  },
  {
    id: "builder",
    name: "Builder Club",
    price: "$19",
    period: "/mo",
    badge: "Best Value",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    highlighted: true,
    features: [
      "Everything in Starter Pack",
      "Multiple products to promote (expand your catalog)",
      "Daily content prompts",
      "Content rotation engine",
      "Scaling method (increase output + consistency)",
      "Priority execution path",
    ],
    cta: "Join Builder Club",
    ctaHref: "/memberships?tier=builder",
  },
  {
    id: "pro",
    name: "Pro Creator Club",
    price: "$49.99",
    period: "/mo",
    badge: "Automation",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: <Crown className="w-5 h-5 text-emerald-400" />,
    features: [
      "Everything in Builder Club",
      "Full library of 51 products unlocked",
      "Automation frameworks",
      "Funnel strategies",
      "Content scaling systems",
      "Performance optimization tools",
    ],
    cta: "Join Pro Creator Club",
    ctaHref: "/memberships?tier=pro",
  },
  {
    id: "inner-circle",
    name: "Inner Circle Club",
    price: "$99.99",
    period: "/mo",
    badge: "Full Access",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Handshake className="w-5 h-5 text-purple-400" />,
    features: [
      "Everything in Pro Creator Club",
      "All 51 products + 40% commissions",
      "Advanced monetization systems",
      "Early access tools and features",
      "Strategy drops and system updates",
      "High-level income expansion methods",
    ],
    cta: "Join Inner Circle Club",
    ctaHref: "/memberships?tier=inner-circle",
  },
];

export function MembershipWidget() {
  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {TIERS.map((tier) => (
          <Card
            key={tier.id}
            className={`relative border transition-all ${
              tier.highlighted
                ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "border-border hover:border-amber-500/20"
            } bg-card/60`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className={`text-xs font-semibold border ${tier.badgeColor}`}>
                  {tier.badge}
                </Badge>
              </div>
            )}

            <CardContent className="p-6">
              {/* Tier header */}
              <div className="flex items-center gap-2 mb-3">
                {tier.icon}
                <span className="font-bold text-foreground text-lg">{tier.name}</span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                <span className="text-muted-foreground text-sm">{tier.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={tier.ctaHref}>
                <Button
                  className={`w-full h-auto py-3 rounded-xl font-semibold ${
                    tier.highlighted
                      ? "btn-gold-gradient gold-shimmer hover:scale-105 transition-transform"
                      : "bg-slate-800 hover:bg-slate-700 text-foreground"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MANIFEST PATCH: Commission disclaimer footnote (line 627 equivalent) */}
      <p className="mt-6 text-center text-xs text-muted-foreground max-w-2xl mx-auto flex items-start justify-center gap-1.5">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
        <span>
          Commission amounts shown are illustrative estimates based on product sales and referral activity.
          Actual earnings vary and are not guaranteed. itsdad.io is not a get-rich-quick program.
          Results depend on individual effort, market conditions, and product performance.
        </span>
      </p>
    </div>
  );
}
