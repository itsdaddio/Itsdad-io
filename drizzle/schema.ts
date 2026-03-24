/**
 * drizzle/schema.ts
 *
 * Core Drizzle ORM schema for Its Dad LLC.
 * Defines the primary tables: users, memberships.
 * Extended by schema-email-sequences.ts for email automation tables.
 */

import {
  mysqlTable,
  serial,
  varchar,
  int,
  timestamp,
  mysqlEnum,
  text,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    avatarUrl: varchar("avatar_url", { length: 512 }),
    role: mysqlEnum("role", ["member", "admin"]).default("member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

// ─── Memberships ──────────────────────────────────────────────────────────────

export const memberships = mysqlTable("memberships", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  tier: mysqlEnum("tier", [
    "starter",
    "builder",
    "pro-creator",
    "inner-circle",
    "member",
  ])
    .default("member")
    .notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "past_due", "trialing"])
    .default("active")
    .notNull(),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Blueprint Email Captures ─────────────────────────────────────────────────

export const blueprintCaptures = mysqlTable(
  "blueprint_captures",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    source: varchar("source", { length: 100 }).default("homepage"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("blueprint_email_idx").on(table.email),
  })
);

// ─── Affiliate Clicks ─────────────────────────────────────────────────────────

export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  referrerId: int("referrer_id").references(() => users.id),
  productId: int("product_id"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  converted: int("converted").default(0).notNull(), // 0 = no, 1 = yes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
