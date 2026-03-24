/**
 * CommitmentCelebration.tsx
 *
 * Post-signup / milestone celebration component for itsdad.io.
 * Displayed when a member completes a key action (e.g., first commission,
 * course module completion, Affiliated Degree earned).
 *
 * MANIFEST PATCH (item 12):
 *   - Replaced hands-on language with "system does the heavy lifting"
 */

import { Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CommitmentCelebrationProps {
  milestone: "first_commission" | "module_complete" | "degree_earned" | "membership_active";
  memberName?: string;
}

const MILESTONE_CONTENT: Record<
  CommitmentCelebrationProps["milestone"],
  { headline: string; subtext: string; cta: string; ctaHref: string }
> = {
  membership_active: {
    headline: "You're In — Welcome to Affiliation Nation",
    subtext:
      "Your dashboard is live, your affiliate links are active, and the system is already working for you. Everything you need to earn inside Affiliation Nation is waiting.",
    cta: "Go to Your Dashboard",
    ctaHref: "/dashboard",
  },
  first_commission: {
    headline: "Your First Commission Is In",
    // MANIFEST PATCH: was "I'm so proud of you — let's celebrate this together"
    subtext:
      "The system tracked it, attributed it, and logged it automatically. This is just the beginning — keep your links out there and let the platform do the rest.",
    cta: "See Your Earnings",
    ctaHref: "/dashboard",
  },
  module_complete: {
    headline: "Module Complete — Progress Saved",
    // MANIFEST PATCH: was "Great work — I'll be here for the next step"
    subtext:
      "Your progress is automatically saved. The next module is unlocked and ready whenever you are. The system keeps track so you don't have to.",
    cta: "Continue the Course",
    ctaHref: "/course",
  },
  degree_earned: {
    headline: "Welcome to Affiliation Nation",
    subtext:
      "You earned your Affiliated Degree and your place in Affiliation Nation is official. Your commission potential is unlocked at the highest level — the platform does the heavy lifting from here.",
    cta: "Enter Affiliation Nation",
    ctaHref: "/dashboard",
  },
};

export function CommitmentCelebration({
  milestone,
  memberName,
}: CommitmentCelebrationProps) {
  const content = MILESTONE_CONTENT[milestone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-purple-950/80 p-8 text-center">
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-pulse pointer-events-none" />

      {/* Icon */}
      <div className="relative flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-bounce" />
      </div>

      {/* Headline */}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        {memberName ? `${memberName}, ` : ""}{content.headline}
      </h2>

      {/* Subtext */}
      <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto mb-6">
        {content.subtext}
      </p>

      {/* CTA */}
      <Link href={content.ctaHref}>
        <Button className="btn-gold-gradient px-6 py-3 h-auto rounded-xl text-base font-semibold hover:scale-105 transition-transform">
          {content.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
