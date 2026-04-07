/**
 * JsonLd.tsx
 *
 * Structured data (JSON-LD) component for itsdad.io.
 * Injects schema.org markup for SEO and rich results.
 *
 * MANIFEST PATCH (item 18):
 *   - Updated all structured data descriptions for commission and support language
 */

interface JsonLdProps {
  page?: "home" | "memberships" | "course" | "products" | "about";
}

const BASE_URL = "https://www.itsdad.io";

// ─── Organization Schema ──────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "itsdad.io",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [
    "https://twitter.com/itsdadio",
    "https://www.youtube.com/@itsdad",
  ],
  // MANIFEST PATCH: Updated description for commission and support language
  description:
    "itsdad.io is an automated affiliate marketing facilitation hub offering 51 curated digital products, the Affiliated Degree course, and a 24/7 self-serve Prompt Vault. Members earn 30–40% recurring commissions on product sales with no manual intervention required.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    // MANIFEST PATCH: Updated to reflect self-serve support model
    description: "24/7 self-serve support via the Prompt Vault and pre-recorded video library",
  },
};

// ─── Website Schema ───────────────────────────────────────────────────────────

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Its Dad — Affiliation Nation — Affiliate Marketing Hub",
  url: BASE_URL,
  // MANIFEST PATCH: Updated description
  description:
    "Join Its Dad and access 51 curated affiliate products, the Affiliated Degree course, and 40,000 ChatGPT prompts. Earn 30–40% recurring commissions on product sales automatically.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// ─── Page-Specific Schemas ────────────────────────────────────────────────────

const PAGE_SCHEMAS: Record<string, object> = {
  home: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Its Dad — Earn Commissions on Product Sales Automatically",
    url: BASE_URL,
    // MANIFEST PATCH: Updated description
    description:
      "Its Dad is the affiliate marketing facilitation hub for individuals who are ready to earn. Access 51 products, the Affiliated Degree course, and a 24/7 self-serve Prompt Vault. Commissions are tracked and paid automatically.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL }],
    },
  },

  memberships: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Membership Plans — itsdad.io",
    url: `${BASE_URL}/memberships`,
    // MANIFEST PATCH: Updated description
    description:
      "Choose your Its Dad membership plan. Starter Pack ($7/mo), Builder Club ($19/mo), Pro Creator Club ($49.99/mo), and Inner Circle Club ($99.99/mo). All plans include automated commission tracking, done-for-you swipe files, and the Affiliated Degree course.",
    offers: [
      {
        "@type": "Offer",
        name: "Starter Pack",
        price: "7.00",
        priceCurrency: "USD",
        // MANIFEST PATCH: Updated description
        description: "First Dollar System, 1 product to promote, 1 viral script, step-by-step posting instructions, Affiliated Degree course (8 modules), 40,000 ChatGPT Prompt Vault, done-for-you swipe files, 30% recurring commissions.",
      },
      {
        "@type": "Offer",
        name: "Builder Club",
        price: "19.00",
        priceCurrency: "USD",
        // MANIFEST PATCH: Updated description
        description: "Everything in Starter Pack, multiple products to promote, daily content prompts, content rotation engine, scaling method, priority execution path.",
      },
      {
        "@type": "Offer",
        name: "Pro Creator Club",
        price: "49.99",
        priceCurrency: "USD",
        description: "Everything in Builder Club, full library of 51 products unlocked, automation frameworks, funnel strategies, content scaling systems, performance optimization tools.",
      },
      {
        "@type": "Offer",
        name: "Inner Circle Club",
        price: "99.99",
        priceCurrency: "USD",
        description: "Everything in Pro Creator Club, all 51 products at 40% commissions, advanced monetization systems, early access tools and features, strategy drops and system updates, high-level income expansion methods.",
      },
    ],
  },

  course: {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "The Affiliated Degree",
    url: `${BASE_URL}/course`,
    provider: {
      "@type": "Organization",
      name: "itsdad.io",
      url: BASE_URL,
    },
    // MANIFEST PATCH: Updated description
    description:
      "The Affiliated Degree is an 8-module self-paced affiliate marketing course. Learn at your own pace with pre-recorded video modules and the 24/7 Prompt Vault. No live calls required. Members who complete the degree report 3x higher earnings in their first 90 days.",
    numberOfCredits: 8,
    educationalLevel: "Beginner to Intermediate",
  },

  products: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "51 Affiliate Products — itsdad.io",
    url: `${BASE_URL}/products`,
    // MANIFEST PATCH: Updated description
    description:
      "Browse all 51 curated digital affiliate products across 6 categories: AI Tools, Social Media, E-commerce, Finance, Personal Development, and Marketing. Each product includes done-for-you swipe files and automated commission tracking.",
  },

  about: {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About itsdad.io",
    url: `${BASE_URL}/about`,
    // MANIFEST PATCH: Updated description
    description:
      "itsdad.io is an automated affiliate marketing facilitation hub. We provide 51 curated products, the Affiliated Degree course, and a 24/7 self-serve Prompt Vault so members can earn commissions on product sales without manual intervention.",
  },
};

export function JsonLd({ page = "home" }: JsonLdProps) {
  const schemas = [organizationSchema, websiteSchema, PAGE_SCHEMAS[page]].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}
