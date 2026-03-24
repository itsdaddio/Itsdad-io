/**
 * client/src/pages/Alliance.tsx
 *
 * itsdad.io — Alliance Referral Page
 *
 * The member-facing page for the Alliance referral system.
 * Shows the Challenge a Friend button, referral link, stats, and commission history.
 *
 * Route: /alliance
 */

import AllianceDashboard from "@/components/AllianceDashboard";

export default function Alliance() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            🤝 The Alliance
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            When They Eat, You Eat.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Bring someone to the table and your next month is on us. 
            Plus, earn a 6.7% override on every commission they make — forever.
          </p>
        </div>

        {/* Alliance Dashboard */}
        <AllianceDashboard />

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Questions? Reach out at{" "}
            <a
              href="mailto:itsdad@itsdad.io"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              itsdad@itsdad.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
