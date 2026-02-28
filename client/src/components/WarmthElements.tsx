/**
 * WarmthElements.tsx
 *
 * Warmth and trust-building UI elements for Its Dad LLC.
 * Designed to make the platform feel supportive and reliable
 * without implying personal, hands-on involvement.
 *
 * MANIFEST PATCH (item 11):
 *   - Replaced all "Dad's got your back" messages with passive/automated language
 */

import { Shield, Zap, Clock, BarChart2, BookOpen, Headphones } from "lucide-react";

interface WarmthCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WARMTH_CARDS: WarmthCard[] = [
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "The System Has You Covered",
    // MANIFEST PATCH: was "Dad's got your back — always"
    description:
      "Every tool, template, and resource is pre-loaded and ready the moment you join. The platform runs 24/7 so you never have to wait for anyone.",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Instant Access, Zero Friction",
    // MANIFEST PATCH: was "Dad's got your back — no waiting"
    description:
      "Your dashboard, affiliate links, swipe files, and course modules activate automatically on signup. No approval queue. No onboarding call needed.",
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-400" />,
    title: "Always On, Always Working",
    // MANIFEST PATCH: was "Dad's got your back — day and night"
    description:
      "The affiliate tracking system, commission calculator, and referral engine run continuously in the background — earning for you while you sleep.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-blue-400" />,
    title: "Automated Progress Tracking",
    // MANIFEST PATCH: was "Dad's got your back — watching your progress"
    description:
      "Your dashboard automatically tracks clicks, conversions, course progress, and earnings in real time. No manual reporting. No spreadsheets.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
    title: "Self-Paced Learning Engine",
    // MANIFEST PATCH: was "Dad's got your back — at your pace"
    description:
      "The Affiliated Degree course, Prompt Vault, and video library are available 24/7. Learn when it suits you — the content never expires.",
  },
  {
    icon: <Headphones className="w-6 h-6 text-amber-400" />,
    title: "24/7 Self-Serve Support",
    // MANIFEST PATCH: was "Dad's got your back — pick up the phone"
    description:
      "The Prompt Vault and pre-recorded video library cover every common question. Most answers are available in under 60 seconds without waiting for a reply.",
  },
];

export function WarmthElements() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Built to Work <span className="text-amber-400">For You, Automatically</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every part of the Its Dad platform is designed to remove friction and put the system to work on your behalf.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WARMTH_CARDS.map((card, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-xl border border-border bg-card/50 hover:border-amber-500/20 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
