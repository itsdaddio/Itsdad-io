/**
 * StickyCTA.tsx
 *
 * Sticky bottom call-to-action bar for itsdad.io.
 * First Dollar Priority: Single "Start Here" CTA.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, HandHeart } from "lucide-react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-500/30 bg-slate-900/95 backdrop-blur-md shadow-2xl shadow-black/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Left: simple message */}
        <p className="text-sm font-medium text-foreground leading-tight">
          New here? <span className="text-muted-foreground">Get your free roadmap and start earning.</span>
        </p>

        {/* Right: CTA + dismiss */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="#start-here">
            <Button className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform h-auto py-2.5 px-5 rounded-xl font-semibold text-sm">
              <HandHeart className="w-4 h-4 mr-1.5" />
              Start Here
            </Button>
          </a>

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
