import { useState } from "react";
import { Link as ExternalLink, Calculator, CheckCircle, AlertCircle, Loader2, TrendingUp, DollarSign, Users, BarChart3 } from "lucide-react";

// ─── Affiliate Link Checker ────────────────────────────────────────────────────

function AffiliateLinkChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | { valid: boolean; issues: string[]; suggestions: string[] }>(null);
  const [loading, setLoading] = useState(false);

  const checkLink = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const issues: string[] = [];
      const suggestions: string[] = [];
      let valid = true;

      // Check for common affiliate link patterns
      const hasHttps = url.startsWith("https://");
      const hasHttp = url.startsWith("http://");
      const hasTracking = /[?&](ref|aff|affiliate|tag|id|via|source|utm_source|partner|click|track)/i.test(url);
      const hasAmazon = url.includes("amazon.com");
      const hasClickbank = url.includes("clickbank.net") || url.includes("hop.clickbank.net");
      const hasShareASale = url.includes("shareasale.com");
      const hasJvzoo = url.includes("jvzoo.com") || url.includes("jvz");
      const hasDigistore = url.includes("digistore24.com");
      const isItsDad = url.includes("itsdad.io");

      if (!hasHttps && !hasHttp) {
        issues.push("URL must start with http:// or https://");
        valid = false;
      }

      if (hasHttp && !hasHttps) {
        issues.push("Using HTTP instead of HTTPS — visitors may see a security warning");
        suggestions.push("Change http:// to https:// for a secure link");
      }

      if (!hasTracking && !hasAmazon && !hasClickbank && !hasShareASale && !hasJvzoo && !hasDigistore && !isItsDad) {
        issues.push("No affiliate tracking parameter detected in the URL");
        suggestions.push("Add your affiliate ID as a query parameter (e.g., ?ref=YOURID)");
        valid = false;
      }

      if (hasAmazon) {
        const hasAmazonTag = /[?&]tag=/.test(url);
        if (!hasAmazonTag) {
          issues.push("Amazon link is missing your Associates tracking tag");
          suggestions.push("Add ?tag=YOURTAG-20 to your Amazon link");
          valid = false;
        } else {
          suggestions.push("Amazon Associates tag detected — link looks good!");
        }
      }

      if (hasClickbank) {
        suggestions.push("ClickBank HopLink detected — tracking is built in");
      }

      if (hasShareASale) {
        const hasMerchantId = /merchantID=\d+/i.test(url);
        if (!hasMerchantId) {
          issues.push("ShareASale link may be missing merchant ID");
        } else {
          suggestions.push("ShareASale link structure looks correct");
        }
      }

      if (isItsDad) {
        const hasRef = /[?&]ref=/.test(url);
        if (!hasRef) {
          issues.push("itsdad.io link is missing a referral code");
          suggestions.push("Add ?ref=YOURCODE to track referrals");
          valid = false;
        } else {
          suggestions.push("itsdad.io referral link detected — tracking active!");
          valid = true;
        }
      }

      if (url.length > 500) {
        issues.push("URL is very long — consider using a link shortener for social media");
        suggestions.push("Use bit.ly or a custom short domain for cleaner sharing");
      }

      if (issues.length === 0 && valid) {
        suggestions.push("Link structure looks solid — tracking parameters are present");
        suggestions.push("Test the link in an incognito window to verify it redirects correctly");
      }

      setResult({ valid, issues, suggestions });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <ExternalLink className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Affiliate Link Checker</h2>
          <p className="text-slate-400 text-sm">Verify your links are tracking correctly before you share them</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkLink()}
          placeholder="Paste your affiliate link here..."
          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 text-sm"
        />
        <button
          onClick={checkLink}
          disabled={loading || !url.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check Link"}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.valid ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            {result.valid ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span className={`font-semibold ${result.valid ? "text-green-400" : "text-red-400"}`}>
              {result.valid ? "Link looks good — tracking detected" : "Issues found — review before sharing"}
            </span>
          </div>

          {result.issues.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Issues</p>
              {result.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  {issue}
                </div>
              ))}
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Suggestions</p>
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-slate-500 text-xs">
          Checks for tracking parameters, HTTPS security, platform-specific patterns (Amazon, ClickBank, ShareASale, itsdad.io), and link length. Always test your links in an incognito window before publishing.
        </p>
      </div>
    </div>
  );
}

