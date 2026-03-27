/**
 * MeetDad.tsx — The "Meet Dad" page for itsdad.io
 * Warm, inviting, authentic introduction to the person behind the platform.
 * No private information disclosed. Feels like meeting a trusted mentor.
 */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  BookOpen,
  Lightbulb,
  Shield,
  Coffee,
} from "lucide-react";

const VALUES = [
  {
    icon: <Heart className="w-6 h-6 text-rose-400" />,
    title: "Genuine Support",
    desc: "This platform was built because I know what it feels like to try something and not have anyone in your corner. That changes here.",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    title: "No Hype, No Gimmicks",
    desc: "You'll never find fake income claims or manufactured urgency here. What you'll find is a real system, real products, and real results.",
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
    title: "Done-For-You Simplicity",
    desc: "I spent years building the infrastructure so you don't have to. You show up, follow the system, and the tools do the heavy lifting.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
    title: "Education First",
    desc: "The Affiliated Degree isn't just a course — it's a credential. I believe knowledge compounds, and every module you complete is an investment in yourself.",
  },
];

const MILESTONES = [
  { label: "Products Curated", value: "51" },
  { label: "Course Modules Built", value: "8" },
  { label: "ChatGPT Prompts Included", value: "40K" },
  { label: "Recurring Commission Rate", value: "30–40%" },
];

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Starter Pack Member",
    quote: "I tried three other affiliate programs before this one. The difference is the support system. Dad actually built something that works.",
    stars: 5,
  },
  {
    name: "Priya S.",
    role: "Builder Club Member",
    quote: "The swipe files alone saved me weeks of work. I had my first commission within 10 days of joining.",
    stars: 5,
  },
  {
    name: "Jerome W.",
    role: "Inner Circle Club Member",
    quote: "The Affiliated Degree changed how I think about online business. I'm not just promoting products — I understand the system now.",
    stars: 5,
  },
];

export default function MeetDad() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[60vh] flex items-center py-24 px-4 overflow-hidden"
        style={{
          backgroundImage: "url('/images/meet-dad-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-amber-950/60 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30 text-sm px-4 py-1.5 backdrop-blur-sm">
            <Coffee className="w-3.5 h-3.5 mr-1.5 inline" />
            Pull up a chair. Stay a while.
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Meet <span className="text-amber-400">Dad</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
            The person behind itsdad.io isn't a corporation or a faceless brand. 
            It's someone who tried, failed, figured it out, and built a system so 
            you wouldn't have to start from scratch.
          </p>
        </div>
      </section>

      {/* ── The Story ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Why <span className="text-amber-400">Its Dad?</span>
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              The name isn't an accident. "Dad" means something specific — it means 
              someone who shows up, who gives you the tools before you know you need them, 
              who doesn't let you fail for lack of information.
            </p>
            <p>
              Affiliate marketing is one of the most accessible paths to financial independence 
              that exists. But most people who try it quit — not because they lack drive, but 
              because they lack a system. They're handed a link and told "go promote." That's not 
              support. That's abandonment.
            </p>
            <p>
              itsdad.io was built to be the opposite of that. Every product in the catalog 
              comes with done-for-you swipe files. Every membership tier includes automated 
              tracking. The Affiliated Degree gives you the knowledge to understand what you're 
              doing — not just how to do it.
            </p>
            <p className="text-foreground font-medium">
              The goal was simple: build the platform I wish had existed when I started.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What This Platform <span className="text-amber-400">Stands For</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These aren't marketing bullet points. They're the principles the entire 
              platform was built around.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex gap-4 p-6 rounded-2xl border border-border bg-card/50 hover:border-amber-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── By the Numbers ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-card/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            What Was Built <span className="text-amber-400">For You</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MILESTONES.map((m) => (
              <div
                key={m.label}
                className="text-center p-6 rounded-2xl border border-border bg-card/50"
              >
                <p className="text-4xl font-black text-amber-400 mb-2">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Members Say ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Users className="w-3 h-3 mr-1 inline" />
              Member Voices
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What the Family <span className="text-amber-400">Says</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-border bg-card/50 hover:border-amber-500/30 transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border bg-card/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Join <span className="text-amber-400">the Family?</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Everything is set up and waiting for you. Pick your tier, unlock your 
            products, and start earning — with the full system behind you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/memberships">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-lg px-8 py-6 h-auto rounded-xl font-bold shadow-2xl"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Choose Your Membership
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto rounded-xl border-border hover:border-amber-500/30"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore the Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
