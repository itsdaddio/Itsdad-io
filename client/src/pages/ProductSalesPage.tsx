/**
 * client/src/pages/ProductSalesPage.tsx
 *
 * Dynamic product sales page with full funnel flow:
 *   1. Sales Page (problem → solution → what's inside → tripwire offer)
 *   2. Order Bump (add-on at checkout)
 *   3. Upsell (one-time offer after purchase)
 *   4. Downsell (reduced offer if upsell declined)
 *   5. Thank You (delivery + next steps)
 *
 * Route: /product/:id  or  /product/:slug
 */
import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { trackPageView, trackEvent } from "@/lib/analytics";
import {
  getProductSalesData,
  getProductBySlug,
  productSlug,
  type ProductSalesData,
  type FunnelStep,
} from "@/data/productSalesTypes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function getRefCode(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref") || sessionStorage.getItem("itsdad_ref") || getCookie("itsdad_ref");
}

function renderMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/^✅ (.*$)/gm, '<div class="flex items-start gap-2 my-1"><span class="text-green-400 mt-1 shrink-0">✅</span><span>$1</span></div>')
    .replace(/^❌ (.*$)/gm, '<div class="flex items-start gap-2 my-1"><span class="text-red-400 mt-1 shrink-0">❌</span><span>$1</span></div>')
    .replace(/^🎁 (.*$)/gm, '<div class="flex items-start gap-2 my-1"><span class="mt-1 shrink-0">🎁</span><span>$1</span></div>')
    .replace(/\n\n/g, "</p><p class='my-3 text-slate-300 leading-relaxed'>")
    .replace(/\n/g, "<br/>");
}

// ─── Category Colors ──────────────────────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<string, string> = {
  "AI Tools": "from-violet-600 to-purple-700",
  "Social Media": "from-pink-600 to-rose-700",
  "E-commerce": "from-cyan-600 to-teal-700",
  Finance: "from-green-600 to-emerald-700",
  "Personal Development": "from-amber-600 to-orange-700",
  Marketing: "from-orange-600 to-red-700",
};

const CATEGORY_ACCENTS: Record<string, string> = {
  "AI Tools": "text-violet-400",
  "Social Media": "text-pink-400",
  "E-commerce": "text-cyan-400",
  Finance: "text-green-400",
  "Personal Development": "text-amber-400",
  Marketing: "text-orange-400",
};

const CATEGORY_BORDERS: Record<string, string> = {
  "AI Tools": "border-violet-500/30",
  "Social Media": "border-pink-500/30",
  "E-commerce": "border-cyan-500/30",
  Finance: "border-green-500/30",
  "Personal Development": "border-amber-500/30",
  Marketing: "border-orange-500/30",
};

const CATEGORY_BG: Record<string, string> = {
  "AI Tools": "bg-violet-500/10",
  "Social Media": "bg-pink-500/10",
  "E-commerce": "bg-cyan-500/10",
  Finance: "bg-green-500/10",
  "Personal Development": "bg-amber-500/10",
  Marketing: "bg-orange-500/10",
};

// ─── Sales Page Section ───────────────────────────────────────────────────────

function SalesPageView({
  product,
  onCheckout,
}: {
  product: ProductSalesData;
  onCheckout: (includeOrderBump: boolean) => void;
}) {
  const [addBump, setAddBump] = useState(false);
  const accent = CATEGORY_ACCENTS[product.category] || "text-amber-400";
  const gradient = CATEGORY_GRADIENTS[product.category] || "from-amber-600 to-purple-700";
  const border = CATEGORY_BORDERS[product.category] || "border-amber-500/30";
  const bg = CATEGORY_BG[product.category] || "bg-amber-500/10";

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} py-16 sm:py-24`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${bg} ${accent} border ${border}`}>
            {product.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            {product.headline}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            {product.subheadline}
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Sound Familiar?
          </h2>
          <div
            className="text-slate-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-slate-300 leading-relaxed'>${renderMarkdown(product.problem)}</p>` }}
          />
        </div>
      </section>

      {/* Solution */}
      <section className="py-12 sm:py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${accent}`}>
            Here's What Changes Today
          </h2>
          <div
            className="text-slate-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-slate-300 leading-relaxed'>${renderMarkdown(product.solution)}</p>` }}
          />
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            What's Inside
          </h2>
          <div className="space-y-4">
            {product.insideItems.map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${border} ${bg} flex items-start gap-3`}
              >
                <span className={`text-lg font-bold ${accent} shrink-0 mt-0.5`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-12 sm:py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 sm:p-8 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <div
              className="text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-slate-300 leading-relaxed'>${renderMarkdown(product.guarantee)}</p>` }}
            />
          </div>
        </div>
      </section>

      {/* Tripwire Offer + Order Bump */}
      <section className="py-12 sm:py-20 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Price Section */}
          <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 sm:p-8 text-center mb-6`}>
            <div
              className="text-white leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-white leading-relaxed'>${renderMarkdown(product.tripwireSection)}</p>` }}
            />
          </div>

          {/* Order Bump */}
          {product.orderBump && product.orderBump.name && (
            <div
              className={`border-2 ${addBump ? "border-amber-400 bg-amber-500/10" : "border-slate-700 bg-slate-800/50"} rounded-xl p-5 mb-6 cursor-pointer transition-all`}
              onClick={() => setAddBump(!addBump)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    addBump
                      ? "bg-amber-400 border-amber-400"
                      : "border-slate-500"
                  }`}
                >
                  {addBump && (
                    <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">
                    Yes! Add This One-Time Offer
                  </span>
                  <span className="text-white font-bold ml-2">
                    — ${product.orderBump.price}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-sm pl-8">
                {product.orderBump.name}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={() => onCheckout(addBump)}
            className={`w-full py-4 sm:py-5 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-lg sm:text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]`}
          >
            Get Instant Access Now
          </button>

          <p className="text-center text-slate-500 text-sm mt-4">
            Secure checkout powered by Stripe. 30-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-slate-300 leading-relaxed'>${renderMarkdown(product.finalCta)}</p>` }}
          />
        </div>
      </section>
    </div>
  );
}

