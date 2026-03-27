/**
 * BlueprintEmailCapture.tsx
 *
 * Email capture form offering a free affiliate roadmap download.
 * First Dollar Priority: This is the primary conversion step.
 * Funnel: Start Here → Free Roadmap → Starter Pack ($7) → Builder Club ($19)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Check, Loader2, Zap, BarChart2, BookOpen, Map } from "lucide-react";

const ROADMAP_BENEFITS = [
  {
    icon: <Map className="w-4 h-4 text-amber-400" />,
    label: "Step-by-Step Roadmap — Exactly What to Do First",
  },
  {
    icon: <Zap className="w-4 h-4 text-emerald-400" />,
    label: "First Dollar Framework — One Product, One Script, One Platform",
  },
  {
    icon: <BarChart2 className="w-4 h-4 text-purple-400" />,
    label: "Commission Calculator — Know Your Earning Potential",
  },
  {
    icon: <BookOpen className="w-4 h-4 text-blue-400" />,
    label: "First-Sale-in-7-Days Plan — Clear Daily Actions",
  },
];

export function BlueprintEmailCapture() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/email/blueprint-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900/80 to-purple-950/50 p-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <Download className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg leading-tight">
            Free Affiliate Roadmap
          </h3>
          <p className="text-xs text-muted-foreground">Instant download — no credit card needed</p>
        </div>
      </div>

      {/* Benefits */}
      <ul className="space-y-2.5 mb-6">
        {ROADMAP_BENEFITS.map((b, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            {b.icon}
            {b.label}
          </li>
        ))}
      </ul>

      {/* Form */}
      {status === "success" ? (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-400 font-medium">
            Roadmap sent! Check your inbox — it should arrive within 2 minutes.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="First name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-800/60 border-border focus:border-amber-500/50"
          />
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-800/60 border-border focus:border-amber-500/50"
          />

          {errorMsg && (
            <p className="text-xs text-red-400">{errorMsg}</p>
          )}

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full btn-gold-gradient gold-shimmer hover:scale-105 transition-transform h-auto py-3 rounded-xl font-semibold"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Roadmap…
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Send Me the Free Roadmap
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. Your email is never sold.
          </p>
        </form>
      )}
    </div>
  );
}
