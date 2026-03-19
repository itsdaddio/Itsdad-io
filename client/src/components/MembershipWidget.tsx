/**
 * MembershipWidget.tsx
 *
 * Compact membership tier selection widget for Its Dad LLC.
 * Displayed on the homepage and landing pages to drive conversions.
 *
 * MANIFEST PATCH (item 13):
 *   - Added commission disclaimer footnote (line 627 equivalent)
 *   - Replaced coaching features with done-for-you alternatives
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Users, Zap, Star, Info, Handshake } from "lucide-react";
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
    name: "Starter Pass",
    price: "$9.99",
    period: "/mo",
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    features: [
      "Access to 10 curated affiliate products",
      "Done-for-you swipe files & ad copy",
      "Affiliated Degree — Modules 1–3",
      "40,000 ChatGPT Prompt Vault",
      "Automated commission tracking dashboard",
      "Personal affiliate referral link",
    ],
    cta: "Get Instant Access",
    ctaHref: "/memberships?tier=starter",
  },
  {
    id: "builder",
    name: "Builder Access",
    price: "$19.99",
    period: "/mo",
    badge: "Most Popular",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    highlighted: true,
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
    ctaHref: "/memberships?tier=builder",
  },
  {
    id: "inner-circle",
    name: "Inner Circle",
    price: "$24.99",
    period: "/mo",
    badge: "Full Access",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Handshake className="w-5 h-5 text-purple-400" />,
    features: [
      "Everything in Builder Access",
      "All 51 curated affiliate products",
      "Complete Affiliated Degree (8 modules)",
      "Full Prompt Vault + pre-recorded video library",
      "Done-for-you funnel system",
      "Second-tier referral commissions (6.7%)",
      "Direct support from Dad",
    ],
    cta: "Join the Inner Circle",
    ctaHref: "/memberships?tier=inner-circle",
  },
];

export function MembershipWidget() {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
          Actual earnings vary and are not guaranteed. Its Dad LLC is not a get-rich-quick program.
          Results depend on individual effort, market conditions, and product performance.
        </span>
      </p>
    </div>
  );
}
