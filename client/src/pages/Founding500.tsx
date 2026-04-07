/**
 * Founding500.tsx
 *
 * itsdad.io — Founding 500 Code Distribution Landing Page
 *
 * A high-conversion landing page where visitors enter their email
 * to receive a Founding 500 promo code (50% off first 3 months).
 * Codes are distributed automatically via the /api/founding500/request endpoint.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";

interface CodeResponse {
  success: boolean;
  code: string | null;
  message: string;
  alreadyIssued?: boolean;
  codesRemaining?: number;
}

export default function Founding500() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "sold-out">("idle");
  const [code, setCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [codesRemaining, setCodesRemaining] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch code availability on mount
  useEffect(() => {
    fetch("/api/founding500/status")
      .then((r) => r.json())
      .then((data) => {
        setCodesRemaining(data.remaining ?? null);
        if (data.remaining === 0) setStatus("sold-out");
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/founding500/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data: CodeResponse = await res.json();

      if (data.success && data.code) {
        setCode(data.code);
        setMessage(data.message);
        setStatus("success");
        if (data.codesRemaining !== undefined) {
          setCodesRemaining(data.codesRemaining);
        }
      } else if (!data.success) {
        setStatus("sold-out");
        setMessage(data.message);
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-purple-600/5 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {codesRemaining !== null
                ? `${codesRemaining} of 488 codes remaining`
                : "Limited Availability"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight mb-6">
            Join the{" "}
            <span className="bg-gradient-to-r from-amber-400 to-purple-500 bg-clip-text text-transparent">
              Founding 500
            </span>
          </h1>

          <p className="text-xl text-slate-300 text-center max-w-2xl mx-auto mb-4 leading-relaxed">
            Get <strong className="text-white">50% off your first 3 months</strong> inside
            Affiliation Nation. The full course, 51 digital products, and a community
            that has your back.
          </p>

          <p className="text-slate-400 text-center text-sm mb-10">
            Everyone is welcome to join. But only 500 people get the Founding 500 discount.
          </p>

          {/* ─── Form / Success / Sold Out ─── */}
          <div className="max-w-md mx-auto">
            {status === "success" && code ? (
              /* ── Success State ── */
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-purple-600/10 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2">You're In!</h2>
                <p className="text-slate-300 mb-6">Your Founding 500 code:</p>

                {/* Code display */}
                <div className="bg-slate-800 border border-amber-500/40 rounded-xl px-6 py-4 mb-6 inline-block">
                  <span className="text-3xl font-mono font-bold text-amber-400 tracking-wider">
                    {code}
                  </span>
                </div>

                <div className="space-y-3 text-left text-sm text-slate-300 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">1.</span>
                    <span>
                      Go to{" "}
                      <Link href="/memberships" className="text-amber-400 underline hover:text-amber-300">
                        Memberships
                      </Link>{" "}
                      and choose your plan
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">2.</span>
                    <span>Click "Activate" to go to checkout</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">3.</span>
                    <span>
                      Enter code <strong className="text-amber-400">{code}</strong> in the
                      promotion code field
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold mt-0.5">4.</span>
                    <span>Enjoy 50% off your first 3 months!</span>
                  </div>
                </div>

                <Link
                  href="/memberships"
                  className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Choose Your Plan Now
                </Link>

                <p className="text-slate-500 text-xs mt-4">
                  Card required at checkout. Cancel anytime.
                </p>
              </div>
            ) : status === "sold-out" ? (
              /* ── Sold Out State ── */
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">All 500 Codes Claimed!</h2>
                <p className="text-slate-300 mb-6">
                  The Founding 500 codes are all gone. But you can still join Affiliation Nation
                  at full price — the community, course, and 51 products are absolutely worth it.
                </p>
                <Link
                  href="/memberships"
                  className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Join at Full Price
                </Link>
              </div>
            ) : (
              /* ── Form State ── */
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 bg-slate-800/50 p-8"
              >
                <h2 className="text-xl font-bold text-center mb-6">
                  Claim Your Founding 500 Code
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="f500-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="f500-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="What should we call you?"
                      className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-amber-500/50 outline-none placeholder:text-slate-500 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="f500-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Your Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="f500-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-amber-500/50 outline-none placeholder:text-slate-500 text-sm"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-sm text-center mb-4">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Getting Your Code...
                    </span>
                  ) : (
                    "Get My Founding 500 Code"
                  )}
                </button>

                <p className="text-slate-500 text-xs text-center mt-4">
                  50% off first 3 months. Card required at checkout. Cancel anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          What You Get as a Founding Member
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              title: "Affiliated Degree",
              desc: "8-module self-paced course that teaches you affiliate marketing from scratch. Complete it and earn your Affiliated Degree.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
              title: "51 Digital Products",
              desc: "A full product catalog with done-for-you sales funnels. Pick one or promote all 51 — your choice.",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: "Community Support",
              desc: "Join Affiliation Nation on Skool. Get help, share wins, and connect with other members who have your back.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-slate-800/50 p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/20 to-purple-600/20 flex items-center justify-center text-amber-400">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-purple-600/5 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">With Your Founding 500 Code</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div>
              <p className="text-slate-400 text-sm">Starter Pack</p>
              <p className="text-slate-500 line-through text-lg">$7/mo</p>
              <p className="text-amber-400 font-bold text-2xl">$3.50/mo</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Builder Club</p>
              <p className="text-slate-500 line-through text-lg">$19/mo</p>
              <p className="text-amber-400 font-bold text-2xl">$9.50/mo</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Pro Creator Club</p>
              <p className="text-slate-500 line-through text-lg">$49.99/mo</p>
              <p className="text-amber-400 font-bold text-2xl">$25/mo</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Inner Circle</p>
              <p className="text-slate-500 line-through text-lg">$99.99/mo</p>
              <p className="text-amber-400 font-bold text-2xl">$50/mo</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            50% off for your first 3 months. Then regular price. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} itsdad.io. All rights reserved.{" "}
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>{" "}
            &middot;{" "}
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
