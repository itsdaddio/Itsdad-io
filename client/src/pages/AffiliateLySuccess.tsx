/**
 * client/src/pages/AffiliateLySuccess.tsx
 *
 * itsdad.io — Affiliate-ly Product Purchase Success Page
 *
 * Called after a successful Stripe checkout for a PLR product.
 * Records the purchase, attributes commission to the referrer, and
 * shows the buyer a confirmation with download/access instructions.
 *
 * Route: /affiliate-ly/success?session_id=...&product_id=...&ref=...
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";

interface PurchaseState {
  status: "loading" | "success" | "error";
  productName?: string;
  error?: string;
}

const PRODUCT_NAMES: Record<number, string> = {
  1: "AI Content Creation Masterclass", 2: "ChatGPT Profit Blueprint", 3: "AI Video Automation Course",
  4: "Prompt Engineering for Profit", 5: "AI Copywriting Toolkit", 6: "Midjourney Mastery Course",
  7: "AI Business Automation Guide", 8: "AI SEO Domination System", 9: "AI Email Marketing Machine",
  10: "AI Side Hustle Accelerator", 11: "Instagram Growth Blueprint", 12: "TikTok Monetization Masterclass",
  13: "YouTube Shorts Profit System", 14: "Pinterest Traffic Machine", 15: "Twitter/X Authority Builder",
  16: "LinkedIn Lead Generation Course", 17: "Facebook Group Monetization", 18: "Social Media Content Calendar",
  19: "Shopify Dropshipping Blueprint", 20: "Digital Product Creation System", 21: "Etsy Passive Income Course",
  22: "Amazon FBA Starter Guide", 23: "Print-on-Demand Profit System", 24: "Online Course Creation Kit",
  25: "Membership Site Blueprint", 26: "Digital Downloads Goldmine", 27: "Crypto Investing Fundamentals",
  28: "Stock Market Starter Kit", 29: "Real Estate Wholesaling Guide", 30: "Budget Freedom System",
  31: "Options Trading Starter Kit", 32: "High-Yield Savings Maximizer", 33: "Side Income Tax Strategy Guide",
  34: "Passive Income Portfolio Builder", 35: "Deep Work Productivity System", 36: "Morning Routine Mastery",
  37: "Mindset Reset Program", 38: "Health Optimization Blueprint", 39: "Networking Mastery Course",
  40: "Public Speaking Confidence Kit", 41: "Leadership Accelerator Program", 42: "Digital Detox & Focus Bundle",
  43: "Goal Achievement System", 44: "Email List Building Machine", 45: "Sales Funnel Blueprint",
  46: "Copywriting Crash Course", 47: "SEO Traffic Domination", 48: "Agency Launch Playbook",
  49: "Paid Ads Profit System", 50: "Brand Identity Starter Kit", 51: "Freelance to Freedom Course",
};

export default function AffiliateLySuccess() {
  const [state, setState] = useState<PurchaseState>({ status: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const productId = parseInt(params.get("product_id") || "0", 10);
    const refCode = params.get("ref") || "";

    if (!sessionId || !productId) {
      setState({ status: "error", error: "Missing purchase information." });
      return;
    }

    const productName = PRODUCT_NAMES[productId] || `Product #${productId}`;

    // Record purchase and attribute commission
    fetch("/api/products/purchase-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId, referralCode: refCode || undefined }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setState({ status: "success", productName });
        } else {
          setState({ status: "success", productName }); // Still show success to buyer
        }
      })
      .catch(() => {
        setState({ status: "success", productName }); // Still show success to buyer
      });
  }, []);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Confirming your purchase…</p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-slate-400 mb-6">{state.error}</p>
          <Link
            href="/affiliate-ly"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success animation */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
          ✓ Purchase Confirmed
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3">
          You're in!
        </h1>

        <p className="text-slate-300 text-lg mb-2">
          <span className="text-amber-400 font-semibold">{state.productName}</span>
        </p>

        <p className="text-slate-400 mb-8 leading-relaxed">
          Your digital product is ready. Check your email for access instructions.
          If you don't see it within 5 minutes, check your spam folder.
        </p>

        {/* Access card */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
            What happens next
          </h3>
          <div className="space-y-3">
            {[
              { icon: "📧", title: "Check your email", desc: "Access link sent immediately to your inbox" },
              { icon: "📥", title: "Download your product", desc: "Instant digital delivery — no waiting" },
              { icon: "🚀", title: "Start implementing", desc: "Follow the step-by-step system inside" },
            ].map((step) => (
              <div key={step.title} className="flex gap-3">
                <span className="text-xl shrink-0">{step.icon}</span>
                <div>
                  <div className="text-white text-sm font-medium">{step.title}</div>
                  <div className="text-slate-400 text-xs">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/affiliate-ly"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all"
          >
            Browse More Products →
          </Link>
          <Link
            href="/alliance"
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold text-sm transition-all"
          >
            View My Earnings
          </Link>
        </div>

        <p className="text-slate-600 text-xs mt-6">
          Questions? Email{" "}
          <a href="mailto:itsdad@itsdad.io" className="text-amber-400 hover:text-amber-300">
            itsdad@itsdad.io
          </a>
        </p>
      </div>
    </div>
  );
}
