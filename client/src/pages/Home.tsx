/**
 * Home.tsx — itsdad.io Homepage
 * LOCKED SYSTEM CONFIG:
 *   Starter: $7 | Builder Club: $19 (BEST VALUE) | Pro Club: $49.99 | Inner Circle: $99.99
 *   Funnel: Traffic → $7 Entry → $19 Upsell → $49/$99 Ascension
 *   Core Promise: "Affiliate marketing without guesswork."
 *   Rules: Conversion > Creativity. No fluff. No overbuilding.
 */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Target,
  Users,
  BookOpen,
  Crown,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LiveActivityBar } from "@/components/LiveActivityBar";

export default function Home() {
  return (
    <>
      <JsonLd page="home" />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HEADLINE
          Clear, bold, no fluff.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-center py-20 px-4 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.15) 0%, transparent 70%)"
        }} />

        <div className="relative max-w-3xl mx-auto text-center w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Affiliate Marketing<br />
            <span className="text-emerald-400">Without the Guesswork</span>
          </h1>

          {/* SECTION 2 — SUBHEADLINE */}
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            51 done-for-you products. Step-by-step system.<br className="hidden md:block" />
            You follow the plan. You keep the profit.
          </p>
          <p className="text-base text-slate-400 max-w-xl mx-auto mb-10">
            Built for people who tried affiliate marketing and got nowhere. This time is different.
          </p>

          {/* SECTION 3 — PRIMARY CTA ($7) */}
          <a href="/memberships">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xl px-12 py-7 h-auto rounded-xl shadow-2xl shadow-emerald-500/25 hover:scale-105 transition-all duration-200"
            >
              Start for $7/mo
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </a>
          <p className="text-sm text-slate-500 mt-4">
            Cancel anytime. No contracts. No hidden fees.
          </p>
        </div>
      </section>

      {/* Live Activity */}
      <LiveActivityBar />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — WHAT YOU GET (Simple bullets)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What You Get for <span className="text-emerald-400">$7/mo</span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Everything you need to start earning. Nothing you don't.
          </p>

          <div className="grid gap-4">
            {[
              "Done-for-you digital products with full resell rights",
              "Step-by-step system — exactly what to post, promote, and repeat",
              "The full Affiliated Degree course",
              "40,000+ ChatGPT prompts to create content fast",
              "Done-for-you swipe files, scripts, and templates",
              "Access to the Its Dad affiliate portal",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200 text-lg">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="/memberships">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg px-10 py-5 h-auto rounded-xl hover:scale-105 transition-all"
              >
                Activate Starter Pack — $7/mo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — WHO THIS IS FOR
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-slate-900/50 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Who This Is <span className="text-emerald-400">For</span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            If any of these sound like you, you're in the right place.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Target className="w-5 h-5" />, text: "You tried affiliate marketing but never made a sale" },
              { icon: <Users className="w-5 h-5" />, text: "You're overwhelmed by too many options and no clear path" },
              { icon: <BookOpen className="w-5 h-5" />, text: "You want a system that tells you exactly what to do" },
              { icon: <Zap className="w-5 h-5" />, text: "You're ready to stop watching and start earning" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-slate-200 text-base leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — WHY THIS WORKS (Remove guesswork angle)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why This <span className="text-emerald-400">Works</span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Most affiliate programs give you a link and say "good luck." We don't.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">No Guesswork</h3>
              <p className="text-slate-400 leading-relaxed">
                You don't pick products. You don't write copy from scratch. You don't figure out what to post.
                The system tells you what to do, step by step. You follow it.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Done-For-You Products</h3>
              <p className="text-slate-400 leading-relaxed">
                51 digital products with full resell rights. Sales pages already built. Funnels already wired.
                You promote them. You keep 100% of the sale. No commission splits.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Built for Beginners Who've Been Burned</h3>
              <p className="text-slate-400 leading-relaxed">
                This isn't another course that leaves you hanging. Its Dad was built specifically for people
                who tried and didn't succeed yet. The entire system is designed to get you from zero to earning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7 — BUILDER CLUB UPSELL ($19 BEST VALUE)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Star className="w-4 h-4" />
              BEST VALUE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Builder Club — <span className="text-amber-400">$19/mo</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              For members ready to go beyond the basics. More products, more tools, more earning power.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.03] border-2 border-amber-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            </div>

            <div className="grid gap-3 mb-8">
              <p className="text-white font-semibold text-lg mb-2">Everything in Starter Pack, plus:</p>
              {[
                "Unlock more products from the 51-product library",
                "Daily content prompts so you always know what to post",
                "Advanced affiliate strategies and scaling methods",
                "Priority support from the Its Dad team",
                "Community access with other builders",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <a href="/memberships">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-lg px-10 py-5 h-auto rounded-xl shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Join Builder Club — $19/mo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Cancel anytime. Upgrade or downgrade whenever you want.
            </p>
          </div>

          {/* Tier comparison hint */}
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Want even more?{" "}
              <Link href="/memberships" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                See all membership tiers
              </Link>
              {" "}— Pro Club ($49.99) and Inner Circle Club ($99.99) unlock the full 51-product library.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-slate-950 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop Guessing.<br />
            <span className="text-emerald-400">Start Earning.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            $7 gets you in the door. The system does the rest. You just follow it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/memberships">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xl px-12 py-7 h-auto rounded-xl shadow-2xl shadow-emerald-500/25 hover:scale-105 transition-all"
              >
                Start for $7/mo
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            No contracts. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}
