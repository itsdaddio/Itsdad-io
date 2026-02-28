#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# recover.sh — Its Dad LLC Recovery Script
#
# Runs pnpm install, db:push, and vitest as specified in the Backup Manifest.
# Execute from the project root after placing all recovered files.
#
# Usage:
#   chmod +x recover.sh
#   ./recover.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e  # Exit on any error

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          Its Dad LLC — Recovery Script                   ║"
echo "║          Backup Manifest Recovery: All 19 Files          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Step 1: Install dependencies ─────────────────────────────────────────────
echo "▶ Step 1/3 — Installing dependencies (pnpm install)..."
pnpm install
echo "✅ Dependencies installed."
echo ""

# ── Step 2: Push database schema ─────────────────────────────────────────────
echo "▶ Step 2/3 — Pushing database schema (pnpm db:push)..."
echo "   This will apply the schema-email-sequences.ts changes,"
echo "   including the 'instant_onboarding' enum addition."
pnpm db:push
echo "✅ Database schema pushed."
echo ""

# ── Step 3: Run tests ─────────────────────────────────────────────────────────
echo "▶ Step 3/3 — Running test suite (pnpm vitest run)..."
pnpm vitest run
echo "✅ Tests complete."
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Recovery complete. All 19 manifest files are in place.  ║"
echo "║                                                          ║"
echo "║  Next steps:                                             ║"
echo "║  1. Verify MAILERLITE_PAID_MEMBERS_GROUP_ID in .env      ║"
echo "║  2. Verify STRIPE_WEBHOOK_SECRET in .env                 ║"
echo "║  3. Verify CRON_SECRET in .env                           ║"
echo "║  4. Deploy to production                                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
