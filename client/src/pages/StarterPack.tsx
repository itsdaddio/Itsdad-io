import { useState } from "react";
import { Check, ArrowRight, Shield, Clock, Zap, BookOpen, MessageSquare, FileText } from "lucide-react";
import { trackCTAClick, trackCheckoutInitiated } from "@/lib/analytics";

// ─── Starter Pack Landing Page ───────────────────────────────────────────────
// Focused, conversion-optimized page for paid traffic (ads/social).
// Single CTA. No nav distractions. No upgrade tiers visible.
// No trials. Straight $7/mo pricing. Action-oriented CTAs.

export default function StarterPack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    // GA4: Track CTA click and checkout initiation
    trackCTAClick("starter", "Starter Pack", "starter_landing");
    trackCheckoutInitiated("starter", "Starter Pack", "$7");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "starter" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Unable to start checkout. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Minimal top bar — no full nav */}
      <div className="border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-amber-400 transition-colors">
              itsdad.io
            </span>
          </a>
          <button
            onClick={startCheckout}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Loading..." : "Activate My Starter Pack"}
          </button>
        </div>
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            The First Dollar System
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            One product. One script.{" "}
            <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              Your first commission.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4 max-w-2xl mx-auto">
            Stop scrolling through 100 products wondering which one to pick.
            We hand you one product, one viral script, and step-by-step posting instructions.
            You just follow the plan.
          </p>

          <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto">
            Built for people who've tried affiliate marketing before and didn't win yet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={startCheckout}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Loading..." : "Activate My Starter Pack"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-500">
            $7/month. Cancel anytime. Your first product and script are ready the moment you sign up.
          </p>

          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
        </div>
      </section>

      {/* ─── What You Get ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Everything in the Starter Pack
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Your action plan to earn your first dollar, plus the full toolkit to back you up.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Action Plan Column */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-amber-400">Your Action Plan</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: <Check className="w-4 h-4" />, text: "1 hand-picked product (high conversion, proven seller)" },
                  { icon: <Check className="w-4 h-4" />, text: "1 viral script — copy, paste, post" },
                  { icon: <Check className="w-4 h-4" />, text: "Step-by-step posting instructions" },
                  { icon: <Check className="w-4 h-4" />, text: "Immediate onboarding — start today, not next week" },
                  { icon: <Check className="w-4 h-4" />, text: "30% recurring commissions on every sale" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 text-green-400 shrink-0">{item.icon}</span>
                    <span className="text-slate-200 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Also Included Column */}
            <div className="bg-slate-800/50 rounded-2xl border border-purple-500/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-purple-400">Also Included</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: <BookOpen className="w-4 h-4" />, text: "Affiliated Degree course — 8 self-paced video modules" },
                  { icon: <MessageSquare className="w-4 h-4" />, text: "40,000 ChatGPT Prompt Vault ($297 value, free)" },
                  { icon: <FileText className="w-4 h-4" />, text: "Done-for-you swipe files & templates" },
                  { icon: <Shield className="w-4 h-4" />, text: "Personal affiliate dashboard with tracking" },
                  { icon: <Clock className="w-4 h-4" />, text: "Referral link — earn on every member you bring in" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 text-purple-400 shrink-0">{item.icon}</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How it works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Activate your Starter Pack",
                desc: "Get instant access to your dashboard, your product, and your script. No waiting period.",
              },
              {
                step: "02",
                title: "Copy the script and post it",
                desc: "We tell you exactly what to post, where to post it, and when. One product. One script. One platform.",
              },
              {
                step: "03",
                title: "Earn your first commission",
                desc: "The system tracks clicks, sales, and payouts automatically. You focus on posting — we handle the rest.",
              },
              {
                step: "04",
                title: "Level up when you're ready",
                desc: "Start the Affiliated Degree course, explore the 40K prompt vault, and upgrade to more products when the time is right.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust / Objection Handling ───────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Built for people who've been burned before
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                q: "\"I've tried affiliate marketing and failed.\"",
                a: "That's exactly who this is for. We removed the overwhelm. One product. One script. One action step at a time.",
              },
              {
                q: "\"I don't know what to promote.\"",
                a: "You don't have to choose. We hand-pick a proven product for you based on what's converting right now.",
              },
              {
                q: "\"I don't have an audience.\"",
                a: "You don't need one. The viral script is designed to work on social media even with zero followers.",
              },
              {
                q: "\"What if it doesn't work?\"",
                a: "Cancel anytime — no contracts, no commitments. But most people who follow the system post their first commission within 14 days.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl border border-white/10 p-5">
                <p className="text-amber-400 font-medium text-sm mb-2">{item.q}</p>
                <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your first product is{" "}
            <span className="bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              waiting
            </span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            One product. One script. The full course and 40K prompts to back you up.
            Cancel anytime.
          </p>

          <button
            onClick={startCheckout}
            disabled={loading}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading ? "Loading..." : "Activate My Starter Pack"} <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-sm text-slate-500 mt-4">
            $7/month. Cancel anytime. No contracts.
          </p>

          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
        </div>
      </section>

      {/* ─── Minimal Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} itsdad.io. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-500 text-xs">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/disclaimer" className="hover:text-white transition-colors">Earnings Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
