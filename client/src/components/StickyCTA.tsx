/**
 * StickyCTA.tsx
 *
 * Sticky bottom call-to-action bar for Its Dad LLC.
 * Visible on scroll to drive conversions from any page position.
 *
 * MANIFEST PATCH (item 15):
 *   - Updated commission language to "product sales" (line 74 equivalent)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown, X, TrendingUp } from "lucide-react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-500/30 bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-black/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Left: value prop */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">
              Earn commissions on product sales — starting today
            </p>
            {/* MANIFEST PATCH: Updated from "referral commissions" to "product sales" (line 74 equivalent) */}
            <p className="text-xs text-muted-foreground">
              30–40% recurring commissions on product sales. Automated tracking. Instant dashboard access.
            </p>
          </div>
        </div>

        {/* Right: CTA + dismiss */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/memberships">
            <Button className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform h-auto py-2.5 px-5 rounded-xl font-semibold text-sm">
              <Crown className="w-4 h-4 mr-1.5" />
              Join Its Dad
            </Button>
          </Link>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
