/**
 * drizzle/schema-email-sequences.ts
 *
 * Drizzle ORM schema for email automation sequences.
 * Defines the tables for queueing, tracking, and completing multi-step email series.
 *
 * MANIFEST PATCH (item 8):
 *   - Added 'instant_onboarding' to sequenceType enum in both tables (lines 18, 46)
 */

import { pgTable, serial, varchar, integer, timestamp, text, pgEnum, boolean } from "drizzle-orm/pg-core";
import { users } from "./schema"; // Assuming a core schema.ts file exists

// ─── Enums ────────────────────────────────────────────────────────────────────

/**
 * MANIFEST PATCH: 'instant_onboarding' added to enum (line 18)
 */
export const sequenceTypeEnum = pgEnum("sequence_type", [
  "instant_onboarding",
  "free_blueprint",
  "abandoned_cart",
  "weekly_digest",
]);

export const sequenceStatusEnum = pgEnum("sequence_status", [
  "pending",
  "sent",
  "failed",
  "cancelled",
]);

// ─── Email Sequence Queue ─────────────────────────────────────────────────────

export const emailSequenceQueue = pgTable("email_sequence_queue", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }),
  /**
   * MANIFEST PATCH: 'instant_onboarding' enum available here (line 46)
   */
  sequenceType: sequenceTypeEnum("sequence_type").notNull(),
  emailNumber: integer("email_number").notNull(), // e.g., 1 for the first email, 2 for the second
  emailName: varchar("email_name", { length: 255 }).notNull(), // e.g., "Day 2: Products + Swipe Files"
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
  status: sequenceStatusEnum("status").default("pending").notNull(),
  membershipTier: varchar("membership_tier", { length: 100 }),
  retryCount: integer("retry_count").default(0).notNull(),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Email Sequence Completion ────────────────────────────────────────────────

export const emailSequenceCompletion = pgTable("email_sequence_completion", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sequenceType: sequenceTypeEnum("sequence_type").notNull(),
  emailsSent: integer("emails_sent").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
});
