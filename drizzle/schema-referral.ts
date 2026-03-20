/**
 * drizzle/schema-referral.ts
 *
 * Its Dad LLC — Alliance Referral System Schema
 * Tracks referral links, conversions, commissions, and free month rewards.
 */
import {
  mysqlTable,
  serial,
  varchar,
  int,
  decimal,
  timestamp,
  mysqlEnum,
  boolean,
  text,
} from "drizzle-orm/mysql-core";
import { users, memberships } from "./schema";

// ─── Referral Codes ───────────────────────────────────────────────────────────
// Each member gets one unique referral code tied to their account
export const referralCodes = mysqlTable("referral_codes", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  // Total signups attributed to this code
  totalSignups: int("total_signups").default(0).notNull(),
  // Total commissions earned (in cents)
  totalEarnedCents: int("total_earned_cents").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Referral Signups ─────────────────────────────────────────────────────────
// Tracks who signed up via whose referral code
export const referralSignups = mysqlTable("referral_signups", {
  id: serial("id").primaryKey(),
  // The member who referred
  referrerId: int("referrer_id")
    .references(() => users.id)
    .notNull(),
  // The new member who signed up
  referredUserId: int("referred_user_id")
    .references(() => users.id)
    .notNull(),
  referralCode: varchar("referral_code", { length: 32 }).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(),
  // Whether the referrer has earned a free month from this signup
  freeMonthGranted: boolean("free_month_granted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Alliance Commissions ─────────────────────────────────────────────────────
// Tracks every commission earned — both direct (30-40%) and second-tier (6.7%)
export const allianceCommissions = mysqlTable("alliance_commissions", {
  id: serial("id").primaryKey(),
  // Who earns the commission
  earnerId: int("earner_id")
    .references(() => users.id)
    .notNull(),
  // The transaction that triggered it
  sourceUserId: int("source_user_id")
    .references(() => users.id)
    .notNull(),
  type: mysqlEnum("type", ["direct", "second_tier"]).notNull(),
  // Amount in cents
  amountCents: int("amount_cents").notNull(),
  // Commission rate applied (e.g., 0.35 for 35%, 0.067 for 6.7%)
  rate: decimal("rate", { precision: 5, scale: 4 }).notNull(),
  description: text("description"),
  // Whether this has been paid out
  paid: boolean("paid").default(false).notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Free Month Rewards ───────────────────────────────────────────────────────
// Tracks free month credits granted to members for successful referrals
export const freeMonthRewards = mysqlTable("free_month_rewards", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  // The referral signup that triggered this reward
  referralSignupId: int("referral_signup_id")
    .references(() => referralSignups.id)
    .notNull(),
  // Whether this has been applied to their next billing cycle
  applied: boolean("applied").default(false).notNull(),
  appliedAt: timestamp("applied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type ReferralCode = typeof referralCodes.$inferSelect;
export type ReferralSignup = typeof referralSignups.$inferSelect;
export type AllianceCommission = typeof allianceCommissions.$inferSelect;
export type FreeMonthReward = typeof freeMonthRewards.$inferSelect;
