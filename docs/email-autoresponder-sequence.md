# Documentation: Instant Onboarding Email Sequence

**File:** `server/instantOnboardingService.ts`
**Manifest Item:** 5 (New File, 114 lines)
**Status:** Recovered from manifest specification

---

## 1. Overview

The Instant Onboarding sequence is a 5-step automated email series designed to welcome new paid members, maximize engagement, and drive them toward key activation milestones immediately after they join Its Dad LLC.

It replaces a traditional manual or batched welcome process with an instant, high-touch experience that begins within seconds of a successful Stripe payment.

## 2. Trigger & Scheduling

- **Trigger**: The sequence is initiated by the `triggerInstantOnboarding` function, which is called directly from the `checkout.session.completed` event handler in the `server/webhook-stripe.ts` file.
- **Scheduling**: Emails are delivered on a fixed-day schedule, not tied to specific days of the week, to ensure a consistent experience for every new member.
  - **Email 1 (Welcome)**: Sent **instantly** (within seconds of payment).
  - **Email 2 (Products)**: Sent on **Day 2** at 9:00 AM.
  - **Email 3 (Course)**: Sent on **Day 5** at 9:00 AM.
  - **Email 4 (Referral)**: Sent on **Day 10** at 9:00 AM.
  - **Email 5 (Degree)**: Sent on **Day 14** at 9:00 AM.

## 3. Core Logic

1.  **Instant Send**: The welcome email is sent immediately via `sendEmail`.
2.  **MailerLite Sync**: The new member's email, name, and membership tier are synced to the "Paid Members" group in MailerLite via `upsertSubscriber`.
3.  **Queue Remaining Emails**: The subsequent four emails (Days 2, 5, 10, 14) are inserted into the `emailSequenceQueue` table in the database with a `status` of `pending` and a calculated `scheduledFor` timestamp.
4.  **Cron Processing**: The `processInstantOnboardingEmails` function is called by a recurring cron job (every 15 minutes and daily at 9 AM) to query the queue for due emails, generate the content, send them, and update their status to `sent` or `failed`.
5.  **Completion Tracking**: Once all 5 emails in a user's sequence are sent, a record is added to the `emailSequenceCompletion` table to mark the onboarding as complete.

## 4. Email Content Summary

The email templates use passive, automated language to reinforce that the system is working for the member 24/7. All personal language like "I'll help you" has been replaced with system-oriented phrasing like "The system handles it."

| # | Day | Subject Line | Purpose |
|---|---|---|---|
| 1 | 0 | `You're In, {Name}! Your Dashboard Is Live` | Instantly confirm access, highlight the top 5 resources available (products, course, prompts), and provide a direct link to the user's dashboard. |
| 2 | 2 | `Your 51 Products + Swipe Files Are Ready` | Introduce the 6 product categories, emphasize the done-for-you swipe files (ad copy, email templates), and link to the full product catalog. |
| 3 | 5 | `Watch Module 1 (13 min) — Your First Commission Blueprint` | Drive engagement with the Affiliated Degree course by introducing the first module's content and linking directly to the course page. |
| 4 | 10 | `Your Referral Link Is Live — Earn 30-40% Recurring` | Introduce the built-in affiliate referral program, explain the commission structure, and link to the dashboard where the user can find their personal link. |
| 5 | 14 | `Earn Your Affiliated Degree — Here's How` | Outline the clear, automated steps required to earn the Affiliated Degree, explain its benefits (3x higher earnings), and encourage course completion. This is the final email in the sequence. |

---
