/**
 * Home.tsx — Its Dad LLC Homepage (Visual Enhancement v2)
 * - Hero with full background image
 * - Giveaway section with confetti animation
 * - Product category cover images
 * - Rich section backgrounds
 * - Affiliated Degree visual banner
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  Star,
  Users,
  Package,
  Heart,
  Gift,
  Sparkles,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
// Core components
import { Testimonials } from "@/components/Testimonials";
import { MembershipWidget } from "@/components/MembershipWidget";
import { MembershipComparisonTable } from "@/components/MembershipComparisonTable";
import { WarmthElements } from "@/components/WarmthElements";
import { BlueprintEmailCapture } from "@/components/BlueprintEmailCapture";
import { StickyCTA } from "@/components/StickyCTA";
import { MembershipQuiz } from "@/components/MembershipQuiz";
import { JsonLd } from "@/components/JsonLd";
import { FoundingCountdown } from "@/components/FoundingCountdown";
import { LiveActivityBar } from "@/components/LiveActivityBar";
import { ProductPreview } from "@/components/ProductPreview";

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "51", label: "Curated Products" },
  { value: "8", label: "Course Modules" },
  { value: "40K", label: "ChatGPT Prompts" },
  { value: "30–40%", label: "Recurring Commissions" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <Crown className="w-6 h-6 text-amber-400" />,
    title: "Join & Unlock",
    description:
      "Choose your tier and your dashboard activates instantly. No waiting. No approval. Your affiliate links, products, and course modules are live the moment payment clears.",
    img: "/images/product-ai-tools.jpg",
  },
  {
    step: "02",
    icon: <Package className="w-6 h-6 text-purple-400" />,
    title: "Pick Your Products",
    description:
      "Browse 51 curated digital products across 6 categories. Each one comes with done-for-you swipe files — ad copy, email scripts, and social posts ready to copy and paste.",
    img: "/images/product-marketing.jpg",
  },
  {
    step: "03",
    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
    title: "Promote & Earn",
    description:
      "Share your unique affiliate links. The system tracks every click, conversion, and commission automatically. Payouts are processed without manual intervention.",
    img: "/images/product-finance.jpg",
  },
  {
    step: "04",
    icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    title: "Earn Your Degree",
    description:
      "Complete the 8-module Affiliated Degree course at your own pace. Members who finish report 3x higher earnings in their first 90 days.",
    img: "/images/affiliated-degree-bg.jpg",
  },
];

const BUNDLE_ITEMS = [
  { name: "AutoShorts AI", desc: "Daily YouTube Shorts on autopilot" },
  { name: "AutoMarket", desc: "Discord & Telegram promo posts" },
  { name: "Youcord AI", desc: "YouTube → Discord in seconds" },
  { name: "ContentPilot Blog", desc: "Turns trends into SEO blog posts" },
  { name: "FinanceUpdater", desc: "Tracks financial updates automatically" },
  { name: "YouBlog AI", desc: "YouTube videos → full blog posts" },
];

// ─── Confetti Component ───────────────────────────────────────────────────────
function ConfettiPiece({ delay, left, color }: { delay: number; left: number; color: string }) {
  return (
    <div
      className="absolute top-0 w-3 h-3 rounded-sm opacity-0 animate-confetti-fall"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        backgroundColor: color,
        animationDuration: `${2.5 + Math.random() * 2}s`,
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [confettiPieces] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      left: Math.random() * 100,
      color: ["#FFD700", "#FF6B35", "#A855F7", "#10B981", "#3B82F6", "#EC4899"][Math.floor(Math.random() * 6)],
    }))
  );

  return (
    <>
      <JsonLd page="home" />
      <LiveActivityBar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-purple-950/70 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center w-full">
          <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30 text-sm px-4 py-1.5 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Affiliate Marketing Facilitation Hub
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            The System That Earns<br />
            <span className="text-amber-400">While You Learn</span>
          </h1>

          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow">
            51 curated products. Done-for-you swipe files. The Affiliated Degree course.
            Earn 30–40% recurring commissions — automatically tracked, automatically paid.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-xl border border-white/10 bg-white/10 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/memberships">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-lg px-8 py-6 h-auto rounded-xl font-semibold shadow-2xl"
              >
                <Crown className="w-5 h-5 mr-2" />
                Join Its Dad
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/course">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View the Course
              </Button>
            </Link>
          </div>
          {/* Founding countdown — placed AFTER the value prop, not before */}
          <div className="mt-2">
            <FoundingCountdown />
          </div>
        </div>
      </section>

      {/* ── Giveaway Section ─────────────────────────────────────────────── */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/images/giveaway-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-purple-950/70 to-slate-950/90 pointer-events-none" />

        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPieces.map((p) => (
            <ConfettiPiece key={p.id} delay={p.delay} left={p.left} color={p.color} />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Giveaway headline */}
          <div className="mb-6">
            <span className="inline-block text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-none mb-2">
              You get a bundle.
            </span>
            <br />
            <span className="inline-block text-5xl md:text-7xl font-black text-amber-400 drop-shadow-2xl leading-none mb-2">
              YOU get a bundle.
            </span>
            <br />
            <span className="inline-block text-4xl md:text-6xl font-black text-white drop-shadow-2xl leading-none">
              🎉 EVERYBODY gets a bundle! 🎉
            </span>
          </div>

          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-10">
            Every paid Its Dad member receives <strong className="text-amber-400">The Ultimate AI Automation Bundle</strong> — 5 production-ready AI agents that work for you daily — completely free. No catch. Dad said so.
          </p>

          {/* Bundle items grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {BUNDLE_ITEMS.map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-slate-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-base px-5 py-2">
              <Gift className="w-4 h-4 mr-2 inline" />
              FREE with Every Paid Membership · $25 Value
            </Badge>
            <Link href="/memberships">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-lg px-8 py-4 h-auto rounded-xl font-bold shadow-2xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Claim Your Free Bundle
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 border-t border-border"
        style={{
          backgroundImage: "url('/images/section-bg-dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-amber-400">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four steps. Fully automated. The system handles the heavy lifting from day one.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-amber-500/30 transition-all hover:-translate-y-1"
              >
                {/* Step image */}
                <div className="h-32 overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-card/90" />
                </div>
                <div className="p-5">
                  <span className="absolute top-3 right-3 text-3xl font-black text-white/20 select-none">
                    {step.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Warmth Elements ───────────────────────────────────────────────── */}
      <WarmthElements />

      {/* ── Product Preview ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <ProductPreview />
        </div>
      </section>

      {/* ── Affiliated Degree Banner ──────────────────────────────────────── */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/images/affiliated-degree-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <GraduationCap className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Earn Your <span className="text-amber-400">Affiliated Degree</span>
          </h2>
          <p className="text-xl text-slate-200 mb-8 leading-relaxed">
            Complete all 8 modules of the Affiliated Degree course and earn your certification. Members who finish report <strong className="text-amber-400">3x higher earnings</strong> in their first 90 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/course">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-lg px-8 py-6 h-auto rounded-xl font-bold shadow-2xl"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Start the Course
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Membership Widget ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your <span className="text-amber-400">Membership</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every tier includes automated commission tracking, done-for-you swipe files, and instant dashboard access.
            </p>
          </div>
          <MembershipWidget />
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Full Feature <span className="text-amber-400">Comparison</span>
            </h2>
          </div>
          <MembershipComparisonTable />
        </div>
      </section>

      {/* ── Quiz ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Not Sure Which Tier? <span className="text-amber-400">Take the Quiz</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Answer 4 quick questions and we'll recommend the right membership for your goals.
          </p>
          <MembershipQuiz />
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <div className="border-t border-border">
        <Testimonials />
      </div>

      {/* ── Blueprint Email Capture ───────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Get the Free <span className="text-amber-400">Blueprint</span>
          </h2>
          <p className="text-muted-foreground">
            Download the free affiliate blueprint and see exactly how the system works before you join.
          </p>
        </div>
        <BlueprintEmailCapture />
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-foreground text-lg">Its Dad LLC</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                An automated affiliate marketing facilitation hub. 51 curated products, the Affiliated Degree course, and a 24/7 self-serve Prompt Vault.
              </p>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/memberships" className="hover:text-foreground transition-colors">Memberships</Link></li>
                <li><Link href="/products" className="hover:text-foreground transition-colors">Products</Link></li>
                <li><Link href="/course" className="hover:text-foreground transition-colors">Affiliated Degree</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/hubs" className="hover:text-foreground transition-colors">Knowledge Hubs</Link></li>
                <li><Link href="/tools" className="hover:text-foreground transition-colors">Free Tools</Link></li>
              </ul>
            </div>

            {/* Legal + Donations */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Legal & Giving</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-foreground transition-colors">Earnings Disclaimer</Link></li>
                <li>
                  <a
                    href="https://www.allprodad.com/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    All Pro Dad Program
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.itsdad.io/giving"
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Community Giving
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Its Dad LLC. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Commissions are earned on product sales. Results are not guaranteed.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <StickyCTA />
    </>
  );
}
