/**
 * client/src/pages/AffiliateLy.tsx
 *
 * itsdad.io — Affiliate-ly Super Affiliate Portal
 *
 * The full 51-product catalog with:
 *  - Category filter tabs
 *  - Referral link auto-embedding (reads itsdad_ref cookie/session)
 *  - Per-product "Get Your Link" + "Buy Now" buttons
 *  - Click tracking on every product link
 *  - Level-based product grouping (10 per level, Level 4 = 10 + 1 bonus)
 *
 * Route: /affiliate-ly
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { PRODUCTS_51 as PRODUCTS, PRODUCT_CATEGORIES } from "@/data/products51";
import type { Product } from "@/data/products51";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function getRefCode(): string | null {
  return sessionStorage.getItem("itsdad_ref") || getCookie("itsdad_ref");
}

function buildAffiliateLink(productId: number, refCode: string | null): string {
  const base = `${window.location.origin}/product/${productId}`;
  return refCode ? `${base}?ref=${refCode}` : base;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

// Product prices in cents (matching server/products.ts) — all tripwires are $7
const PRODUCT_PRICES: Record<number, number> = {};
for (let i = 1; i <= 51; i++) PRODUCT_PRICES[i] = 700;

// Category color mapping
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "AI Tools":             { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30", dot: "bg-violet-400" },
  "Social Media":         { bg: "bg-pink-500/10",   text: "text-pink-400",   border: "border-pink-500/30",   dot: "bg-pink-400" },
  "E-commerce":           { bg: "bg-cyan-500/10",   text: "text-cyan-400",   border: "border-cyan-500/30",   dot: "bg-cyan-400" },
  "Finance":              { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/30",  dot: "bg-green-400" },
  "Personal Development": { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/30",  dot: "bg-amber-400" },
  "Marketing":            { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" },
};

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  refCode,
  isBonus = false,
}: {
  product: Product;
  refCode: string | null;
  isBonus?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS["Marketing"];
  const price = PRODUCT_PRICES[product.id] || 2700;
  const commission = Math.floor((price * product.commission) / 100);

  async function handleCopyLink() {
    const link = buildAffiliateLink(product.id, refCode);
    // Track click
    fetch("/api/products/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, referralCode: refCode }),
    }).catch(() => {});
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleBuyNow() {
    // Navigate to the full product sales page with funnel
    const refParam = refCode ? `?ref=${refCode}` : "";
    window.location.href = `/product/${product.id}${refParam}`;
  }

  return (
    <div
      className={`relative rounded-2xl border bg-slate-800/60 backdrop-blur-sm transition-all duration-200 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 ${
        isBonus
          ? "border-amber-500/50 ring-1 ring-amber-500/20"
          : "border-white/10"
      }`}
    >
      {isBonus && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold tracking-wide whitespace-nowrap">
          ★ BONUS PRODUCT
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {product.category}
              </span>
              <span className="text-slate-500 text-xs">#{product.id}</span>
            </div>
            <h3 className="text-white font-semibold text-sm leading-snug">
              {product.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-white font-bold text-base">{formatPrice(price)}</div>
            <div className="text-green-400 text-xs font-medium">
              +{formatPrice(commission)} / sale
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            {product.description}
          </p>
        )}

        {/* Commission badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              style={{ width: `${product.commission}%` }}
            />
          </div>
          <span className="text-green-400 text-xs font-bold">{product.commission}% commission</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all border ${
              copied
                ? "bg-green-500/20 border-green-500/40 text-green-400"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {copied ? "✓ Copied!" : "🔗 Copy Link"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-1.5 justify-center">
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Wait…
              </span>
            ) : (
              "Buy Now →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Level Badge ──────────────────────────────────────────────────────────────
function LevelBadge({ level }: { level: number }) {
  const labels = ["", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
  const colors = [
    "",
    "from-slate-500 to-slate-600",
    "from-blue-600 to-blue-700",
    "from-purple-600 to-purple-700",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
  ];
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${colors[level]} text-white text-sm font-bold`}>
      <span>{labels[level]}</span>
      {level === 4 && <span className="text-xs opacity-80">+Bonus</span>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AffiliateLy() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [refCode, setRefCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setRefCode(getRefCode());
  }, []);

  const categories = ["All", ...PRODUCT_CATEGORIES.map((c) => c.name)];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group into levels (10 per level, level 4 has 11 = 10 + bonus)
  function getLevelForProduct(id: number): number {
    if (id <= 10) return 1;
    if (id <= 20) return 2;
    if (id <= 30) return 3;
    if (id <= 41) return 4; // 31–41 = 11 products (10 + bonus #41)
    return 5;
  }

  // Build level groups for the "All" view
  const levelGroups: Array<{ level: number; products: Product[] }> = [];
  if (activeCategory === "All" && !searchQuery) {
    for (let lvl = 1; lvl <= 5; lvl++) {
      const lvlProducts = PRODUCTS.filter((p) => getLevelForProduct(p.id) === lvl);
      if (lvlProducts.length > 0) levelGroups.push({ level: lvl, products: lvlProducts });
    }
  }

  const showLevels = activeCategory === "All" && !searchQuery;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-600/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-5">
            ⚡ Affiliate-ly — The Super Affiliate Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Your Products.
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Your Links.
            </span>{" "}
            Real Commissions.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Copy your affiliate link, share it, and earn commissions on every sale.
            Your referral code is automatically embedded in every link.
          </p>

          {/* Referral code status */}
          {refCode ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Referral code active: <span className="font-bold">{refCode}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 border border-white/10 text-slate-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              No referral code detected —{" "}
              <Link href="/alliance" className="text-amber-400 hover:text-amber-300 underline">
                get yours on the Alliance page
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="border-b border-white/5 bg-slate-800/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {[
              { label: "Total Products", value: "51", icon: "📦" },
              { label: "Avg Commission", value: "35%", icon: "💰" },
              { label: "Price Range", value: "$17–$47", icon: "🏷️" },
              { label: "Categories", value: "6", icon: "🗂️" },
              { label: "Your Earnings", value: "30–40% / sale", icon: "📈" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-base">{stat.icon}</span>
                <div>
                  <div className="text-white font-bold text-sm">{stat.value}</div>
                  <div className="text-slate-500 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const colors = cat === "All" ? null : CATEGORY_COLORS[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? cat === "All"
                      ? "bg-white text-slate-900 border-white"
                      : `${colors?.bg} ${colors?.text} ${colors?.border} border`
                    : "bg-slate-800/60 text-slate-400 border-white/10 hover:bg-slate-700/60 hover:text-white"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({PRODUCTS.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {showLevels ? (
          // Level-grouped view
          <div className="space-y-12">
            {levelGroups.map(({ level, products }) => (
              <div key={level}>
                <div className="flex items-center gap-4 mb-6">
                  <LevelBadge level={level} />
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-slate-500 text-sm">{products.length} products</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      refCode={refCode}
                      isBonus={level === 4 && product.id === 41}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Filtered view
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    refCode={refCode}
                    isBonus={product.id === 41}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-purple-600/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to Earn Your Affiliated Degree?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Share your links, earn commissions on every sale, and unlock higher tiers as you grow.
            The Alliance has your back every step of the way.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/alliance"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all"
            >
              View My Alliance Stats →
            </Link>
            <Link
              href="/memberships"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold text-sm transition-all"
            >
              Upgrade Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