// ─── Commission Calculator ─────────────────────────────────────────────────────

function CommissionCalculator() {
  const [salePrice, setSalePrice] = useState("97");
  const [commissionRate, setCommissionRate] = useState("35");
  const [monthlySales, setMonthlySales] = useState("10");
  const [tier2Rate, setTier2Rate] = useState("10");
  const [tier2Sales, setTier2Sales] = useState("5");
  const [showTier2, setShowTier2] = useState(false);

  const price = parseFloat(salePrice) || 0;
  const rate = parseFloat(commissionRate) / 100 || 0;
  const sales = parseInt(monthlySales) || 0;
  const t2Rate = parseFloat(tier2Rate) / 100 || 0;
  const t2Sales = parseInt(tier2Sales) || 0;

  const perSale = price * rate;
  const monthlyTier1 = perSale * sales;
  const monthlyTier2 = price * t2Rate * t2Sales;
  const totalMonthly = monthlyTier1 + (showTier2 ? monthlyTier2 : 0);
  const annualTotal = totalMonthly * 12;

  const presets = [
    { label: "Starter Pack", price: "7", rate: "30" },
    { label: "Builder Club", price: "19", rate: "35" },
    { label: "Pro Club", price: "49.99", rate: "35" },
    { label: "Inner Circle Club", price: "99.99", rate: "40" },
  ];

  return (
    <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Commission Calculator</h2>
          <p className="text-slate-400 text-sm">Project your monthly and annual affiliate earnings</p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">Quick Presets — itsdad.io Products</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => { setSalePrice(p.price); setCommissionRate(p.rate); }}
              className="px-3 py-2 rounded-lg bg-slate-700/50 border border-white/10 text-slate-300 text-xs hover:border-amber-500/50 hover:text-amber-400 transition-colors text-left"
            >
              <div className="font-semibold">{p.label}</div>
              <div className="text-slate-500">${p.price} · {p.rate}%</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Sale Price ($)</label>
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm"
            min="0"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Commission Rate (%)</label>
          <input
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Sales Per Month</label>
          <input
            type="number"
            value={monthlySales}
            onChange={(e) => setMonthlySales(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm"
            min="0"
          />
        </div>
      </div>

      {/* Tier 2 Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowTier2(!showTier2)}
          className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${showTier2 ? "bg-amber-500 border-amber-500" : "border-slate-500"}`}>
            {showTier2 && <CheckCircle className="w-3 h-3 text-white" />}
          </div>
          Add second-tier referral commissions (Inner Circle Club feature)
        </button>

        {showTier2 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Tier 2 Rate (%)</label>
              <input
                type="number"
                value={tier2Rate}
                onChange={(e) => setTier2Rate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Tier 2 Sales / Month</label>
              <input
                type="number"
                value={tier2Sales}
                onChange={(e) => setTier2Sales(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wide">Per Sale</span>
          </div>
          <div className="text-2xl font-bold text-white">${perSale.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wide">Monthly</span>
          </div>
          <div className="text-2xl font-bold text-green-400">${totalMonthly.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wide">Annual</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">${annualTotal.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs uppercase tracking-wide">Break Even</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {perSale > 0 ? Math.ceil(7 / perSale) : "—"} sales
          </div>
          <div className="text-slate-500 text-xs mt-1">to cover $7/mo membership</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
        <p className="text-slate-500 text-xs">
          Estimates only. Actual earnings depend on traffic, conversion rates, and product availability.
        </p>
        <a
          href="/memberships"
          className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
        >
          Start earning →
        </a>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FreeTools() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" />
            Free Tools — No Sign-Up Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tools Built for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-500">
              Affiliate Marketers
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Check your links before you share them. Calculate your commissions before you commit. Free, instant, no account needed.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <AffiliateLinkChecker />
          <CommissionCalculator />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-500/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Put These Numbers to Work?</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Join Affiliation Nation — 51 curated products, done-for-you swipe files, and the Affiliated Degree course. Start earning real commissions from day one.
            </p>
            <a
              href="/memberships"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Activate My Starter Pack
              <TrendingUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
