/**
 * PackageDetailsModal.tsx
 *
 * Full-detail modal for a selected membership package on itsdad.io.
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
  starter: {
    id: "starter",
    name: "Starter Pack",
    price: "$7",
    period: "/month",
    tagline: "Make your first dollar today",
    description:
      "The Starter Pack is your First Dollar Activation. One product to focus on, one script to post, plus the full Affiliated Degree course, 40K ChatGPT prompts, and done-for-you swipe files. A full system behind you — zero overwhelm.",
    features: [
      "First Dollar System\u2122 — your step-by-step action plan",
      "1 product to promote (single-offer focus)",
      "1 viral script (copy-and-post ready)",
      "Step-by-step posting instructions",
      "Affiliated Degree course (8 self-paced modules)",
      "40,000 ChatGPT Prompt Vault",
      "Done-for-you swipe files & templates",
      "30% recurring commissions",
      "Immediate action onboarding",
    ],
    ctaHref: "/memberships?tier=starter",
  },
  builder: {
    id: "builder",
    name: "Builder Club",
    price: "$19",
    period: "/month",
    tagline: "Build a consistent income engine",
    description:
      "Builder Club is designed for members ready to build consistency. You unlock daily content prompts, multiple product options, and a content rotation engine to keep your output flowing.",
    features: [
      "Everything in Starter Pack",
      "Multiple products to promote (expand your catalog)",
      "Daily content prompts",
      "Content rotation engine",
      "Scaling method (increase output + consistency)",
      "Priority execution path",
    ],
    ctaHref: "/memberships?tier=builder",
  },
  pro: {
    id: "pro",
    name: "Pro Creator Club",
    price: "$49.99",
    period: "/month",
    tagline: "Automate and expand your income",
    description:
      "Pro Creator Club gives you the automation and funnel systems to scale without burning out. Pre-built frameworks, content scaling systems, and performance optimization tools.",
    features: [
      "Everything in Builder Club",
      "Full library of 51 products unlocked",
      "Automation frameworks",
      "Funnel strategies",
      "Content scaling systems",
      "Performance optimization tools",
    ],
    ctaHref: "/memberships?tier=pro",
  },
  "inner-circle": {
    id: "inner-circle",
    name: "Inner Circle",
    price: "$99.99",
    period: "/month",
    tagline: "Advanced monetization and strategy",
    description:
      "Inner Circle Club is the complete Its Dad experience. Advanced monetization systems, early access tools, strategy drops, and high-level income expansion methods.",
    features: [
      "Everything in Pro Creator Club",
      "All 51 products + 40% commissions",
      "Advanced monetization systems",
      "Early access tools and features",
      "Strategy drops and system updates",
      "High-level income expansion methods",
    ],
    ctaHref: "/memberships?tier=inner-circle",
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
