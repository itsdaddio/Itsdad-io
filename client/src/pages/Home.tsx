/**
 * Home.tsx — itsdad.io Homepage
 * ZERO FRICTION: Single "Start Here" CTA → Free Roadmap → Starter Pack ($7)
 * No quiz, no tier comparison, no decision-making at entry point.
 */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  Users,
  Package,
  Heart,
  CheckCircle2,
  HandHeart,
} from "lucide-react";
import { Testimonials } from "@/components/Testimonials";
import { WarmthElements } from "@/components/WarmthElements";
import { BlueprintEmailCapture } from "@/components/BlueprintEmailCapture";
import { JsonLd } from "@/components/JsonLd";
import { LiveActivityBar } from "@/components/LiveActivityBar";

// ─── How It Works — simplified 3-step funnel ─────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <Users className="w-6 h-6 text-amber-400" />,
    title: "Get Your Free Roadmap",
    description:
      "Enter your email and get the free affiliate roadmap. It shows you exactly how the system works — no commitment, no credit card.",
  },
  {
    step: "02",
    icon: <Package className="w-6 h-6 text-purple-400" />,
    title: "Activate Your Starter Pack",
    description:
      "For $7/month, you get your first product to promote, a viral script ready to post, step-by-step instructions, plus the full Affiliated Degree course, 40K ChatGPT prompts, and done-for-you swipe files. One product to focus on — a full system behind you.",
  },
  {
    step: "03",
    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
    title: "Scale When You're Ready",
    description:
      "Once you've made your first sale, you can upgrade to unlock more products, daily content prompts, and scaling methods. But that comes later — start here first.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <JsonLd page="home" />

      {/* ── Hero — Single "Start Here" CTA ─────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-purple-950/70 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center w-full">
          <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30 text-sm px-4 py-1.5 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Affiliate Marketing — Made Simple
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Make Your First $1 Online<br />
            <span className="text-amber-400">in 72 Hours</span>
          </h1>

          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-4 leading-relaxed drop-shadow">
            Without guessing what to do.
          </p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
            Follow a simple system. We tell you exactly what to post, promote, and repeat.
          </p>

          {/* Single CTA */}
          <div className="flex justify-center mb-8">
            <a href="#start-here">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-xl px-10 py-7 h-auto rounded-xl font-bold shadow-2xl"
              >
                <HandHeart className="w-6 h-6 mr-3" />
                Start for $7
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </a>
          </div>

          <p className="text-sm text-slate-400">
            No guesswork. Just follow the system.
          </p>
        </div>
      </section>

      {/* ── Live Activity Bar ──────────────────────────────────────────── */}
      <LiveActivityBar />

      {/* ── How It Works — 3-step funnel ───────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-amber-400">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three steps. No guesswork. The system walks you through everything.
            </p>
          </div>

          <div className="space-y-8">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-6 p-6 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-amber-500/30 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-amber-400/60 uppercase tracking-wider">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow to roadmap */}
          <div className="text-center mt-10">
            <a href="#start-here">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-lg px-8 py-5 h-auto rounded-xl font-semibold shadow-2xl"
              >
                <HandHeart className="w-5 h-5 mr-2" />
                Get Your Free Roadmap
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Warmth Elements ───────────────────────────────────────────── */}
      <WarmthElements />

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <div className="border-t border-border">
        <Testimonials />
      </div>

      {/* ── Free Roadmap Capture (Primary Conversion Point) ───────────── */}
      <section id="start-here" className="py-20 px-4 border-t border-border">
        <div className="max-w-xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Start Here — <span className="text-amber-400">Get Your Free Roadmap</span>
          </h2>
          <p className="text-muted-foreground">
            Enter your name and email. You'll get the step-by-step affiliate roadmap instantly — no credit card, no commitment. Just a clear path to your first dollar.
          </p>
        </div>
        <BlueprintEmailCapture />

        {/* After roadmap, gentle nudge to Starter Pack */}
        <div className="max-w-xl mx-auto text-center mt-10 p-6 rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-slate-400 mb-3">Already have the roadmap?</p>
          <Link href="/memberships">
            <Button
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              Activate My Starter Pack — $7/mo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* NOTE: No duplicate footer here — the global App.tsx footer handles it */}
    </>
  );
}
