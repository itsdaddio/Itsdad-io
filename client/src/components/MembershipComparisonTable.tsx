/**
 * MembershipComparisonTable.tsx
 *
 * Full feature comparison table across all Its Dad LLC membership tiers.
 *
 * MANIFEST PATCH (item 14):
 *   - Replaced coaching/support features with self-serve alternatives
 *   - Added commission disclaimer (line 288 equivalent)
 */

import { Check, X, Minus, Info } from "lucide-react";

type FeatureValue = boolean | string | "partial";

interface ComparisonFeature {
  category: string;
  label: string;
  boss: FeatureValue;
  chief: FeatureValue;
  kingpin: FeatureValue;
}

const FEATURES: ComparisonFeature[] = [
  // Products
  { category: "Products", label: "Curated Affiliate Products", boss: "10 products", chief: "30 products", kingpin: "All 51 products" },
  { category: "Products", label: "Done-for-You Swipe Files", boss: true, chief: true, kingpin: true },
  { category: "Products", label: "Advanced Email Swipe Library", boss: false, chief: true, kingpin: true },
  { category: "Products", label: "Done-for-You Sales Page Templates", boss: false, chief: true, kingpin: true },
  { category: "Products", label: "Complete Funnel System", boss: false, chief: false, kingpin: true },

  // Course
  { category: "Course", label: "Affiliated Degree — Module Access", boss: "Modules 1–3", chief: "Modules 1–6", kingpin: "All 8 Modules" },
  // MANIFEST PATCH: Replaced "Live Group Coaching Calls" with self-serve alternative
  { category: "Course", label: "Pre-Recorded Video Library (24/7)", boss: "partial", chief: true, kingpin: true },
  // MANIFEST PATCH: Replaced "1-on-1 Coaching Sessions" with self-serve alternative
  { category: "Course", label: "40,000 ChatGPT Prompt Vault", boss: true, chief: true, kingpin: true },
  { category: "Course", label: "Final Assessment + Degree Certificate", boss: false, chief: "partial", kingpin: true },

  // Commissions
  { category: "Commissions", label: "Personal Affiliate Referral Link", boss: true, chief: true, kingpin: true },
  { category: "Commissions", label: "Referral Commission Rate", boss: "30%", chief: "35%", kingpin: "40%" },
  { category: "Commissions", label: "Second-Tier Referral Commission", boss: false, chief: false, kingpin: "6.7%" },
  { category: "Commissions", label: "Automated Commission Tracking", boss: true, chief: true, kingpin: true },
  { category: "Commissions", label: "Priority Commission Processing", boss: false, chief: true, kingpin: true },

  // Support
  // MANIFEST PATCH: Replaced "Direct Line to Dad" with self-serve alternative
  { category: "Support", label: "Prompt Vault Self-Serve Support (24/7)", boss: true, chief: true, kingpin: true },
  // MANIFEST PATCH: Replaced "Monthly Strategy Call" with self-serve alternative
  { category: "Support", label: "Strategy Blueprint Library", boss: false, chief: true, kingpin: true },
  { category: "Support", label: "Automated Earnings & Analytics Reports", boss: false, chief: "partial", kingpin: true },
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
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {/* Header */}
        <thead>
          <tr>
            <th className="text-left py-4 px-4 text-muted-foreground font-medium w-1/2">Feature</th>
            <th className="text-center py-4 px-3 text-foreground font-bold">Boss<br /><span className="text-amber-400 font-normal text-xs">$9.99/mo</span></th>
            <th className="text-center py-4 px-3 text-foreground font-bold bg-amber-500/5 border-x border-amber-500/20">Chief<br /><span className="text-amber-400 font-normal text-xs">$19.99/mo</span></th>
            <th className="text-center py-4 px-3 text-foreground font-bold">Kingpin<br /><span className="text-amber-400 font-normal text-xs">$24.99/mo</span></th>
          </tr>
        </thead>

        <tbody>
          {CATEGORIES.map((category) => (
            <>
              {/* Category row */}
              <tr key={`cat-${category}`}>
                <td
                  colSpan={4}
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
                  <td className="py-3 px-3 text-center"><FeatureCell value={feature.boss} /></td>
                  <td className="py-3 px-3 text-center bg-amber-500/5 border-x border-amber-500/10"><FeatureCell value={feature.chief} /></td>
                  <td className="py-3 px-3 text-center"><FeatureCell value={feature.kingpin} /></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      {/* MANIFEST PATCH: Commission disclaimer (line 288 equivalent) */}
      <p className="mt-5 text-xs text-muted-foreground flex items-start gap-1.5 px-1">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-500" />
        <span>
          Commission percentages apply to product sales generated through your personal affiliate referral link.
          Earnings are not guaranteed and depend on individual promotional activity and market conditions.
          Its Dad LLC is not a multi-level marketing program. Second-tier commissions apply only to Kingpin members
          and are calculated on direct referral earnings, not on membership fees.
        </span>
      </p>
    </div>
  );
}
