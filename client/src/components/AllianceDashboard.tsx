/**
 * AllianceDashboard.tsx
 *
 * Its Dad LLC — Alliance Referral Dashboard Widget
 *
 * Displays:
 * - Member's unique referral link + copy button
 * - "Challenge a Friend" share button (SMS + Social)
 * - Free months pending
 * - Total signups and commissions earned
 * - Recent Alliance activity
 */

import { useState, useEffect } from "react";

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
    window.open(
      `sms:?body=${encodeURIComponent(challenge.sms)}`,
      "_blank"
    );
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
