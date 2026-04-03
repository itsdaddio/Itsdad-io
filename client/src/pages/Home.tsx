/**
 * Home.tsx — itsdad.io Homepage
 * LOCKED SYSTEM CONFIG:
 *   Starter: $7 | Builder Club: $19 (BEST VALUE) | Pro Club: $49.99 | Inner Circle: $99.99
 *   Funnel: Traffic → $7 Entry → $19 Upsell → $49/$99 Ascension
 *   Core Promise: "Affiliate marketing without guesswork."
 *
 * DESIGN SYSTEM:
 *   BG Primary: #0B0B0F | BG Secondary: #0F172A
 *   Text Primary: #F9FAFB | Text Secondary: #9CA3AF
 *   Accent: Royal Gold #D4AF37
 *   CTA: bg #D4AF37, text #0B0B0F
 *   NO green/teal. Sharp contrast. Premium, bold, authoritative.
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
  Bot,
  TrendingUp,
  PenTool,
  Layout,
  ShoppingBag,
  Search,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LiveActivityBar } from "@/components/LiveActivityBar";
import { Testimonials } from "@/components/Testimonials";
import { Shield, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "What exactly do I get for $7?",
    a: "You get immediate access to done-for-you digital products with full resell rights, the complete Affiliated Degree course, 40,000+ ChatGPT prompts, swipe files, scripts, templates, and access to the Its Dad affiliate portal. Everything you need to start earning.",
  },
  {
    q: "Do I need experience in affiliate marketing?",
    a: "Not at all. Its Dad was built specifically for people who are new to affiliate marketing or who tried before and didn't succeed. The system tells you exactly what to do, step by step. You follow it.",
  },
  {
    q: "What is the Affiliated Degree?",
    a: "It's an 8-module self-paced course that teaches you the fundamentals of affiliate marketing. Once you complete it, you earn your Affiliated Degree credential. It's not just theory — every module is designed to get you closer to your first commission.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no contracts, no commitments, and no cancellation fees. You can cancel your membership at any time from your dashboard. Plus, we offer a 7-day money-back guarantee — if it's not for you, you get a full refund.",
  },
  {
    q: "How do commissions work?",
    a: "When you promote products from the Its Dad portal and someone purchases through your link, you earn a commission. Rates range from 30% to 40% depending on your membership tier. Commissions are recurring — you earn every month your referral stays active.",
  },
  {
    q: "What makes Its Dad different from other affiliate programs?",
    a: "Most programs hand you a link and say 'good luck.' Its Dad gives you the entire system — done-for-you products, swipe files, posting scripts, a step-by-step course, and tracking tools. You don't figure it out alone. The system does the heavy lifting.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.1)" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#F9FAFB" }}>
          Frequently Asked <span style={{ color: "#D4AF37" }}>Questions</span>
        </h2>
        <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
          Got questions? We've got answers.
        </p>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "rgba(11,11,15,0.6)",
                border: "1px solid rgba(212,175,55,0.08)",
              }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-base font-semibold pr-4" style={{ color: "#F9FAFB" }}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  style={{ color: "#D4AF37" }}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd page="home" />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — HEADLINE
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[85vh] flex items-center py-20 px-4 overflow-hidden"
        style={{ backgroundColor: "#0B0B0F" }}
      >
        {/* Subtle radial glow — gold, not green */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 65%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center w-full">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight"
            style={{ color: "#F9FAFB" }}
          >
            Affiliate Marketing<br />
            <span style={{ color: "#D4AF37" }}>Without the Guesswork</span>
          </h1>

          {/* SECTION 2 — SUBHEADLINE */}
          <p
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: "#9CA3AF" }}
          >
            51 done-for-you products. A step-by-step system.<br className="hidden md:block" />
            You follow the plan. You keep the profit.
          </p>
          <p
            className="text-lg max-w-xl mx-auto mb-10 italic"
            style={{ color: "#D4AF37" }}
          >
            If you've tried before and failed… this is your reset.
          </p>

          {/* SECTION 3 — PRIMARY CTA ($7) */}
          <a href="/memberships">
            <Button
              size="lg"
              className="font-extrabold text-xl px-12 py-7 h-auto rounded-xl shadow-2xl hover:scale-105 transition-all duration-200 border-0"
              style={{
                backgroundColor: "#D4AF37",
                color: "#0B0B0F",
                boxShadow: "0 0 40px rgba(212,175,55,0.25)",
              }}
            >
              Get Instant Access for $7 →
            </Button>
          </a>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <p className="text-sm font-semibold" style={{ color: "#D4AF37" }}>
              7-Day Money-Back Guarantee
            </p>
          </div>
          <p className="text-xs mt-2" style={{ color: "#6B7280" }}>
            Cancel anytime. No contracts. Not for you? Full refund within 7 days.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRODUCT GRID — "51 Done-For-You Products Included"
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-12 px-4"
        style={{ backgroundColor: "#0B0B0F", borderTop: "1px solid rgba(212,175,55,0.08)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center text-sm font-semibold uppercase tracking-widest mb-8"
            style={{ color: "#D4AF37" }}
          >
            51 Done-For-You Products Included
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: <Bot className="w-6 h-6" />, name: "AI Starter Kit" },
              { icon: <TrendingUp className="w-6 h-6" />, name: "TikTok Viral Secrets" },
              { icon: <PenTool className="w-6 h-6" />, name: "Copywriting Cash Machine" },
              { icon: <Layout className="w-6 h-6" />, name: "Landing Page Mastery" },
              { icon: <ShoppingBag className="w-6 h-6" />, name: "Shopify Blueprint" },
              { icon: <Search className="w-6 h-6" />, name: "SEO Domination Guide" },
            ].map((product, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-center"
                style={{
                  backgroundColor: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(212,175,55,0.1)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
                >
                  {product.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: "#F9FAFB" }}>
                  {product.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "#6B7280" }}>
            + 45 more products inside the portal
          </p>
        </div>
      </section>

      {/* Live Activity */}
      <LiveActivityBar />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4 — WHAT YOU GET
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "#0B0B0F", borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#F9FAFB" }}>
            What You Get for <span style={{ color: "#D4AF37" }}>$7</span>
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
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
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(212,175,55,0.08)",
                }}
              >
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <span className="text-lg" style={{ color: "#F9FAFB" }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="/memberships">
              <Button
                size="lg"
                className="font-bold text-lg px-10 py-5 h-auto rounded-xl hover:scale-105 transition-all border-0"
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#0B0B0F",
                  boxShadow: "0 0 30px rgba(212,175,55,0.2)",
                }}
              >
                Get Instant Access for $7 →
              </Button>
            </a>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
              <span className="text-sm font-semibold" style={{ color: "#D4AF37" }}>7-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5 — WHO THIS IS FOR
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "#0F172A", borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#F9FAFB" }}>
            Who This Is <span style={{ color: "#D4AF37" }}>For</span>
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
            If any of these sound like you, you're in the right place.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: <Target className="w-5 h-5" />, text: "You tried affiliate marketing but never made a sale" },
              { icon: <Users className="w-5 h-5" />, text: "You're overwhelmed by too many options and no clear path" },
              { icon: <BookOpen className="w-5 h-5" />, text: "You want a system that tells you exactly what to do" },
              { icon: <Zap className="w-5 h-5" />, text: "You're ready to stop watching and start earning" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{
                  backgroundColor: "rgba(11,11,15,0.6)",
                  border: "1px solid rgba(212,175,55,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
                >
                  {item.icon}
                </div>
                <span className="text-base leading-relaxed" style={{ color: "#F9FAFB" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6 — WHY THIS WORKS
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "#0B0B0F", borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: "#F9FAFB" }}>
            Why This <span style={{ color: "#D4AF37" }}>Works</span>
          </h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
            Most affiliate programs give you a link and say "good luck." We don't.
          </p>

          <div className="space-y-6">
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(212,175,55,0.08)" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>No Guesswork</h3>
              <p className="leading-relaxed" style={{ color: "#9CA3AF" }}>
                You don't pick products. You don't write copy from scratch. You don't figure out what to post.
                The system tells you what to do, step by step. You follow it.
              </p>
            </div>
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(212,175,55,0.08)" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>Done-For-You Products</h3>
              <p className="leading-relaxed" style={{ color: "#9CA3AF" }}>
                51 digital products with full resell rights. Sales pages already built. Funnels already wired.
                You promote them. You keep 100% of the sale. No commission splits.
              </p>
            </div>
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(212,175,55,0.08)" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>Built for Beginners Who've Been Burned</h3>
              <p className="leading-relaxed" style={{ color: "#9CA3AF" }}>
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
      <section
        className="py-20 px-4"
        style={{
          backgroundColor: "#0F172A",
          borderTop: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
              style={{
                backgroundColor: "rgba(212,175,55,0.1)",
                color: "#D4AF37",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              <Star className="w-4 h-4" />
              BEST VALUE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#F9FAFB" }}>
              Builder Club — <span style={{ color: "#D4AF37" }}>$19/mo</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
              For members ready to go beyond the basics. More products, more tools, more earning power.
            </p>
          </div>

          <div
            className="p-8 rounded-2xl relative"
            style={{
              backgroundColor: "rgba(11,11,15,0.8)",
              border: "2px solid rgba(212,175,55,0.35)",
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span
                className="text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: "#D4AF37", color: "#0B0B0F" }}
              >
                Most Popular
              </span>
            </div>

            <div className="grid gap-3 mb-8">
              <p className="font-semibold text-lg mb-2" style={{ color: "#F9FAFB" }}>Everything in Starter Pack, plus:</p>
              {[
                "Unlock more products from the 51-product library",
                "Daily content prompts so you always know what to post",
                "Advanced affiliate strategies and scaling methods",
                "Priority support from the Its Dad team",
                "Community access with other builders",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#D4AF37" }} />
                  <span style={{ color: "#9CA3AF" }}>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <a href="/memberships">
                <Button
                  size="lg"
                  className="font-extrabold text-lg px-10 py-5 h-auto rounded-xl hover:scale-105 transition-all border-0"
                  style={{
                    backgroundColor: "#D4AF37",
                    color: "#0B0B0F",
                    boxShadow: "0 0 40px rgba(212,175,55,0.25)",
                  }}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Join Builder Club — $19/mo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            <p className="text-center text-sm mt-4" style={{ color: "#6B7280" }}>
              Cancel anytime. Upgrade or downgrade whenever you want.
            </p>
          </div>

          {/* Tier hint */}
          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Want even more?{" "}
              <Link href="/memberships" className="underline underline-offset-2" style={{ color: "#D4AF37" }}>
                See all membership tiers
              </Link>
              {" "}— Pro Club ($49.99) and Inner Circle Club ($99.99) unlock the full 51-product library.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: "#0B0B0F", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
        <Testimonials />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ SECTION
          ═══════════════════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "#0B0B0F", borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#F9FAFB" }}>
            Stop Guessing.<br />
            <span style={{ color: "#D4AF37" }}>Start Earning.</span>
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "#9CA3AF" }}>
            $7 gets you in. The system does the rest. You just follow it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/memberships">
              <Button
                size="lg"
                className="font-extrabold text-xl px-12 py-7 h-auto rounded-xl hover:scale-105 transition-all border-0"
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#0B0B0F",
                  boxShadow: "0 0 40px rgba(212,175,55,0.25)",
                }}
              >
                Get Instant Access for $7 →
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span className="text-sm font-semibold" style={{ color: "#D4AF37" }}>7-Day Money-Back Guarantee</span>
          </div>
          <p className="text-xs mt-2" style={{ color: "#6B7280" }}>
            No contracts. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>
    </>
  );
}
// build trigger 1775097698
