/**
 * LiveActivityBar — Social proof ticker
 *
 * Displays a horizontally scrolling bar of recent member activity events
 * (signups, commissions earned, course completions) to build trust and
 * create urgency for visitors who have not yet joined.
 *
 * Runs entirely client-side with a rotating set of realistic activity messages.
 * No backend dependency — messages cycle on a configurable interval.
 */

import { useEffect, useState } from "react";
import { Zap, TrendingUp, Award, Users } from "lucide-react";

interface ActivityEvent {
  id: number;
  icon: React.ReactNode;
  message: string;
  time: string;
}

const ACTIVITY_POOL: Omit<ActivityEvent, "id" | "time">[] = [
  { icon: <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />, message: "Marcus T. from Atlanta just joined the Affiliate Portal" },
  { icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />, message: "Jasmine R. earned her first commission — $47.00" },
  { icon: <Award className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />, message: "DeShawn M. completed Module 3 of the Affiliated Degree" },
  { icon: <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />, message: "Priya K. from Houston joined — Welcome!" },
  { icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />, message: "Carlos V. earned $124.50 in product commissions this week" },
  { icon: <Award className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />, message: "Tanya W. earned her Affiliated Degree — Congratulations!" },
  { icon: <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />, message: "Brandon L. from Chicago just activated his membership" },
  { icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />, message: "Aaliyah S. referred 2 members — earning recurring commissions" },
  { icon: <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />, message: "Kevin O. from Dallas joined — his dashboard is live" },
  { icon: <Award className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />, message: "Monique B. completed the full Affiliated Degree course" },
  { icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />, message: "James F. earned $312 in his first 30 days" },
  { icon: <Users className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />, message: "Destiny N. from Miami just joined the community" },
];

const TIME_LABELS = [
  "just now", "1 min ago", "2 min ago", "3 min ago", "5 min ago",
  "7 min ago", "9 min ago", "11 min ago", "14 min ago", "18 min ago",
];

function buildQueue(): ActivityEvent[] {
  return ACTIVITY_POOL.map((item, i) => ({
    ...item,
    id: i,
    time: TIME_LABELS[i % TIME_LABELS.length],
  }));
}

export function LiveActivityBar() {
  const [events] = useState<ActivityEvent[]>(buildQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out, swap message, fade in
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
        setVisible(true);
      }, 400);
    }, 4500);

    return () => clearInterval(interval);
  }, [events.length]);

  const current = events[currentIndex];

  return (
    <div className="w-full bg-slate-900/80 border-b border-emerald-500/20 backdrop-blur-sm py-2 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
        {/* Live indicator dot */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {/* Activity message */}
        <div
          className="flex items-center gap-2 text-sm transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {current.icon}
          <span className="text-slate-200">{current.message}</span>
          <span className="text-slate-500 text-xs hidden sm:inline">· {current.time}</span>
        </div>
      </div>
    </div>
  );
}
