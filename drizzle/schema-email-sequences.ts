/**
 * drizzle/schema-email-sequences.ts
 *
 * Drizzle ORM schema for email automation sequences.
 * Defines the tables for queueing, tracking, and completing multi-step email series.
 *
 * MANIFEST PATCH (item 8):
 *   - Added 'instant_onboarding' to sequenceType enum in both tables (lines 18, 46)
 */

import {
  mysqlTable,
  serial,
  varchar,
  int,
  timestamp,
  text,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { users } from "./schema";

// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * MANIFEST PATCH: 'instant_onboarding' added to enum (line 18)
 */
export const SEQUENCE_TYPES = [
  "instant_onboarding",
  "free_blueprint",
  "abandoned_cart",
  "weekly_digest",
] as const;

export const SEQUENCE_STATUSES = ["pending", "sent", "failed", "cancelled"] as const;

// ─── Email Sequence Queue ─────────────────────────────────────────────────────

/**
 * Holds all pending and processed emails for every automated sequence.
 * The cron job queries this table every 15 minutes for due emails.
 *
 * MANIFEST PATCH: 'instant_onboarding' enum available here (line 46)
 */
export const emailSequenceQueue = mysqlTable("email_sequence_queue", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }),
  sequenceType: mysqlEnum("sequence_type", SEQUENCE_TYPES).notNull(),
  emailNumber: int("email_number").notNull(),
  emailName: varchar("email_name", { length: 255 }).notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: mysqlEnum("status", SEQUENCE_STATUSES).default("pending").notNull(),
  membershipTier: varchar("membership_tier", { length: 100 }),
  retryCount: int("retry_count").default(0).notNull(),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Email Sequence Completion ────────────────────────────────────────────────

/**
 * Records when a user has completed all emails in a sequence.
 * Used to prevent duplicate sequences and for analytics.
 */
export const emailSequenceCompletion = mysqlTable("email_sequence_completion", {
  id: serial("id").primaryKey(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  sequenceType: mysqlEnum("sequence_type", SEQUENCE_TYPES).notNull(),
  emailsSent: int("emails_sent").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type EmailSequenceQueue = typeof emailSequenceQueue.$inferSelect;
export type NewEmailSequenceQueue = typeof emailSequenceQueue.$inferInsert;
export type EmailSequenceCompletion = typeof emailSequenceCompletion.$inferSelect;
