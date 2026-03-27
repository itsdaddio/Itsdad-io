/**
 * client/src/pages/CoursePage.tsx
 *
 * itsdad.io — Affiliated Degree Course Page
 *
 * 8-module affiliate marketing course that members progress through
 * to earn their "Affiliated Degree" certification.
 *
 * Route: /course
 */
import { useState, useEffect } from "react";
import { trackPageView, trackEvent } from "@/lib/analytics";

// ─── Module Data ──────────────────────────────────────────────────────────────

interface CourseModule {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: string[];
  duration: string;
  icon: string;
}

const MODULES: CourseModule[] = [
  {
    id: 1,
    title: "Foundation",
    subtitle: "Understanding Affiliate Marketing",
    description:
      "Learn what affiliate marketing really is, how the commission structure works, and why itsdad.io gives you an unfair advantage with 51 done-for-you products.",
    lessons: [
      "What Is Affiliate Marketing (And Why It Works)",
      "The itsdad.io Ecosystem Explained",
      "Understanding Commission Tiers (30%–40%)",
      "Your First 24 Hours: Setting Up Your Account",
      "The Affiliate Mindset: Patience + Consistency = Profit",
    ],
    duration: "45 min",
    icon: "🏗️",
  },
  {
    id: 2,
    title: "Product Mastery",
    subtitle: "Know What You're Selling",
    description:
      "Deep dive into the 51-product catalog. Learn how to match the right product to the right audience, and why the $7 tripwire model converts better than high-ticket cold offers.",
    lessons: [
      "The 6 Product Categories Explained",
      "How the $7 Tripwire Funnel Works",
      "Order Bumps, Upsells & Downsells: Maximizing Cart Value",
      "Choosing Your First 3 Products to Promote",
      "Creating Your Product Recommendation Strategy",
    ],
    duration: "1 hr",
    icon: "📦",
  },
  {
    id: 3,
    title: "Link Building",
    subtitle: "Your Affiliate Links & Tracking",
    description:
      "Master the technical side: generating affiliate links, understanding click tracking, and reading your earnings dashboard to optimize performance.",
    lessons: [
      "Generating Your Unique Affiliate Links",
      "How Click Tracking & Attribution Works",
      "Reading Your Earnings Dashboard",
      "UTM Parameters & Advanced Tracking",
      "Common Link Mistakes (And How to Avoid Them)",
    ],
    duration: "30 min",
    icon: "🔗",
  },
  {
    id: 4,
    title: "Content Creation",
    subtitle: "Creating Content That Converts",
    description:
      "Learn how to create compelling content across social media, email, and blogs that naturally drives clicks to your affiliate links without being pushy or salesy.",
    lessons: [
      "The AIDA Framework for Affiliate Content",
      "Writing Social Media Posts That Get Clicks",
      "Creating Short-Form Video Content (Reels, TikTok, Shorts)",
      "Email Marketing for Affiliates",
      "Blog Posts & SEO Content That Ranks",
      "Using AI Tools to 10x Your Content Output",
    ],
    duration: "1.5 hrs",
    icon: "✍️",
  },
  {
    id: 5,
    title: "Traffic Generation",
    subtitle: "Getting Eyes on Your Links",
    description:
      "Discover free and paid traffic strategies to drive targeted visitors to your affiliate links. From organic social media to paid ads, learn what works in 2025.",
    lessons: [
      "Free Traffic: Social Media Organic Strategies",
      "Pinterest SEO for Passive Traffic",
      "YouTube & TikTok: Video Traffic Machines",
      "Facebook Groups & Community Marketing",
      "Introduction to Paid Ads ($5/day Budget)",
      "Building an Email List for Long-Term Revenue",
    ],
    duration: "2 hrs",
    icon: "🚀",
  },
  {
    id: 6,
    title: "Conversion Optimization",
    subtitle: "Turning Clicks Into Sales",
    description:
      "Learn the psychology of buying decisions and how to optimize every step of the funnel from click to purchase to maximize your commission earnings.",
    lessons: [
      "Understanding Buyer Psychology",
      "Pre-Selling: Warming Up Cold Traffic",
      "Landing Page Best Practices",
      "A/B Testing Your Approach",
      "Retargeting & Follow-Up Strategies",
      "Analyzing What's Working (And What's Not)",
    ],
    duration: "1.5 hrs",
    icon: "💰",
  },
  {
    id: 7,
    title: "Scaling",
    subtitle: "Growing Your Affiliate Business",
    description:
      "Once you've made your first sales, learn how to scale from side income to full-time revenue using automation, team building, and advanced strategies.",
    lessons: [
      "From Side Hustle to Full-Time: The Transition Plan",
      "Automating Your Content Pipeline",
      "Building a Team (Virtual Assistants & Contractors)",
      "Diversifying Across Multiple Products",
      "Second-Tier Commissions: Building Your Network",
      "Advanced: Creating Your Own Funnels",
    ],
    duration: "2 hrs",
    icon: "📈",
  },
  {
    id: 8,
    title: "Graduation",
    subtitle: "Earning Your Affiliated Degree",
    description:
      "Complete your final project, demonstrate your affiliate marketing skills, and earn your official Affiliated Degree certification from itsdad.io.",
    lessons: [
      "Final Project: Launch a Complete Campaign",
      "Portfolio Review: Documenting Your Journey",
      "Peer Review & Community Feedback",
      "Certification Assessment",
      "Your Affiliated Degree: What Comes Next",
      "Alumni Network & Ongoing Support",
    ],
    duration: "1 hr",
    icon: "🎓",
  },
];

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({
  module,
  isExpanded,
  onToggle,
}: {
  module: CourseModule;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isLocked = module.id > 1; // Only Module 1 is unlocked for now

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isExpanded
          ? "border-amber-500/40 bg-slate-800/80 shadow-lg shadow-amber-500/5"
          : "border-white/10 bg-slate-800/40 hover:border-white/20"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
      >
        <div className="text-3xl shrink-0 mt-1">{module.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Module {module.id}
            </span>
            {isLocked && (
              <span className="text-slate-500 text-xs">🔒 Coming Soon</span>
            )}
            <span className="text-slate-500 text-xs ml-auto">{module.duration}</span>
          </div>
          <h3 className="text-white font-bold text-lg">{module.title}</h3>
          <p className="text-slate-400 text-sm">{module.subtitle}</p>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 shrink-0 mt-2 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {module.description}
          </p>
          <div className="space-y-2">
            {module.lessons.map((lesson, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isLocked
                    ? "bg-slate-700 text-slate-500"
                    : "bg-amber-500/20 text-amber-400"
                }`}>
                  {i + 1}
                </span>
                <span className={isLocked ? "text-slate-500" : "text-slate-300"}>
                  {lesson}
                </span>
              </div>
            ))}
          </div>

          {!isLocked && (
            <button className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all">
              Start Module {module.id}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CoursePage() {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  useEffect(() => {
    document.title = "Affiliated Degree Course | itsdad.io";
    trackPageView("/course", "Affiliated Degree Course");
  }, []);

  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalHours = "10+";

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-purple-700 to-slate-900 py-16 sm:py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            The Affiliated Degree
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            The only affiliate marketing course that gives you the products, the training,
            and the community to actually succeed. Complete all 8 modules and earn your
            Affiliated Degree certification.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-2xl">8</span>
              <span className="text-sm">Modules</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-2xl">{totalLessons}</span>
              <span className="text-sm">Lessons</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-2xl">{totalHours}</span>
              <span className="text-sm">Hours</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-2xl">51</span>
              <span className="text-sm">Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            Your Path to Affiliate Success
          </h2>
          <p className="text-slate-400 text-center mb-10 max-w-xl mx-auto">
            Each module builds on the last. By the time you graduate, you'll have a
            fully operational affiliate marketing business generating real commissions.
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">Your Progress</span>
              <span className="text-amber-400 font-bold">Module 1 of 8</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-600 transition-all duration-500"
                style={{ width: "12.5%" }}
              />
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-3">
            {MODULES.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                isExpanded={expandedModule === module.id}
                onToggle={() =>
                  setExpandedModule(expandedModule === module.id ? null : module.id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-12 sm:py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            What's Included With Your Membership
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "📚", title: "8 Complete Modules", desc: "Step-by-step curriculum from beginner to certified affiliate" },
              { icon: "📦", title: "51 Done-For-You Products", desc: "Pre-built sales funnels with tripwire, upsell, and downsell" },
              { icon: "🔗", title: "Unique Affiliate Links", desc: "Track every click and commission in your personal dashboard" },
              { icon: "💰", title: "30–40% Commissions", desc: "Earn on every sale through your links — tier-based rates" },
              { icon: "🤝", title: "Community Access", desc: "Connect with other affiliates, share wins, and get support" },
              { icon: "🎓", title: "Affiliated Degree", desc: "Official certification upon completing all 8 modules" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-white/10 bg-slate-800/40 text-left"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-slate-400 mb-8">
            Join a membership tier to unlock the full course, all 51 products,
            and your path to the Affiliated Degree.
          </p>
          <a
            href="/memberships"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg"
          >
            View Membership Plans
          </a>
          <p className="text-slate-500 text-sm mt-4">
            Starting at $7/month. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
