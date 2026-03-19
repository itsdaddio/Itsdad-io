/**
 * PackageDetailsModal.tsx
 *
 * Full-detail modal for a selected membership package on Its Dad LLC.
 * Opened when a user clicks "See full details" on a membership card.
 *
 * MANIFEST PATCH (item 17):
 *   - Replaced "Monthly Group Coaching" with "Advanced Strategy Blueprints" (line 88 equivalent)
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface PackageDetail {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  description: string;
  features: string[];
  ctaHref: string;
}

const PACKAGE_DETAILS: Record<string, PackageDetail> = {
  boss: {
    id: "starter",
    name: "Starter Pass",
    price: "$9.99",
    period: "/month",
    tagline: "Start earning with 10 curated products",
    description:
      "The Starter Pass gives you everything you need to make your first affiliate commission. You get immediate access to 10 high-converting products, the foundational Affiliated Degree modules, and the full Prompt Vault to power your content.",
    features: [
      "10 curated affiliate products with unique tracking links",
      "Done-for-you swipe files: ad copy, email scripts, social posts",
      "Affiliated Degree — Modules 1, 2, and 3",
      "40,000 ChatGPT Prompt Vault",
      "Automated commission tracking dashboard",
      "Personal affiliate referral link (30% recurring)",
      "Instant onboarding email sequence",
    ],
    ctaHref: "/memberships?tier=boss",
  },
  chief: {
    id: "builder",
    name: "Builder Access",
    price: "$19.99",
    period: "/month",
    tagline: "Scale with 30 products and advanced tools",
    description:
      "Builder Access is designed for members ready to scale. You unlock 30 products, the full advanced swipe file library, and six of the eight Affiliated Degree modules — plus done-for-you sales page templates.",
    features: [
      "Everything in Starter Pass",
      "30 curated affiliate products",
      "Advanced swipe file library (email + social + video scripts)",
      "Affiliated Degree — Modules 1 through 6",
      "Done-for-you sales page templates",
      // MANIFEST PATCH: was "Monthly Group Coaching" — replaced with "Advanced Strategy Blueprints" (line 88)
      "Advanced Strategy Blueprints — done-for-you campaign frameworks",
      "Priority commission processing",
      "35% recurring referral commissions",
    ],
    ctaHref: "/memberships?tier=chief",
  },
  kingpin: {
    id: "inner-circle",
    name: "Inner Circle",
    price: "$24.99",
    period: "/month",
    tagline: "Full access to all 51 products and the complete system",
    description:
      "Inner Circle is the complete Its Dad experience. All 51 products, all 8 Affiliated Degree modules, the full funnel system, and second-tier referral commissions. The system runs on autopilot at this level.",
    features: [
      "Everything in Builder Access",
      "All 51 curated affiliate products",
      "Complete Affiliated Degree — all 8 modules",
      "Full Prompt Vault + complete pre-recorded video library",
      "Complete Funnel System — pre-built and ready to deploy",
      "Second-tier referral commissions (6.7% on direct referral earnings)",
      "40% recurring referral commissions",
      "Automated earnings and analytics reports",
      "Affiliated Degree certificate on completion",
    ],
    ctaHref: "/memberships?tier=kingpin",
  },
};

interface PackageDetailsModalProps {
  tierId: string | null;
  open: boolean;
  onClose: () => void;
}

export function PackageDetailsModal({ tierId, open, onClose }: PackageDetailsModalProps) {
  const pkg = tierId ? PACKAGE_DETAILS[tierId] : null;

  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg bg-slate-900 border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <Crown className="w-5 h-5 text-amber-400" />
            <DialogTitle className="text-xl font-bold text-foreground">
              {pkg.name} Membership
            </DialogTitle>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
              {pkg.price}{pkg.period}
            </Badge>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            {pkg.tagline}
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted-foreground leading-relaxed mt-1 mb-4">
          {pkg.description}
        </p>

        <ul className="space-y-2.5 mb-6">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        <Link href={pkg.ctaHref} onClick={onClose}>
          <Button className="w-full btn-gold-gradient gold-shimmer hover:scale-105 transition-transform h-auto py-3 rounded-xl font-semibold">
            Join as {pkg.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
