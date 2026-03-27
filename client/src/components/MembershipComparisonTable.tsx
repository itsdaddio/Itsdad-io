/**
 * MembershipComparisonTable.tsx
 *
 * Full feature comparison table across all itsdad.io membership tiers.
 * Updated to match locked core configuration (4 tiers).
 */

import { Check, X, Minus, Info } from "lucide-react";

type FeatureValue = boolean | string | "partial";

interface ComparisonFeature {
  category: string;
  label: string;
  starter: FeatureValue;
  builder: FeatureValue;
  pro: FeatureValue;
  inner: FeatureValue;
}

const FEATURES: ComparisonFeature[] = [
  // Products
  { category: "Products", label: "Curated Affiliate Products", starter: "1 product", builder: "Multiple products", pro: "All 51 products", inner: "All 51 products" },
  { category: "Products", label: "Done-for-You Swipe Files", starter: true, builder: true, pro: true, inner: true },
  { category: "Products", label: "Content Rotation Engine", starter: false, builder: true, pro: true, inner: true },
  { category: "Products", label: "Automation Frameworks", starter: false, builder: false, pro: true, inner: true },
  { category: "Products", label: "Complete Funnel System", starter: false, builder: false, pro: true, inner: true },

  // Course
  { category: "Course", label: "First Dollar System™", starter: true, builder: true, pro: true, inner: true },
  { category: "Course", label: "Viral Script (copy-and-post ready)", starter: "1 script", builder: "Multiple", pro: "Full library", inner: "Full library" },
  { category: "Course", label: "Step-by-Step Posting Instructions", starter: true, builder: true, pro: true, inner: true },
  { category: "Course", label: "Daily Content Prompts", starter: false, builder: true, pro: true, inner: true },
  { category: "Course", label: "Content Scaling Systems", starter: false, builder: false, pro: true, inner: true },

  // Strategy
  { category: "Strategy", label: "Immediate Action Onboarding", starter: true, builder: true, pro: true, inner: true },
  { category: "Strategy", label: "Scaling Method", starter: false, builder: true, pro: true, inner: true },
  { category: "Strategy", label: "Priority Execution Path", starter: false, builder: true, pro: true, inner: true },
  { category: "Strategy", label: "Funnel Strategies", starter: false, builder: false, pro: true, inner: true },
  { category: "Strategy", label: "Performance Optimization Tools", starter: false, builder: false, pro: true, inner: true },
  { category: "Strategy", label: "Advanced Monetization Systems", starter: false, builder: false, pro: false, inner: true },
  { category: "Strategy", label: "Strategy Drops & System Updates", starter: false, builder: false, pro: false, inner: true },
  { category: "Strategy", label: "Early Access Tools & Features", starter: false, builder: false, pro: false, inner: true },
  { category: "Strategy", label: "High-Level Income Expansion Methods", starter: false, builder: false, pro: false, inner: true },
];

const CATEGORIES = [...new Set(FEATURES.map((f) => f.category))];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) return <Check className="w-5 h-5 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-slate-600 mx-auto" />;
  if (value === "partial") return <Minus className="w-4 h-4 text-amber-400 mx-auto" />;
  return <span className="text-xs text-amber-400 font-medium">{value}</span>;
}

export function MembershipComparisonTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-sm">
        {/* Header */}
        <thead>
          <tr>
            <th className="text-left py-4 px-4 text-muted-foreground font-medium w-1/3">Feature</th>
            <th className="text-center py-4 px-3 text-foreground font-bold">Starter Pack<br /><span className="text-amber-400 font-normal text-xs">$7/mo</span></th>
            <th className="text-center py-4 px-3 text-foreground font-bold bg-amber-500/5 border-x border-amber-500/20">Builder Club<br /><span className="text-amber-400 font-normal text-xs">$19/mo</span></th>
            <th className="text-center py-4 px-3 text-foreground font-bold">Pro Club<br /><span className="text-amber-400 font-normal text-xs">$49.99/mo</span></th>
            <th className="text-center py-4 px-3 text-foreground font-bold">Inner Circle Club<br /><span className="text-amber-400 font-normal text-xs">$99.99/mo</span></th>
          </tr>
        </thead>

        <tbody>
          {CATEGORIES.map((category) => (
            <>
              {/* Category row */}
              <tr key={`cat-${category}`}>
                <td
                  colSpan={5}
                  className="py-2 px-4 text-xs font-semibold uppercase tracking-widest text-purple-400 bg-purple-500/5 border-t border-b border-purple-500/10"
                >
                  {category}
                </td>
              </tr>

              {/* Feature rows */}
              {FEATURES.filter((f) => f.category === category).map((feature, i) => (
                <tr
                  key={`${category}-${i}`}
                  className="border-b border-border/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 text-muted-foreground">{feature.label}</td>
                  <td className="py-3 px-3 text-center"><FeatureCell value={feature.starter} /></td>
                  <td className="py-3 px-3 text-center bg-amber-500/5 border-x border-amber-500/10"><FeatureCell value={feature.builder} /></td>
                  <td className="py-3 px-3 text-center"><FeatureCell value={feature.pro} /></td>
                  <td className="py-3 px-3 text-center"><FeatureCell value={feature.inner} /></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      <p className="mt-5 text-xs text-muted-foreground flex items-start gap-1.5 px-1">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
        <span>
          Earnings are not guaranteed and depend on individual promotional activity and market conditions.
          itsdad.io is not a multi-level marketing program. Second-tier commissions apply only to Inner Circle Club members
          and are calculated on direct referral earnings, not on membership fees.
        </span>
      </p>
    </div>
  );
}
