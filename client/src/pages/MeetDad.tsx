/**
 * MeetDad.tsx — The "Meet Dad" / About page for itsdad.io
 * Real founder story. Personal, vulnerable, relatable.
 * Cool, confident, charming — the Daddio brand.
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
  TrendingUp,
  Target,
  Zap,
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

const JOURNEY_STEPS = [
  {
    icon: <Target className="w-5 h-5 text-red-400" />,
    title: "The Failed Attempts",
    desc: "I tried affiliate marketing four separate times. Four different programs, four different \"gurus,\" four different promises. Every single one left me with the same thing: a link, a dream, and absolutely no system to make it work.",
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
    title: "The Breakthrough",
    desc: "The fifth time, I stopped following other people's playbooks and built my own. I realized the problem was never the products — it was the infrastructure. Nobody was giving beginners the tools, the scripts, the templates, and the tracking they actually needed.",
  },
  {
    icon: <Zap className="w-5 h-5 text-purple-400" />,
    title: "Building Its Dad",
    desc: "So I built it myself. 51 curated products. Done-for-you swipe files. An 8-module course. Automated tracking. A commission structure that actually rewards you. Everything I wished someone had handed me on day one.",
  },
  {
    icon: <Users className="w-5 h-5 text-emerald-400" />,
    title: "Opening the Doors",
    desc: "Its Dad isn't a corporation. It's one person who got tired of watching good people fail because nobody set them up to succeed. Now the system is open, the tools are ready, and the only thing missing is you.",
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Builder Club Member",
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

      {/* ── The Real Story ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            The <span className="text-amber-400">Real Story</span>
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Let me keep it real with you. I'm not some Silicon Valley tech bro who 
              woke up one morning and decided to "disrupt" affiliate marketing. I'm a 
              regular person who spent years trying to make money online, failing at it, 
              and refusing to quit.
            </p>
            <p>
              I bought the courses. I joined the programs. I followed the "gurus." 
              And every single time, I ended up in the same place — staring at a 
              dashboard full of zeros, wondering what I was doing wrong. The truth? 
              I wasn't doing anything wrong. The systems I was given were incomplete.
            </p>
            <p>
              They'd hand you a product link and say "go promote it." No scripts. 
              No templates. No swipe files. No tracking. No support. Just a link 
              and a prayer. That's not a business model — that's abandonment.
            </p>
            <p className="text-foreground font-medium text-xl border-l-4 border-amber-400 pl-6 py-2">
              "I failed at affiliate marketing four times before I finally understood: 
              the problem was never me. It was the system. So I built a better one."
            </p>
            <p>
              That's what Its Dad is. It's the platform I wish had existed when I started. 
              Every product comes with done-for-you marketing materials. Every membership 
              includes automated tracking. The Affiliated Degree course doesn't just teach 
              you theory — it walks you through exactly what to do, step by step, until 
              you see results.
            </p>
            <p>
              The name "Dad" isn't random. It means something. A dad shows up. A dad 
              gives you the tools before you know you need them. A dad doesn't let you 
              fail for lack of information. That's what this platform does.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Journey ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The <span className="text-amber-400">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From four failures to building a system that actually works.
            </p>
          </div>
          <div className="space-y-6">
            {JOURNEY_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex gap-6 p-6 rounded-2xl border border-border bg-card/50 hover:border-amber-500/30 transition-all"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border bg-card/30">
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
      <section className="py-16 px-4 border-t border-border">
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
      <section className="py-20 px-4 border-t border-border bg-card/30">
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

      {/* ── A Personal Note ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            One Last <span className="text-amber-400">Thing</span>
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              I'm not going to pretend this is easy. Building an income online takes 
              work, consistency, and patience. But it doesn't have to take confusion. 
              It doesn't have to take guesswork. And it definitely doesn't have to 
              take doing it alone.
            </p>
            <p>
              If you've tried before and it didn't work out — good. That means you've 
              got the drive. You just didn't have the system. Now you do.
            </p>
            <p className="text-foreground font-semibold text-xl">
              Welcome to the family.
            </p>
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
            Everything is set up and waiting for you. Get the free roadmap, 
            activate your Starter Pack, and start earning — with the full system behind you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#start-here">
              <Button
                size="lg"
                className="btn-gold-gradient gold-shimmer hover:scale-105 transition-transform text-lg px-8 py-6 h-auto rounded-xl font-bold shadow-2xl"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Start for $7
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <Link href="/free-tools">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto rounded-xl border-border hover:border-amber-500/30"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Try the Free Tools
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            7-Day Money-Back Guarantee. Cancel anytime. No contracts.
          </p>
        </div>
      </section>

    </div>
  );
}
