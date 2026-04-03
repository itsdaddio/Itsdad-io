/**
 * server/server.ts
 *
 * itsdad.io — Express server entry point.
 *
 * - Mounts the API (routes registered in _core/index.ts)
 * - Serves the Vite-built frontend from /client/dist in production
 * - Falls back to index.html for all non-API routes (SPA routing)
 */

import path from "path";
import { app } from "./_core/index";

const PORT = parseInt(process.env.PORT || "3000", 10);
const IS_PROD = process.env.NODE_ENV === "production";

// ─── Serve Frontend in Production ────────────────────────────────────────────

if (IS_PROD) {
  const express = require("express");
  const distPath = path.resolve(__dirname, "../../client/dist");

  // Serve hashed assets (JS, CSS) with long cache — filenames change on rebuild
  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
      etag: true,
    })
  );

  // Serve images with moderate cache
  app.use(
    "/images",
    express.static(path.join(distPath, "images"), {
      maxAge: "7d",
      etag: true,
    })
  );

  // Serve other static files (favicon, og-image, etc.) with short cache
  app.use(
    express.static(distPath, {
      maxAge: "0",
      etag: true,
      index: false, // Don't auto-serve index.html from static middleware
    })
  );

  // Serve robots.txt and sitemap.xml directly (must be before SPA fallback)
  app.get("/robots.txt", (_req, res) => {
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.sendFile(path.join(distPath, "robots.txt"));
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.sendFile(path.join(distPath, "sitemap.xml"));
  });

  // ─── SEO Prerender for bots ───────────────────────────────────────────────
  // Inject route-specific meta tags and noscript content so crawlers see real content
  const fs = require("fs");
  const indexHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

  const ROUTE_META: Record<string, { title: string; description: string; noscript?: string }> = {
    "/": {
      title: "itsdad.io — Learn Affiliate Marketing & Earn Your First Dollar",
      description: "The affiliate marketing platform built for people who've tried and haven't won yet. Earn your Affiliated Degree, access 51 curated products, and build real recurring income — starting at $7.",
      noscript: "<h1>itsdad.io — Affiliate Marketing for Everyone</h1><p>51 curated digital products with full resell rights. 4 membership tiers starting at $7. Earn your Affiliated Degree through our 8-module course. No guesswork, no tech headaches — just follow the system.</p><p>Starter Pack $7 | Builder Club $19/mo | Pro Club $49.99/mo | Inner Circle Club $99.99/mo</p>",
    },
    "/memberships": {
      title: "Membership Tiers — itsdad.io",
      description: "Compare all 4 membership tiers: Starter Pack ($7), Builder Club ($19/mo), Pro Club ($49.99/mo), and Inner Circle Club ($99.99/mo). Find the right plan for your affiliate marketing journey.",
      noscript: "<h1>itsdad.io Membership Tiers</h1><p>Starter Pack — $7 one-time. Builder Club — $19/mo. Pro Club — $49.99/mo. Inner Circle Club — $99.99/mo. All tiers include done-for-you products, the Affiliated Degree course, and affiliate tools.</p>",
    },
    "/meet-dad": {
      title: "Meet Dad — The Story Behind itsdad.io",
      description: "Learn about the founder of itsdad.io and why this platform was built for people who tried affiliate marketing and didn't succeed yet.",
      noscript: "<h1>Meet Dad</h1><p>itsdad.io was built by someone who understands the struggle of trying to make affiliate marketing work. This is the platform designed for people who've been burned before.</p>",
    },
    "/about": {
      title: "About itsdad.io — Our Mission",
      description: "Learn about itsdad.io, the affiliate marketing platform built for beginners who've tried and haven't succeeded yet.",
    },
    "/privacy": {
      title: "Privacy Policy — itsdad.io",
      description: "Read the itsdad.io privacy policy. We respect your data and comply with GDPR and CCPA regulations.",
    },
    "/terms": {
      title: "Terms of Service — itsdad.io",
      description: "Read the itsdad.io terms of service governing your use of our platform and services.",
    },
    "/disclaimer": {
      title: "Earnings Disclaimer — itsdad.io",
      description: "Important earnings disclaimer for itsdad.io. Results vary and are not guaranteed. Read before purchasing.",
    },
    "/hubs": {
      title: "Knowledge Hub — itsdad.io",
      description: "Free affiliate marketing guides, tutorials, and strategies. Learn SEO, content marketing, social media growth, and more.",
      noscript: "<h1>Knowledge Hub</h1><p>Free affiliate marketing education: SEO guides, content strategy, social media growth, email marketing, and more. Updated regularly with expert insights.</p>",
    },
    "/free-tools": {
      title: "Free Affiliate Marketing Tools — itsdad.io",
      description: "Free tools for affiliate marketers: Affiliate Link Checker and Commission Calculator. No signup required.",
      noscript: "<h1>Free Tools</h1><p>Affiliate Link Checker — verify your affiliate links are working. Commission Calculator — estimate your earnings across different tiers and products.</p>",
    },
    "/course": {
      title: "Affiliated Degree Course — itsdad.io",
      description: "Earn your Affiliated Degree with our 8-module self-paced affiliate marketing course. From zero to earning.",
    },
  };

  // SPA fallback — serve index.html with injected meta for all non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    const routePath = req.path.replace(/\/$/, "") || "/";
    const meta = ROUTE_META[routePath];

    if (meta) {
      let html = indexHtml;
      // Replace title
      html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${meta.title}</title>`
      );
      // Replace meta description
      html = html.replace(
        /<meta name="description" content="[^"]*" \/>/,
        `<meta name="description" content="${meta.description}" />`
      );
      // Replace OG tags
      html = html.replace(
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="${meta.title}" />`
      );
      html = html.replace(
        /<meta property="og:description" content="[^"]*" \/>/,
        `<meta property="og:description" content="${meta.description}" />`
      );
      html = html.replace(
        /<meta property="og:url" content="[^"]*" \/>/,
        `<meta property="og:url" content="https://itsdad.io${routePath === "/" ? "" : routePath}" />`
      );
      // Replace canonical
      html = html.replace(
        /<link rel="canonical" href="[^"]*" \/>/,
        `<link rel="canonical" href="https://itsdad.io${routePath === "/" ? "/" : routePath}" />`
      );
      // Add noscript content for crawlers that don't execute JS
      if (meta.noscript) {
        html = html.replace(
          '<div id="root"></div>',
          `<div id="root"></div><noscript>${meta.noscript}</noscript>`
        );
      }
      res.send(html);
    } else {
      res.sendFile(path.join(distPath, "index.html"));
    }
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[Server] itsdad.io API running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[Server] App URL: ${process.env.VITE_APP_URL || "http://localhost:" + PORT}`);
});

export default app;