// ─── Upsell Page ──────────────────────────────────────────────────────────────

function UpsellView({
  product,
  onAccept,
  onDecline,
}: {
  product: ProductSalesData;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const gradient = CATEGORY_GRADIENTS[product.category] || "from-amber-600 to-purple-700";
  const accent = CATEGORY_ACCENTS[product.category] || "text-amber-400";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-6">
            <span className="animate-pulse">⚡</span>
            One-Time Upgrade Offer
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8">
          <div
            className="text-slate-300 leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-slate-300 leading-relaxed'>${renderMarkdown(product.upsell.copy)}</p>` }}
          />

          <div className="space-y-3">
            <button
              onClick={onAccept}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg`}
            >
              Yes! Upgrade Me — ${product.upsell.price}
            </button>
            <button
              onClick={onDecline}
              className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm"
            >
              No thanks, I'll stick with what I have
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Downsell Page ────────────────────────────────────────────────────────────

function DownsellView({
  product,
  onAccept,
  onDecline,
}: {
  product: ProductSalesData;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const gradient = CATEGORY_GRADIENTS[product.category] || "from-amber-600 to-purple-700";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold mb-6">
            🎁 Special Reduced Offer
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8">
          <div
            className="text-slate-300 leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: `<p class='my-3 text-slate-300 leading-relaxed'>${renderMarkdown(product.downsell.copy)}</p>` }}
          />

          <div className="space-y-3">
            <button
              onClick={onAccept}
              className={`w-full py-4 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg`}
            >
              Yes! Add This — Just ${product.downsell.price}
            </button>
            <button
              onClick={onDecline}
              className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm"
            >
              No thanks, take me to my purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Thank You Page ───────────────────────────────────────────────────────────

function ThankYouView({
  product,
  purchases,
}: {
  product: ProductSalesData;
  purchases: string[];
}) {
  const accent = CATEGORY_ACCENTS[product.category] || "text-amber-400";
  const gradient = CATEGORY_GRADIENTS[product.category] || "from-amber-600 to-purple-700";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          You're In!
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          Your purchase is confirmed. Here's what you got:
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 text-left mb-8">
          <h2 className={`text-xl font-bold ${accent} mb-4`}>Your Purchases</h2>
          <ul className="space-y-3">
            {purchases.map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <span className="text-green-400">✅</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 text-left mb-8">
          <h2 className={`text-xl font-bold ${accent} mb-4`}>What Happens Next</h2>
          <ol className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <span className={`${accent} font-bold shrink-0`}>1.</span>
              <span>Check your email for your download link and access instructions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`${accent} font-bold shrink-0`}>2.</span>
              <span>Download your materials and start implementing today.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className={`${accent} font-bold shrink-0`}>3.</span>
              <span>Join the itsdad.io community to connect with other members.</span>
            </li>
          </ol>
        </div>

        <div className="space-y-3">
          <a
            href="/affiliate-ly"
            className={`inline-block w-full py-4 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-lg hover:opacity-90 transition-all`}
          >
            Explore More Products
          </a>
          <a
            href="/memberships"
            className="inline-block w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm"
          >
            Unlock Affiliate Commissions — Join a Membership
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductSalesPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState<ProductSalesData | null>(null);
  const [step, setStep] = useState<FunnelStep>("sales");
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Resolve product from ID or slug
  useEffect(() => {
    const idStr = params.id;
    if (!idStr) return;

    const numId = parseInt(idStr, 10);
    let found: ProductSalesData | undefined;

    if (!isNaN(numId)) {
      found = getProductSalesData(numId);
    }
    if (!found) {
      found = getProductBySlug(idStr);
    }

    if (found) {
      setProduct(found);
      document.title = `${found.headline} | itsdad.io`;
      trackPageView(`/product/${found.id}`);
    } else {
      setError("Product not found");
    }
  }, [params.id]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // ─── Checkout Flow ────────────────────────────────────────────────────────

  const handleTripwireCheckout = useCallback(
    async (includeOrderBump: boolean) => {
      if (!product) return;
      setLoading(true);
      setError(null);

      try {
        const refCode = getRefCode();

        // Track click
        await fetch("/api/products/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            referralCode: refCode || undefined,
          }),
        }).catch(() => {}); // non-blocking

        trackEvent("begin_checkout", {
          product_id: product.id,
          product_name: product.name,
          include_order_bump: includeOrderBump,
        });

        // Create checkout session
        const res = await fetch("/api/products/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            referralCode: refCode || undefined,
            includeOrderBump,
            funnelType: "tripwire",
          }),
        });

        const data = await res.json();

        if (data.url) {
          // Redirect to Stripe
          window.location.href = data.url;
        } else {
          // If no Stripe redirect, proceed to upsell flow locally
          const items = [product.name];
          if (includeOrderBump && product.orderBump?.name) {
            items.push(product.orderBump.name);
          }
          setPurchases(items);
          setStep("upsell");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error("[ProductSalesPage] Checkout error:", err);
      } finally {
        setLoading(false);
      }
    },
    [product]
  );

  const handleUpsellAccept = useCallback(async () => {
    if (!product) return;
    setLoading(true);

    trackEvent("upsell_accepted", {
      product_id: product.id,
      upsell_name: product.upsell.name,
      upsell_price: product.upsell.price,
    });

    try {
      const refCode = getRefCode();
      const res = await fetch("/api/products/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          referralCode: refCode || undefined,
          funnelType: "upsell",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPurchases((prev) => [...prev, product.upsell.name]);
        setStep("thank-you");
      }
    } catch {
      setPurchases((prev) => [...prev, product.upsell.name]);
      setStep("thank-you");
    } finally {
      setLoading(false);
    }
  }, [product]);

  const handleUpsellDecline = useCallback(() => {
    if (!product) return;
    trackEvent("upsell_declined", {
      product_id: product.id,
    });
    setStep("downsell");
  }, [product]);

  const handleDownsellAccept = useCallback(async () => {
    if (!product) return;
    setLoading(true);

    trackEvent("downsell_accepted", {
      product_id: product.id,
      downsell_name: product.downsell.name,
      downsell_price: product.downsell.price,
    });

    try {
      const refCode = getRefCode();
      const res = await fetch("/api/products/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          referralCode: refCode || undefined,
          funnelType: "downsell",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPurchases((prev) => [...prev, product.downsell.name]);
        setStep("thank-you");
      }
    } catch {
      setPurchases((prev) => [...prev, product.downsell.name]);
      setStep("thank-you");
    } finally {
      setLoading(false);
    }
  }, [product]);

  const handleDownsellDecline = useCallback(() => {
    trackEvent("downsell_declined", {
      product_id: product?.id,
    });
    setStep("thank-you");
  }, [product]);

  // ─── Loading / Error States ───────────────────────────────────────────────

  if (error === "Product not found") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-slate-400 mb-6">This product doesn't exist or has been removed.</p>
          <a
            href="/affiliate-ly"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
          >
            Browse All Products
          </a>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading product...</div>
      </div>
    );
  }

  // ─── Loading Overlay ──────────────────────────────────────────────────────

  const loadingOverlay = loading && (
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold">Processing...</p>
      </div>
    </div>
  );

  // ─── Render Current Step ──────────────────────────────────────────────────

  return (
    <>
      {loadingOverlay}
      {error && error !== "Product not found" && (
        <div className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-500 text-white px-4 py-3 rounded-xl shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-3 text-red-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {step === "sales" && (
        <SalesPageView product={product} onCheckout={handleTripwireCheckout} />
      )}
      {step === "upsell" && (
        <UpsellView
          product={product}
          onAccept={handleUpsellAccept}
          onDecline={handleUpsellDecline}
        />
      )}
      {step === "downsell" && (
        <DownsellView
          product={product}
          onAccept={handleDownsellAccept}
          onDecline={handleDownsellDecline}
        />
      )}
      {step === "thank-you" && (
        <ThankYouView product={product} purchases={purchases} />
      )}
    </>
  );
}
