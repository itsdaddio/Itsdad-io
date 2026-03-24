/**
 * AllianceDashboard.tsx
 *
 * Its Dad LLC — Alliance Referral Dashboard Widget
 *
 * Displays:
 * - New member onboarding state (when totalSignups === 0 and totalEarnedCents === 0)
 * - Member's unique referral link + copy button
 * - "Challenge a Friend" share button (SMS + Social)
 * - Free months pending
 * - Total signups and commissions earned
 * - Recent Alliance activity
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";

interface ReferralStats {
  code: string | null;
  link: string | null;
  totalSignups: number;
  totalEarnedCents: number;
  pendingFreeMonths: number;
  recentSignups: Array<{ id: number; tier: string; createdAt: string }>;
  recentCommissions: Array<{
    id: number;
    type: string;
    amountCents: number;
    description: string;
    createdAt: string;
  }>;
}

interface ChallengeText {
  sms: string;
  social: string;
  link: string;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── New Member Onboarding State ──────────────────────────────────────────────
// Shown when a member has 0 referrals and $0 earned — replaces dead zeroes
// with a welcoming, action-oriented start-here guide.

const START_HERE_STEPS = [
  {
    number: "01",
    icon: "🔗",
    title: "Copy Your Referral Link",
    desc: "Your unique link is below. Every signup through it earns you a free month + 30–40% commission.",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
  },
  {
    number: "02",
    icon: "📱",
    title: "Challenge One Person",
    desc: "Text one person you know who has talked about wanting extra income. One tap — that's it.",
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/5",
  },
  {
    number: "03",
    icon: "📚",
    title: "Start the Affiliated Degree",
    desc: "Your first module is unlocked. 15 minutes today puts you ahead of 90% of affiliates.",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
  },
  {
    number: "04",
    icon: "💸",
    title: "Watch the 6.7% Stack",
    desc: "When your referral earns, you earn 6.7% of their commissions — automatically, forever.",
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
  },
];

function NewMemberOnboarding({ link, code, onCopy, copied }: {
  link: string | null;
  code: string | null;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-amber-900/30 to-gray-900 rounded-2xl p-6 border border-amber-500/30 text-center">
        <div className="text-4xl mb-3">🤝</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          You're at the table, Dad.
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          Your Alliance account is active. You haven't referred anyone yet — that changes today.
          Here's your first four moves.
        </p>
      </div>

      {/* Start Here Steps */}
      <div className="space-y-3">
        {START_HERE_STEPS.map((step) => (
          <div
            key={step.number}
            className={`rounded-xl p-4 border ${step.border} ${step.bg} flex gap-4 items-start`}
          >
            <div className={`text-2xl font-black ${step.color} shrink-0 w-8 text-center`}>
              {step.icon}
            </div>
            <div>
              <p className={`font-bold text-sm ${step.color} mb-0.5`}>
                Step {step.number} — {step.title}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Link — prominent placement for new members */}
      <div className="bg-gray-900 rounded-xl p-5 border border-amber-500/40">
        <p className="text-white font-semibold mb-1">Your Referral Link</p>
        <p className="text-slate-500 text-xs mb-3">
          Share this. Every click is a potential free month and commission for you.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2.5 text-amber-300 text-sm font-mono truncate">
            {link ?? "Generating your link…"}
          </div>
          <button
            onClick={onCopy}
            disabled={!link}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
        {code && (
          <p className="text-gray-500 text-xs mt-2">
            Your code: <span className="text-amber-400 font-mono">{code}</span>
          </p>
        )}
      </div>

      {/* Milestone Preview */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <p className="text-white font-semibold mb-3">Your First Milestone</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>0 referrals</span>
              <span>1 referral = free month</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
            </div>
          </div>
          <div className="text-center shrink-0">
            <p className="text-amber-400 font-bold text-lg">0/1</p>
            <p className="text-slate-500 text-xs">referrals</p>
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-3">
          One referral = your next month free. Two referrals = you're already in profit.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/hubs"
          className="py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold text-center hover:bg-slate-700 transition-colors"
        >
          📚 Start Degree
        </Link>
        <a
          href="/memberships"
          className="py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold text-center hover:bg-slate-700 transition-colors"
        >
          ⬆️ Upgrade Tier
        </a>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AllianceDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [challenge, setChallenge] = useState<ChallengeText | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareMode, setShareMode] = useState<"sms" | "social" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/referral/stats").then((r) => r.json()),
      fetch("/api/referral/challenge-text").then((r) => r.json()),
    ])
      .then(([s, c]) => {
        setStats(s);
        setChallenge(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function copyLink() {
    if (!stats?.link) return;
    navigator.clipboard.writeText(stats.link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function sendSMS() {
    if (!challenge) return;
    window.open(`sms:?body=${encodeURIComponent(challenge.sms)}`, "_blank");
  }

  function shareToSocial() {
    if (!challenge) return;
    setShareMode("social");
    navigator.clipboard.writeText(challenge.social).then(() => {
      setTimeout(() => setShareMode(null), 3000);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  // ── New Member State: show onboarding instead of empty zeroes ──
  const isNewMember =
    (stats?.totalSignups ?? 0) === 0 && (stats?.totalEarnedCents ?? 0) === 0;

  if (isNewMember) {
    return (
      <NewMemberOnboarding
        link={stats?.link ?? null}
        code={stats?.code ?? null}
        onCopy={copyLink}
        copied={copied}
      />
    );
  }

  // ── Active Member State: full dashboard ──
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-amber-500/20">
        <h2 className="text-2xl font-bold text-white mb-1">
          Your Alliance
        </h2>
        <p className="text-gray-400 text-sm">
          Bring someone to the table. Get your next month free. Earn 6.7% when they win.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-3xl font-bold text-amber-400">
            {stats?.totalSignups ?? 0}
          </p>
          <p className="text-gray-400 text-xs mt-1">Members Referred</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-3xl font-bold text-green-400">
            {formatCents(stats?.totalEarnedCents ?? 0)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Alliance Earnings</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-3xl font-bold text-blue-400">
            {stats?.pendingFreeMonths ?? 0}
          </p>
          <p className="text-gray-400 text-xs mt-1">Free Months Pending</p>
        </div>
      </div>

      {/* ── Referral Link ── */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <p className="text-white font-semibold mb-3">Your Referral Link</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2.5 text-amber-300 text-sm font-mono truncate">
            {stats?.link ?? "Loading..."}
          </div>
          <button
            onClick={copyLink}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Your code: <span className="text-amber-400 font-mono">{stats?.code}</span>
        </p>
      </div>

      {/* ── Challenge a Friend ── */}
      <div className="bg-gradient-to-br from-amber-900/30 to-gray-900 rounded-xl p-5 border border-amber-500/30">
        <p className="text-white font-bold text-lg mb-1">Challenge a Friend</p>
        <p className="text-gray-400 text-sm mb-4">
          Get one person to sign up at your tier or higher — your next month is on us.
        </p>
        <div className="flex gap-3">
          <button
            onClick={sendSMS}
            className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            📱 Send via Text
          </button>
          <button
            onClick={shareToSocial}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            {shareMode === "social" ? "✅ Copied!" : "📣 Copy for Social"}
          </button>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <p className="text-white font-semibold mb-3">How the Alliance Works</p>
        <div className="space-y-3">
          {[
            {
              icon: "🔗",
              title: "Share Your Link",
              desc: "Send your unique link to anyone who wants to build an income online.",
            },
            {
              icon: "🎁",
              title: "They Join — You Get a Free Month",
              desc: "The moment they sign up at your tier or higher, your next month is waived.",
            },
            {
              icon: "💸",
              title: "6.7% When They Win",
              desc: "You earn a 6.7% override on every commission your referral makes. When they eat, you eat.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-white text-sm font-semibold">{item.title}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      {(stats?.recentCommissions?.length ?? 0) > 0 && (
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-white font-semibold mb-3">Recent Alliance Activity</p>
          <div className="space-y-2">
            {stats!.recentCommissions.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div>
                  <p className="text-white text-sm">
                    {c.type === "direct" ? "Direct Commission" : "6.7% Alliance Override"}
                  </p>
                  <p className="text-gray-500 text-xs">{formatDate(c.createdAt)}</p>
                </div>
                <span className="text-green-400 font-semibold text-sm">
                  +{formatCents(c.amountCents)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
