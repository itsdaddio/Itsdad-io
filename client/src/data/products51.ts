/**
 * client/src/data/products51.ts
 *
 * The 51 curated affiliate products available in the itsdad.io portal.
 * Each product includes: id, name, category, tripwire price, and commission rate.
 *
 * Products span 6 broad categories:
 *   AI Tools · Social Media · E-commerce · Finance · Personal Development · Marketing
 */

export interface Product {
  id: number;
  name: string;
  category: string;
  tripwire: number;   // Entry-level price shown publicly ($)
  commission: number; // Commission percentage (30–40%)
  description?: string;
}

export interface ProductCategory {
  name: string;
  description: string;
  count: number;
}

// ─── Product Categories ───────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: "AI Tools",
    description: "High-demand AI and automation products for content creators and marketers",
    count: 10,
  },
  {
    name: "Social Media",
    description: "Traffic, content, and growth tools for every major platform",
    count: 8,
  },
  {
    name: "E-commerce",
    description: "Digital product creation, dropshipping, and online store systems",
    count: 8,
  },
  {
    name: "Finance",
    description: "Investing, crypto, real estate, and passive income education",
    count: 8,
  },
  {
    name: "Personal Development",
    description: "Productivity, health, mindset, and lifestyle improvement systems",
    count: 9,
  },
  {
    name: "Marketing",
    description: "Email, SEO, funnels, copywriting, and agency-building courses",
    count: 8,
  },
];

// ─── 51 Products ──────────────────────────────────────────────────────────────

