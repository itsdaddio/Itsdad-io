# Checkpoint: Batch 4 Articles + Stripe Lazy-Init Fix

**Date:** April 14, 2026
**Commit:** (pending push)
**Branch:** main

## Summary

This checkpoint covers two changes:

1. **Critical server fix:** Converted all Stripe SDK initializations from eager (module-level) to lazy (function-level) to prevent the Express server from crashing on startup when `STRIPE_SECRET_KEY` is not set. This was the root cause of the admin dashboard being unavailable — the server process was dying before any API routes could be registered.

2. **Batch 4 Knowledge Hub articles:** Added 10 new SEO-optimized cluster articles to the static `ARTICLES` array in `Hubs.tsx`, bringing the total from 22 to 32.

## Stripe Lazy-Init Fix

The Stripe SDK v4+ throws a fatal `Error: Neither apiKey nor config.authenticator provided` when constructed with an empty string. Four files were initializing Stripe at the module level with `process.env.STRIPE_SECRET_KEY || ""`, which crashed the entire Node.js process during `require()` if the env var was missing.

| File | Line (before fix) | Change |
|------|-------------------|--------|
| `server/webhook-stripe.ts` | 21 | `const stripe = new Stripe(...)` replaced with `getStripe()` lazy factory |
| `server/checkout.ts` | 26 | Same pattern |
| `server/products.ts` | 27 | Same pattern |
| `server/auth.ts` | 36 | Same pattern |

All call sites (`stripe.webhooks.constructEvent`, `stripe.checkout.sessions.create`, etc.) were updated to use `getStripe()` instead. The server now starts cleanly even without Stripe credentials, and Stripe is only initialized on first actual use.

**Verified locally:** Server starts, `/api/health` returns JSON, `/api/admin/dashboard` returns proper 401/503 responses.

## Batch 4 Articles (10 new)

| # | Slug | Title | Category |
|---|------|-------|----------|
| 1 | how-to-write-product-reviews-that-convert-affiliate-sales | How to Write Product Reviews That Actually Convert Affiliate Sales | Strategy |
| 2 | google-seo-for-affiliate-websites-beginners-guide-2026 | Google SEO for Affiliate Websites: The Beginner's Guide for 2026 | Strategy |
| 3 | clickbank-affiliate-marketing-beginners-guide-2026 | ClickBank Affiliate Marketing for Beginners: Is It Still Worth It in 2026? | E-Commerce |
| 4 | how-to-create-lead-magnets-affiliate-marketing | How to Create Lead Magnets That Build Your Affiliate Email List Fast | Marketing Channels |
| 5 | affiliate-marketing-mistakes-beginners-avoid-2026 | 10 Affiliate Marketing Mistakes Every Beginner Makes (And How to Avoid Them) | Getting Started |
| 6 | how-to-track-affiliate-links-analytics-beginners | How to Track Your Affiliate Links and Actually Understand the Data | Tools & Resources |
| 7 | threads-affiliate-marketing-strategy-2026 | Threads for Affiliate Marketing: The Untapped Platform Strategy for 2026 | Social Media |
| 8 | how-to-build-affiliate-marketing-website-no-code-2026 | How to Build an Affiliate Marketing Website With No Code in 2026 | Getting Started |
| 9 | morning-routine-successful-affiliate-marketers | The Morning Routine of Successful Affiliate Marketers (Steal This Schedule) | Personal Development |
| 10 | whats-an-affiliate-funnel-and-how-to-build-one | What Is an Affiliate Funnel? (And How to Build One That Prints Money) | Strategy |

## Files Modified

| File | Change |
|------|--------|
| `server/webhook-stripe.ts` | Stripe lazy-init |
| `server/checkout.ts` | Stripe lazy-init |
| `server/products.ts` | Stripe lazy-init |
| `server/auth.ts` | Stripe lazy-init |
| `client/src/pages/Hubs.tsx` | +10 article entries (32 total) |
| `client/public/sitemap.xml` | +10 hub URLs (32 hub URLs total) |
| `docs/batch4_article_plan.md` | Planning document |
| `docs/checkpoint_2026-04-14_batch4_and_stripe_fix.md` | This file |

## Deployment Notes

After pushing to `main`, trigger a **Redeploy** (not just Restart) in Railway to build from the latest commit. The Stripe fix means the server will now start even if `STRIPE_SECRET_KEY` is temporarily missing — but for full functionality (checkout, webhooks, auth), ensure all Stripe env vars are set in Railway.
