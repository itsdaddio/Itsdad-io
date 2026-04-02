/**
 * AdminDashboard.tsx — Daddio's Personal Admin Dashboard
 *
 * DESIGN SYSTEM: Royal Gold #D4AF37 on #0B0B0F
 * LOCKED CONFIG: Starter $7 | Builder Club $19 (BEST VALUE) | Pro Club $49.99 | Inner Circle $99.99
 *
 * PIN-protected. Shows: Money, People, Content.
 */
import { useState, useEffect } from "react";
import {
  Crown,
  DollarSign,
  Users,
  Mail,
  MousePointerClick,
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  UserPlus,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardData {
  timestamp: string;
  overview: {
    totalUsers: number;
    totalEmailCaptures: number;
    totalProductClicks: number;
    totalConversions: number;
    totalReferralSignups: number;
    totalCommissionsCents: number;
    totalCommissionsCount: number;
  };
  membersByTier: Array<{ tier: string; status: string; total: number }>;
  recentSignups: Array<{ id: number; email: string; name: string | null; createdAt: string }>;
  recentMemberships: Array<{ id: number; userId: number; tier: string; status: string; createdAt: string }>;
  recentEmailCaptures: Array<{ id: number; email: string; name: string | null; source: string | null; createdAt: string }>;
  emailSequenceStats: Array<{ status: string; total: number }>;
}

const TIER_LABELS: Record<string, string> = {
  starter: "Starter Pack",
  builder: "Builder Club",
  pro: "Pro Club",
  "inner-circle": "Inner Circle Club",
  member: "Member",
};

const TIER_PRICES: Record<string, string> = {
  starter: "$7/mo",
  builder: "$19/mo",
  pro: "$49.99/mo",
  "inner-circle": "$99.99/mo",
  member: "Free",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return local.slice(0, 2) + "***@" + domain;
}

const ADMIN_EMAILS = ["itsdad@itsdad.io", "walker.brooksc1987@gmail.com"];
const ADMIN_PIN_KEY = "itsdad_admin_pin";

export default function AdminDashboard() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [showEmails, setShowEmails] = useState(false);

  // Auto-login: check localStorage for saved PIN on mount
  useEffect(() => {
    const savedPin = localStorage.getItem(ADMIN_PIN_KEY);
    if (savedPin) {
      setPin(savedPin);
      fetchDashboard(savedPin);
    }
  }, []);

  async function fetchDashboard(pinCode: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/dashboard?pin=${encodeURIComponent(pinCode)}`);
      if (res.status === 401) {
        setError("Wrong PIN. Try again.");
        setAuthenticated(false);
        localStorage.removeItem(ADMIN_PIN_KEY);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
      // Save PIN for auto-login
      localStorage.setItem(ADMIN_PIN_KEY, pinCode);
    } catch {
      setError("Could not load dashboard. Server may be unavailable.");
    }
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length >= 4) fetchDashboard(pin);
  }

  function refresh() {
    if (pin) fetchDashboard(pin);
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_PIN_KEY);
    setAuthenticated(false);
    setPin("");
    setData(null);
  }

  // ── PIN Gate ──
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0B0B0F" }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm text-center">
          <Crown className="w-12 h-12 mx-auto mb-4" style={{ color: "#D4AF37" }} />
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#F9FAFB" }}>Admin Access</h1>
          <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>Enter your PIN to continue</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full px-4 py-3 rounded-lg text-center text-lg font-mono tracking-widest mb-4 border-0 outline-none"
            style={{
              backgroundColor: "#0F172A",
              color: "#F9FAFB",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <Button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full font-bold text-lg py-3 h-auto rounded-lg border-0"
            style={{ backgroundColor: "#D4AF37", color: "#0B0B0F" }}
          >
            {loading ? "Loading..." : "Enter Dashboard"}
          </Button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  // ── Compute tier totals ──
  const activeTiers: Record<string, number> = {};
  let totalActiveMembers = 0;
  for (const row of data.membersByTier) {
    if (row.status === "active") {
      activeTiers[row.tier] = (activeTiers[row.tier] || 0) + row.total;
      totalActiveMembers += row.total;
    }
  }

  // Estimated MRR
  const tierMRR: Record<string, number> = {
    starter: 7, builder: 19, pro: 49.99, "inner-circle": 99.99, member: 0,
  };
  let estimatedMRR = 0;
  for (const [tier, count] of Object.entries(activeTiers)) {
    estimatedMRR += (tierMRR[tier] || 0) * count;
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: "#0B0B0F" }}>
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Crown className="w-8 h-8" style={{ color: "#D4AF37" }} />
              <h1 className="text-3xl font-extrabold" style={{ color: "#F9FAFB" }}>
                Welcome From <span style={{ color: "#D4AF37" }}>Its Daddio</span>
              </h1>
            </div>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Last updated: {formatDate(data.timestamp)}
            </p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MONEY
            ══════════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#D4AF37" }}>
            <DollarSign className="w-5 h-5" /> Money
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Est. Monthly Revenue"
              value={`$${estimatedMRR.toFixed(2)}`}
              sub="Active subscriptions"
              icon={<TrendingUp className="w-5 h-5" />}
              highlight
            />
            <StatCard
              label="Active Members"
              value={totalActiveMembers.toString()}
              sub="Paying subscribers"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Product Clicks"
              value={data.overview.totalProductClicks.toString()}
              sub={`${data.overview.totalConversions} converted`}
              icon={<MousePointerClick className="w-5 h-5" />}
            />
            <StatCard
              label="Commissions Paid"
              value={`$${(data.overview.totalCommissionsCents / 100).toFixed(2)}`}
              sub={`${data.overview.totalCommissionsCount} total`}
              icon={<Zap className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* ── Tier Breakdown ── */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "#9CA3AF" }}>Members by Tier</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["starter", "builder", "pro", "inner-circle"].map((tier) => (
              <div
                key={tier}
                className="p-4 rounded-xl text-center"
                style={{
                  backgroundColor: "rgba(15,23,42,0.6)",
                  border: tier === "builder"
                    ? "2px solid rgba(212,175,55,0.4)"
                    : "1px solid rgba(212,175,55,0.08)",
                }}
              >
                <p className="text-xs font-medium mb-1" style={{ color: "#9CA3AF" }}>
                  {TIER_LABELS[tier]}
                  {tier === "builder" && (
                    <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>
                      BEST VALUE
                    </span>
                  )}
                </p>
                <p className="text-2xl font-extrabold" style={{ color: "#F9FAFB" }}>
                  {activeTiers[tier] || 0}
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{TIER_PRICES[tier]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PEOPLE
            ══════════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#D4AF37" }}>
              <UserPlus className="w-5 h-5" /> People
            </h2>
            <button
              onClick={() => setShowEmails(!showEmails)}
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
              style={{ backgroundColor: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
            >
              {showEmails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showEmails ? "Hide Emails" : "Show Emails"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <StatCard
              label="Total Users"
              value={data.overview.totalUsers.toString()}
              sub="All registered accounts"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Email Captures"
              value={data.overview.totalEmailCaptures.toString()}
              sub="Free roadmap signups"
              icon={<Mail className="w-5 h-5" />}
            />
          </div>

          {/* Recent Signups */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#9CA3AF" }}>Recent Signups</h3>
            <div
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(212,175,55,0.08)" }}
            >
              {data.recentSignups.length === 0 ? (
                <p className="p-4 text-center text-sm" style={{ color: "#6B7280" }}>No signups yet. They're coming.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: "#9CA3AF" }}>Name</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: "#9CA3AF" }}>Email</th>
                      <th className="text-right px-4 py-2 font-medium" style={{ color: "#9CA3AF" }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentSignups.slice(0, 10).map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.04)" }}>
                        <td className="px-4 py-2" style={{ color: "#F9FAFB" }}>{u.name || "—"}</td>
                        <td className="px-4 py-2" style={{ color: "#9CA3AF" }}>
                          {showEmails ? u.email : maskEmail(u.email)}
                        </td>
                        <td className="px-4 py-2 text-right text-xs" style={{ color: "#6B7280" }}>
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Email Captures */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#9CA3AF" }}>Recent Email Captures (Leads)</h3>
            <div
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(212,175,55,0.08)" }}
            >
              {data.recentEmailCaptures.length === 0 ? (
                <p className="p-4 text-center text-sm" style={{ color: "#6B7280" }}>No captures yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: "#9CA3AF" }}>Email</th>
                      <th className="text-left px-4 py-2 font-medium" style={{ color: "#9CA3AF" }}>Source</th>
                      <th className="text-right px-4 py-2 font-medium" style={{ color: "#9CA3AF" }}>Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEmailCaptures.slice(0, 10).map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid rgba(212,175,55,0.04)" }}>
                        <td className="px-4 py-2" style={{ color: "#9CA3AF" }}>
                          {showEmails ? c.email : maskEmail(c.email)}
                        </td>
                        <td className="px-4 py-2 text-xs" style={{ color: "#6B7280" }}>{c.source || "homepage"}</td>
                        <td className="px-4 py-2 text-right text-xs" style={{ color: "#6B7280" }}>
                          {formatDate(c.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CONTENT / QUICK LINKS
            ══════════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#D4AF37" }}>
            <Shield className="w-5 h-5" /> Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Stripe Dashboard", href: "https://dashboard.stripe.com", desc: "Revenue & payments" },
              { label: "MailerLite", href: "https://app.mailerlite.com", desc: "Email campaigns" },
              { label: "Railway", href: "https://railway.com", desc: "Server & deploys" },
              { label: "Product Page #1", href: "https://itsdad.io/product/1", desc: "AI Starter Kit" },
              { label: "Product Page #8", href: "https://itsdad.io/product/8", desc: "TikTok Viral Secrets" },
              { label: "Product Page #9", href: "https://itsdad.io/product/9", desc: "Copywriting Cash Machine" },
              { label: "Memberships Page", href: "https://itsdad.io/memberships", desc: "Tier signup page" },
              { label: "Alliance Page", href: "https://itsdad.io/alliance", desc: "Referral system" },
              { label: "Instagram", href: "https://instagram.com/itsdad.io", desc: "Social content" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(212,175,55,0.08)",
                }}
              >
                <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#D4AF37" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#F9FAFB" }}>{link.label}</p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>{link.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Email Sequence Stats ── */}
        {data.emailSequenceStats.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#9CA3AF" }}>Email Sequences</h3>
            <div className="flex gap-3">
              {data.emailSequenceStats.map((s, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl text-center"
                  style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(212,175,55,0.08)" }}
                >
                  <p className="text-xs uppercase font-medium mb-1" style={{ color: "#9CA3AF" }}>{s.status}</p>
                  <p className="text-xl font-bold" style={{ color: "#F9FAFB" }}>{s.total}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            YOUR STATUS — Inner Circle + Affiliated Degree
            ══════════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#D4AF37" }}>
            <Crown className="w-5 h-5" /> Your Status
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Inner Circle Badge */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "rgba(15,23,42,0.6)",
                border: "2px solid rgba(212,175,55,0.5)",
                background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(212,175,55,0.05) 100%)",
              }}
            >
              <Crown className="w-10 h-10 mx-auto mb-3" style={{ color: "#D4AF37" }} />
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#D4AF37" }}>Active Membership</p>
              <p className="text-2xl font-extrabold mb-1" style={{ color: "#F9FAFB" }}>Inner Circle Club</p>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>$99.99/mo — MOST VALUE</p>
              <p className="text-xs mt-2" style={{ color: "#6B7280" }}>Full access to all 51 products + all tiers</p>
            </div>

            {/* Affiliated Degree Certificate */}
            <div
              className="p-6 rounded-xl text-center"
              style={{
                backgroundColor: "rgba(15,23,42,0.6)",
                border: "2px solid rgba(212,175,55,0.5)",
                background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(212,175,55,0.05) 100%)",
              }}
            >
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#D4AF37" }}>Certification</p>
              <p className="text-2xl font-extrabold mb-1" style={{ color: "#F9FAFB" }}>Affiliated Degree</p>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>Certified by Its Daddio</p>
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22C55E" }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                COMPLETED
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between py-8" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
          <div>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Its Dad LLC — Admin Dashboard — Locked System Config Active
            </p>
            <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
              Starter $7 | Builder Club $19 (Best Value) | Pro Club $49.99 | Inner Circle Club $99.99
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card Component ── */
function StatCard({
  label, value, sub, icon, highlight,
}: {
  label: string; value: string; sub: string; icon: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        backgroundColor: "rgba(15,23,42,0.6)",
        border: highlight
          ? "2px solid rgba(212,175,55,0.35)"
          : "1px solid rgba(212,175,55,0.08)",
      }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: "#D4AF37" }}>
        {icon}
        <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>{label}</span>
      </div>
      <p
        className="text-2xl font-extrabold"
        style={{ color: highlight ? "#D4AF37" : "#F9FAFB" }}
      >
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{sub}</p>
    </div>
  );
}
