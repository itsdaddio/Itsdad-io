/**
 * FoundingCountdown — Founding member urgency countdown banner
 *
 * Displays a countdown timer to the end of the "Founding Member" pricing window.
 * The target date is set 14 days from the component's first render and persisted
 * in localStorage so it remains consistent across page refreshes for the same visitor.
 *
 * When the countdown expires the banner switches to a "Founding pricing has ended"
 * state — no artificial reset.
 *
 * Spec: 136 lines, urgency countdown timer
 */

import { useEffect, useState } from "react";
import { Clock, Flame, X } from "lucide-react";

const STORAGE_KEY = "itsdad_founding_deadline";
const FOUNDING_DAYS = 14; // days from first visit

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getDeadline(): Date {
  if (typeof window === "undefined") return new Date(Date.now() + FOUNDING_DAYS * 86400000);

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = new Date(stored);
    if (!isNaN(parsed.getTime()) && parsed > new Date()) return parsed;
  }

  const deadline = new Date(Date.now() + FOUNDING_DAYS * 86400000);
  localStorage.setItem(STORAGE_KEY, deadline.toISOString());
  return deadline;
}

function calcTimeLeft(deadline: Date): TimeLeft | null {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface CountdownUnitProps {
  value: number;
  label: string;
}

function CountdownUnit({ value, label }: CountdownUnitProps) {
  return (
    <div className="flex flex-col items-center min-w-[48px]">
      <span className="text-2xl md:text-3xl font-bold text-amber-400 tabular-nums leading-none">
        {pad(value)}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{label}</span>
    </div>
  );
}

export function FoundingCountdown() {
  const [deadline] = useState<Date>(getDeadline);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(deadline));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft(calcTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(tick);
  }, [deadline]);

  if (dismissed) return null;

  // Expired state
  if (!timeLeft) {
    return (
      <div className="w-full bg-slate-800/90 border-b border-amber-500/20 py-2 px-4 text-center text-sm text-slate-400">
        Founding member pricing has ended. Standard rates now apply.
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-purple-950/90 via-slate-900/95 to-purple-950/90 border-b border-amber-500/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 relative">

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Label */}
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
          <Flame className="w-4 h-4 animate-pulse" />
          <span>Founding Member Pricing Ends In</span>
        </div>

        {/* Countdown units */}
        <div className="flex items-center gap-3">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <span className="text-amber-400 font-bold text-xl mb-3">:</span>
          <CountdownUnit value={timeLeft.hours} label="Hrs" />
          <span className="text-amber-400 font-bold text-xl mb-3">:</span>
          <CountdownUnit value={timeLeft.minutes} label="Min" />
          <span className="text-amber-400 font-bold text-xl mb-3">:</span>
          <CountdownUnit value={timeLeft.seconds} label="Sec" />
        </div>

        {/* Sub-label */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Lock in founding rates before they expire</span>
        </div>
      </div>
    </div>
  );
}