export const PRODUCTS_51: Product[] = [
  // ── AI Tools (1–10) ────────────────────────────────────────────────────────
  {
    id: 1,
    name: "AI Content Engine Pro",
    category: "AI Tools",
    tripwire: 7,
    commission: 40,
    description: "Done-for-you AI content system with 500+ proven prompts for blogs, ads, and emails.",
  },
  {
    id: 2,
    name: "ChatGPT Prompt Vault (40K)",
    category: "AI Tools",
    tripwire: 7,
    commission: 40,
    description: "40,000 categorized ChatGPT prompts for every niche and use case.",
  },
  {
    id: 3,
    name: "AI Video Script Generator",
    category: "AI Tools",
    tripwire: 7,
    commission: 35,
    description: "Generate high-converting video scripts in minutes using AI.",
  },
  {
    id: 4,
    name: "Midjourney Mastery Course",
    category: "AI Tools",
    tripwire: 7,
    commission: 40,
    description: "Complete guide to creating stunning AI art and selling it online.",
  },
  {
    id: 5,
    name: "AI Email Copywriter",
    category: "AI Tools",
    tripwire: 7,
    commission: 35,
    description: "AI-powered email sequences that convert — plug-and-play templates.",
  },
  {
    id: 6,
    name: "Automation Blueprint",
    category: "AI Tools",
    tripwire: 7,
    commission: 40,
    description: "Build automated business workflows using Zapier, Make, and AI.",
  },
  {
    id: 7,
    name: "AI SEO Dominator",
    category: "AI Tools",
    tripwire: 7,
    commission: 35,
    description: "Use AI to rank content faster and outpace manual SEO methods.",
  },
  {
    id: 8,
    name: "Voice Clone & Podcast AI",
    category: "AI Tools",
    tripwire: 7,
    commission: 40,
    description: "Create podcast-quality audio content using AI voice cloning tools.",
  },
  {
    id: 9,
    name: "AI Business Plan Generator",
    category: "AI Tools",
    tripwire: 7,
    commission: 35,
    description: "Generate investor-ready business plans in under 10 minutes.",
  },
  {
    id: 10,
    name: "AI Side Hustle Starter Kit",
    category: "AI Tools",
    tripwire: 7,
    commission: 40,
    description: "5 proven AI-powered side hustles with step-by-step launch guides.",
  },

  // ── Social Media (11–18) ───────────────────────────────────────────────────
  {
    id: 11,
    name: "Viral Reels Formula",
    category: "Social Media",
    tripwire: 7,
    commission: 40,
    description: "The exact framework behind 10M+ view Reels — replicate it in any niche.",
  },
  {
    id: 12,
    name: "TikTok Affiliate Playbook",
    category: "Social Media",
    tripwire: 7,
    commission: 35,
    description: "Monetize TikTok with affiliate links — no dancing required.",
  },
  {
    id: 13,
    name: "YouTube Shorts Cash System",
    category: "Social Media",
    tripwire: 7,
    commission: 40,
    description: "Build a faceless YouTube Shorts channel that earns on autopilot.",
  },
  {
    id: 14,
    name: "Pinterest Traffic Machine",
    category: "Social Media",
    tripwire: 7,
    commission: 35,
    description: "Drive 50K+ monthly visitors using Pinterest SEO and pin strategies.",
  },
  {
    id: 15,
    name: "Instagram Growth Accelerator",
    category: "Social Media",
    tripwire: 7,
    commission: 40,
    description: "0 to 10K followers in 90 days with a done-for-you content calendar.",
  },
  {
    id: 16,
    name: "Twitter/X Monetization Blueprint",
    category: "Social Media",
    tripwire: 7,
    commission: 35,
    description: "Turn tweets into income with affiliate links, newsletters, and digital products.",
  },
  {
    id: 17,
    name: "LinkedIn Lead Generation System",
    category: "Social Media",
    tripwire: 7,
    commission: 40,
    description: "B2B lead generation on LinkedIn — automated outreach that converts.",
  },
  {
    id: 18,
    name: "Content Repurposing Engine",
    category: "Social Media",
    tripwire: 7,
    commission: 35,
    description: "Turn one piece of content into 30+ posts across every platform.",
  },

  // ── E-commerce (19–26) ─────────────────────────────────────────────────────
  {
    id: 19,
    name: "Digital Product Empire",
    category: "E-commerce",
    tripwire: 7,
    commission: 40,
    description: "Create and sell digital products with zero inventory — full system included.",
  },
  {
    id: 20,
    name: "Etsy Passive Income Blueprint",
    category: "E-commerce",
    tripwire: 7,
    commission: 35,
    description: "Build a profitable Etsy shop selling digital downloads on autopilot.",
  },
  {
    id: 21,
    name: "Dropshipping Accelerator",
    category: "E-commerce",
    tripwire: 7,
    commission: 40,
    description: "Launch a Shopify dropshipping store with winning products pre-researched.",
  },
  {
    id: 22,
    name: "Amazon FBA Fast Track",
    category: "E-commerce",
    tripwire: 7,
    commission: 35,
    description: "From product research to first sale on Amazon in 30 days.",
  },
  {
    id: 23,
    name: "Print-on-Demand Profit System",
    category: "E-commerce",
    tripwire: 7,
    commission: 40,
    description: "Design, list, and sell custom merch with zero upfront cost.",
  },
  {
    id: 24,
    name: "Gumroad Creator Playbook",
    category: "E-commerce",
    tripwire: 7,
    commission: 35,
    description: "Sell ebooks, templates, and courses on Gumroad — setup in a weekend.",
  },
  {
    id: 25,
    name: "Subscription Box Business Kit",
    category: "E-commerce",
    tripwire: 7,
    commission: 40,
    description: "Launch a subscription box brand with recurring monthly revenue.",
  },
  {
    id: 26,
    name: "Wholesale Reseller Masterclass",
    category: "E-commerce",
    tripwire: 7,
    commission: 35,
    description: "Source wholesale products and flip them for profit on eBay and Amazon.",
  },

  // ── Finance (27–34) ────────────────────────────────────────────────────────
  {
    id: 27,
    name: "Dividend Investing Blueprint",
    category: "Finance",
    tripwire: 7,
    commission: 40,
    description: "Build a dividend portfolio that pays you monthly — beginner-friendly.",
  },
  {
    id: 28,
    name: "Crypto Fundamentals Course",
    category: "Finance",
    tripwire: 7,
    commission: 35,
    description: "Understand crypto, DeFi, and Web3 without the hype or confusion.",
  },
  {
    id: 29,
    name: "Real Estate Wholesaling 101",
    category: "Finance",
    tripwire: 7,
    commission: 40,
    description: "Find, contract, and assign real estate deals with no money down.",
  },
  {
    id: 30,
    name: "Budget Freedom System",
    category: "Finance",
    tripwire: 7,
    commission: 35,
    description: "Zero-based budgeting system that eliminates debt and builds savings.",
  },
  {
    id: 31,
    name: "Options Trading Starter Kit",
    category: "Finance",
    tripwire: 7,
    commission: 40,
    description: "Learn covered calls and cash-secured puts to generate weekly income.",
  },
  {
    id: 32,
    name: "High-Yield Savings Maximizer",
    category: "Finance",
    tripwire: 7,
    commission: 35,
    description: "Optimize your cash savings with the best HYSA and money market strategies.",
  },
  {
    id: 33,
    name: "Side Income Tax Strategy Guide",
    category: "Finance",
    tripwire: 7,
    commission: 40,
    description: "Legally minimize taxes on affiliate and side hustle income.",
  },
  {
    id: 34,
    name: "Passive Income Portfolio Builder",
    category: "Finance",
    tripwire: 7,
    commission: 35,
    description: "Diversify across 5 passive income streams using a proven framework.",
  },

  // ── Personal Development (35–43) ───────────────────────────────────────────
  {
    id: 35,
    name: "Deep Work Productivity System",
    category: "Personal Development",
    tripwire: 7,
    commission: 40,
    description: "4-hour focused work blocks that replace 8-hour distracted days.",
  },
  {
    id: 36,
    name: "Morning Routine Mastery",
    category: "Personal Development",
    tripwire: 7,
    commission: 35,
    description: "Design a morning routine that maximizes energy, focus, and output.",
  },
  {
    id: 37,
    name: "Mindset Reset Program",
    category: "Personal Development",
    tripwire: 7,
    commission: 40,
    description: "30-day program to eliminate limiting beliefs and build an abundance mindset.",
  },
  {
    id: 38,
    name: "Health Optimization Blueprint",
    category: "Personal Development",
    tripwire: 7,
    commission: 35,
    description: "Nutrition, sleep, and fitness system designed for busy entrepreneurs.",
  },
  {
    id: 39,
    name: "Networking Mastery Course",
    category: "Personal Development",
    tripwire: 7,
    commission: 40,
    description: "Build a powerful network that opens doors — even as an introvert.",
  },
  {
    id: 40,
    name: "Public Speaking Confidence Kit",
    category: "Personal Development",
    tripwire: 7,
    commission: 35,
    description: "Eliminate fear of public speaking and command any room.",
  },
  {
    id: 41,
    name: "Leadership Accelerator Program",
    category: "Personal Development",
    tripwire: 7,
    commission: 40,
    description: "Lead teams, clients, and yourself with clarity and confidence.",
  },
  {
    id: 42,
    name: "Digital Detox & Focus Bundle",
    category: "Personal Development",
    tripwire: 7,
    commission: 35,
    description: "Reclaim your attention from social media and build deep focus habits.",
  },
  {
    id: 43,
    name: "Goal Achievement System",
    category: "Personal Development",
    tripwire: 7,
    commission: 40,
    description: "12-week goal-setting and accountability framework used by top performers.",
  },

  // ── Marketing (44–51) ─────────────────────────────────────────────────────
  {
    id: 44,
    name: "Email List Building Machine",
    category: "Marketing",
    tripwire: 7,
    commission: 40,
    description: "Build a 10K email list in 90 days using free and paid traffic strategies.",
  },
  {
    id: 45,
    name: "Sales Funnel Blueprint",
    category: "Marketing",
    tripwire: 7,
    commission: 35,
    description: "Build a high-converting sales funnel from scratch — templates included.",
  },
  {
    id: 46,
    name: "Copywriting Crash Course",
    category: "Marketing",
    tripwire: 7,
    commission: 40,
    description: "Write ads, emails, and sales pages that convert — no experience needed.",
  },
  {
    id: 47,
    name: "SEO Traffic Domination",
    category: "Marketing",
    tripwire: 7,
    commission: 35,
    description: "Rank on page 1 of Google with a proven on-page and off-page SEO system.",
  },
  {
    id: 48,
    name: "Agency Launch Playbook",
    category: "Marketing",
    tripwire: 7,
    commission: 40,
    description: "Start a 6-figure marketing agency with no prior experience.",
  },
  {
    id: 49,
    name: "Paid Ads Profit System",
    category: "Marketing",
    tripwire: 7,
    commission: 35,
    description: "Run profitable Facebook and Google ads with a $5/day starting budget.",
  },
  {
    id: 50,
    name: "Brand Identity Starter Kit",
    category: "Marketing",
    tripwire: 7,
    commission: 40,
    description: "Design a professional brand identity using free tools — logo to color palette.",
  },
  {
    id: 51,
    name: "Freelance to Freedom Course",
    category: "Marketing",
    tripwire: 7,
    commission: 35,
    description: "Land your first 3 freelance clients in 30 days and replace your income.",
  },
];
