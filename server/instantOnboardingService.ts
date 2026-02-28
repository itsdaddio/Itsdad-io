/**
 * Instant Onboarding Email Service
 * 
 * Fires the welcome email INSTANTLY on paid signup (within seconds of Stripe webhook).
 * Schedules remaining 4 emails at Day 2/5/10/14 — no Mon/Wed/Fri waiting.
 * Also syncs the new member to MailerLite "Paid Members" group.
 * 
 * Zero delay. Zero manual intervention. Maximum stickiness.
 */

import { getDb } from "./db";
import { emailSequenceQueue, emailSequenceCompletion } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "./_core/email";
import { upsertSubscriber } from "./mailerlite";
import {
  getRoyalEmailHeader,
  getRoyalEmailFooter,
  getGoldButton,
  EMAIL_COLORS,
  ITS_DADDIO_SIGNATURE_URL,
} from "./_core/emailBranding";

// MailerLite "Paid Members" group ID — create this group in MailerLite dashboard
// If group doesn't exist yet, the upsert will still work (subscriber added without group)
const PAID_MEMBERS_GROUP_ID = process.env.MAILERLITE_PAID_MEMBERS_GROUP_ID || "";

interface InstantOnboardingParams {
  userId: number;
  userEmail: string;
  userName: string;
  membershipTier: string;
  tierName: string;
}

// ─── Signature Block ──────────────────────────────────────────────────────────

function getSignatureBlock(): string {
  return `
    <div style="margin: 40px 0 0 0; padding-top: 30px; border-top: 1px solid #e2e8f0;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right: 20px;">
            <img src="${ITS_DADDIO_SIGNATURE_URL}" alt="Its Daddio" width="150" height="40" style="display: block;" />
          </td>
          <td style="border-left: 2px solid ${EMAIL_COLORS.royalGold}; padding-left: 20px;">
            <p style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 600;">Its Daddio</p>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Founder & Executive Facilitator</p>
            <p style="margin: 4px 0 0 0; color: ${EMAIL_COLORS.royalGold}; font-size: 12px;">Its Dad L.L.C.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function wrapEmail(subtitle: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Its Dad - ${subtitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #faf5ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(76, 29, 149, 0.15);">
          ${getRoyalEmailHeader({ subtitle })}
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          ${getRoyalEmailFooter({ includeSignature: false })}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─── Email Templates (Passive/Automated Language) ─────────────────────────────

const BASE_URL = process.env.VITE_APP_URL || "https://www.itsdad.io";

function getInstantWelcomeEmail(data: InstantOnboardingParams): { subject: string; html: string } {
  const subject = `You're In, ${data.userName}! Your Dashboard Is Live`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; text-align: center;">
      Welcome to Its Dad, ${data.userName}!
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Your <strong style="color: ${EMAIL_COLORS.royalGold};">${data.tierName}</strong> membership is now active. 
      Everything is unlocked and ready for you — no waiting, no approval needed.
    </p>
    
    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 25px; margin: 30px 0; border-radius: 12px; border: 1px solid #c4b5fd;">
      <h3 style="margin: 0 0 15px 0; color: #4c1d95; font-size: 18px;">Here's what's waiting for you right now:</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="color: #5b21b6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #ddd6fe;">
            <strong>🛍️ 51 Curated Products</strong> — Ready to promote with your unique affiliate links
          </td>
        </tr>
        <tr>
          <td style="color: #5b21b6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #ddd6fe;">
            <strong>📚 The Affiliated Degree Course</strong> — 8 self-paced video modules
          </td>
        </tr>
        <tr>
          <td style="color: #5b21b6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #ddd6fe;">
            <strong>🤖 40,000 ChatGPT Prompts</strong> — Your done-for-you content engine ($297 value, FREE)
          </td>
        </tr>
        <tr>
          <td style="color: #5b21b6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #ddd6fe;">
            <strong>📋 Swipe Files & Templates</strong> — Copy-paste ad copy, email scripts, and sales pages
          </td>
        </tr>
        <tr>
          <td style="color: #5b21b6; font-size: 14px; padding: 10px 0;">
            <strong>📊 Your Dashboard</strong> — Track earnings, progress, and product performance
          </td>
        </tr>
      </table>
    </div>
    
    ${getGoldButton("Access Your Dashboard Now", `${BASE_URL}/dashboard`)}
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #92400e; font-size: 15px;">
        <strong>Quick Start:</strong> Log in, browse the 51 products, and grab your first affiliate link. 
        The system handles tracking, attribution, and payouts automatically.
      </p>
    </div>
    
    <p style="margin: 20px 0 0 0; color: #475569; font-size: 16px; line-height: 1.8;">
      In 2 days, you'll get an email with your complete product catalog and done-for-you swipe files. 
      For now, explore your dashboard and get familiar with the tools.
    </p>
    
    ${getSignatureBlock()}
  `;

  return { subject, html: wrapEmail("YOU'RE IN!", content) };
}

function getDay2ProductsEmail(data: InstantOnboardingParams): { subject: string; html: string } {
  const subject = `Your 51 Products + Swipe Files Are Ready`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; text-align: center;">
      Your Product Arsenal Is Loaded
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Hey ${data.userName},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      You now have access to <strong>51 curated digital products</strong> across 6 categories — 
      each one hand-picked for high conversion rates and strong commission potential.
    </p>
    
    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 25px; margin: 30px 0; border-radius: 12px; border: 1px solid #c4b5fd;">
      <h3 style="margin: 0 0 15px 0; color: #4c1d95; font-size: 18px;">Product Categories:</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;"><strong>🤖 AI & Automation Tools</strong> — High-demand, high-ticket</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;"><strong>💰 Finance & Investing</strong> — Evergreen niche</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;"><strong>💪 Health & Wellness</strong> — Massive audience</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;"><strong>📚 Education & Skills</strong> — Growing market</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;"><strong>🏠 Home & Lifestyle</strong> — Broad appeal</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0;"><strong>🎨 Creative & Design</strong> — Passionate buyers</td></tr>
      </table>
    </div>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Each product comes with <strong>done-for-you swipe files</strong>: pre-written ad copy, email templates, 
      and social media posts. Just copy, paste, and customize with your affiliate link.
    </p>
    
    ${getGoldButton("Browse All 51 Products", `${BASE_URL}/products`)}
    
    <p style="margin: 30px 0 0 0; color: #475569; font-size: 16px; line-height: 1.8;">
      In 3 days, you'll get a walkthrough of Module 1 of the Affiliated Degree course — 
      a 13-minute video that shows you exactly how to turn these products into commissions.
    </p>
    
    ${getSignatureBlock()}
  `;

  return { subject, html: wrapEmail("YOUR PRODUCT CATALOG", content) };
}

function getDay5CourseEmail(data: InstantOnboardingParams): { subject: string; html: string } {
  const subject = `Watch Module 1 (13 min) — Your First Commission Blueprint`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; text-align: center;">
      Module 1: Your Commission Blueprint
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Hey ${data.userName},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      The Affiliated Degree course is designed to take you from zero to earning commissions — 
      at your own pace, on your own schedule. No live calls. No group sessions. Just you and the material.
    </p>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #92400e; font-size: 15px;">
        <strong>Module 1 covers:</strong><br>
        ✅ How affiliate marketing actually works (the real version)<br>
        ✅ Choosing your first 3 products to promote<br>
        ✅ Setting up your tracking links<br>
        ✅ The "first sale in 7 days" framework
      </p>
    </div>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      It's 13 minutes. Grab a coffee, watch it once, and you'll have a clear action plan.
    </p>
    
    ${getGoldButton("Start Module 1 Now", `${BASE_URL}/course`)}
    
    <p style="margin: 30px 0 0 0; color: #475569; font-size: 16px; line-height: 1.8;">
      In 5 days, you'll hear from a member who landed their first commission within 2 weeks — 
      plus you'll get your personal referral link to start earning on autopilot.
    </p>
    
    ${getSignatureBlock()}
  `;

  return { subject, html: wrapEmail("START THE COURSE", content) };
}

function getDay10ReferralEmail(data: InstantOnboardingParams): { subject: string; html: string } {
  const subject = `Your Referral Link Is Live — Earn 30-40% Recurring`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; text-align: center;">
      Your Built-In Revenue Stream
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Hey ${data.userName},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Every Its Dad member gets a <strong>personal referral link</strong> that earns you 
      <strong style="color: ${EMAIL_COLORS.royalGold};">30-40% recurring commission</strong> on anyone who joins through your link.
    </p>
    
    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 25px; margin: 30px 0; border-radius: 12px; border: 1px solid #c4b5fd;">
      <h3 style="margin: 0 0 15px 0; color: #4c1d95; font-size: 18px;">How the math works:</h3>
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;">Refer <strong>1 member</strong> at $59.99/mo → You earn ~$18-24/mo recurring</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #ddd6fe;">Refer <strong>3 members</strong> → Your membership pays for itself</td></tr>
        <tr><td style="color: #5b21b6; font-size: 14px; padding: 8px 0;">Refer <strong>10 members</strong> → $180-240/mo passive income</td></tr>
      </table>
    </div>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      The system tracks everything automatically — clicks, signups, and payouts. 
      Just share your link and the platform does the rest.
    </p>
    
    ${getGoldButton("Get Your Referral Link", `${BASE_URL}/dashboard`)}
    
    <p style="margin: 30px 0 0 0; color: #475569; font-size: 16px; line-height: 1.8;">
      In 4 days, you'll get your final onboarding email with the path to earning your Affiliated Degree. 
      You're closer than you think.
    </p>
    
    ${getSignatureBlock()}
  `;

  return { subject, html: wrapEmail("YOUR REFERRAL LINK", content) };
}

function getDay14DegreeEmail(data: InstantOnboardingParams): { subject: string; html: string } {
  const subject = `Earn Your Affiliated Degree — Here's How`;

  const content = `
    <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; text-align: center;">
      The Affiliated Degree Awaits
    </h2>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Hey ${data.userName},
    </p>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      You've had 2 weeks to explore the platform, browse the products, and start the course. 
      Now it's time to talk about the finish line: <strong>your Affiliated Degree</strong>.
    </p>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #92400e; font-size: 15px;">
        <strong>To earn your Affiliated Degree:</strong><br>
        ✅ Complete all 8 course modules<br>
        ✅ Set up your first 3 affiliate links<br>
        ✅ Generate your first tracked click<br>
        ✅ Pass the final assessment<br><br>
        The system tracks your progress automatically. No deadlines. No pressure. Go at your own pace.
      </p>
    </div>
    
    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Members who complete the degree report <strong>3x higher earnings</strong> in their first 90 days 
      compared to those who skip the course. The material works — if you work it.
    </p>
    
    ${getGoldButton("Continue Your Course", `${BASE_URL}/course`)}
    
    <p style="margin: 30px 0 0 0; color: #475569; font-size: 16px; line-height: 1.8;">
      This is the last email in your onboarding sequence. From here, the system does the heavy lifting — 
      your dashboard, your products, your prompts, and your referral link are all working for you 24/7.
    </p>
    
    <p style="margin: 20px 0 0 0; color: #475569; font-size: 16px; line-height: 1.8;">
      Go earn that degree.
    </p>
    
    ${getSignatureBlock()}
  `;

  return { subject, html: wrapEmail("EARN YOUR DEGREE", content) };
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

/**
 * Fire the instant welcome email and schedule the remaining 4 emails.
 * Called directly from the Stripe webhook — no delay.
 */
export async function triggerInstantOnboarding(params: InstantOnboardingParams): Promise<{
  success: boolean;
  instantEmailSent: boolean;
  scheduledEmails: number;
  mailerliteSynced: boolean;
}> {
  const result = {
    success: false,
    instantEmailSent: false,
    scheduledEmails: 0,
    mailerliteSynced: false,
  };

  const { userId, userEmail, userName, membershipTier, tierName } = params;

  // 1. INSTANT: Send welcome email RIGHT NOW
  try {
    const welcomeEmail = getInstantWelcomeEmail(params);
    await sendEmail({
      to: userEmail,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });
    result.instantEmailSent = true;
    console.log(`[InstantOnboarding] Welcome email sent INSTANTLY to ${userEmail}`);
  } catch (emailError) {
    console.error(`[InstantOnboarding] Failed to send instant welcome email to ${userEmail}:`, emailError);
    // Don't stop — still schedule the rest
  }

  // 2. INSTANT: Sync to MailerLite "Paid Members" group
  try {
    const mlResult = await upsertSubscriber({
      email: userEmail,
      name: userName,
      groups: PAID_MEMBERS_GROUP_ID ? [PAID_MEMBERS_GROUP_ID] : undefined,
      status: "active",
      fields: {
        membership_tier: tierName,
        signup_date: new Date().toISOString().split('T')[0],
      },
    });
    result.mailerliteSynced = mlResult.success;
    console.log(`[InstantOnboarding] MailerLite sync: ${mlResult.success ? "success" : "failed"} for ${userEmail}`);
  } catch (mlError) {
    console.error(`[InstantOnboarding] MailerLite sync failed for ${userEmail}:`, mlError);
  }

  // 3. SCHEDULE: Queue remaining 4 emails at Day 2/5/10/14
  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection not available");

    // Check for existing sequence (idempotency)
    const existing = await db
      .select()
      .from(emailSequenceQueue)
      .where(
        and(
          eq(emailSequenceQueue.userId, userId),
          eq(emailSequenceQueue.sequenceType, "instant_onboarding"),
          eq(emailSequenceQueue.status, "pending")
        )
      );

    if (existing.length > 0) {
      console.log(`[InstantOnboarding] User ${userId} already has a pending onboarding sequence`);
      result.success = result.instantEmailSent;
      return result;
    }

    const now = new Date();
    const emailSchedule = [
      { dayOffset: 2, name: "Day 2: Products + Swipe Files", emailNumber: 2, getter: getDay2ProductsEmail },
      { dayOffset: 5, name: "Day 5: Module 1 Walkthrough", emailNumber: 3, getter: getDay5CourseEmail },
      { dayOffset: 10, name: "Day 10: Referral Link + Success Story", emailNumber: 4, getter: getDay10ReferralEmail },
      { dayOffset: 14, name: "Day 14: Earn Your Affiliated Degree", emailNumber: 5, getter: getDay14DegreeEmail },
    ];

    for (const item of emailSchedule) {
      const scheduledFor = new Date(now.getTime() + item.dayOffset * 24 * 60 * 60 * 1000);
      scheduledFor.setHours(9, 0, 0, 0); // 9 AM

      await db.insert(emailSequenceQueue).values({
        userId,
        userEmail,
        userName,
        sequenceType: "instant_onboarding",
        emailNumber: item.emailNumber,
        emailName: item.name,
        scheduledFor,
        status: "pending",
        membershipTier,
      });
      result.scheduledEmails++;
    }

    console.log(`[InstantOnboarding] Scheduled ${result.scheduledEmails} follow-up emails for ${userEmail}`);
    console.log(`[InstantOnboarding] Schedule: Day 2, 5, 10, 14 from ${now.toISOString()}`);

    result.success = true;
  } catch (dbError) {
    console.error(`[InstantOnboarding] Failed to schedule follow-up emails for ${userEmail}:`, dbError);
    // Still mark success if instant email was sent
    result.success = result.instantEmailSent;
  }

  return result;
}

/**
 * Process pending instant onboarding emails that are due.
 * Called by the existing cron job that processes email queues.
 */
export async function processInstantOnboardingEmails(): Promise<{ sent: number; failed: number }> {
  const db = await getDb();
  if (!db) return { sent: 0, failed: 0 };

  const now = new Date();
  const { lte } = await import("drizzle-orm");

  const pendingEmails = await db
    .select()
    .from(emailSequenceQueue)
    .where(
      and(
        eq(emailSequenceQueue.sequenceType, "instant_onboarding"),
        eq(emailSequenceQueue.status, "pending"),
        lte(emailSequenceQueue.scheduledFor, now)
      )
    )
    .limit(50);

  let sent = 0;
  let failed = 0;

  for (const queuedEmail of pendingEmails) {
    try {
      // Generate the email content based on email number
      const params: InstantOnboardingParams = {
        userId: queuedEmail.userId,
        userEmail: queuedEmail.userEmail,
        userName: queuedEmail.userName || "Friend",
        membershipTier: queuedEmail.membershipTier || "member",
        tierName: queuedEmail.membershipTier || "Member",
      };

      let emailContent: { subject: string; html: string };
      switch (queuedEmail.emailNumber) {
        case 2:
          emailContent = getDay2ProductsEmail(params);
          break;
        case 3:
          emailContent = getDay5CourseEmail(params);
          break;
        case 4:
          emailContent = getDay10ReferralEmail(params);
          break;
        case 5:
          emailContent = getDay14DegreeEmail(params);
          break;
        default:
          throw new Error(`Unknown email number: ${queuedEmail.emailNumber}`);
      }

      await sendEmail({
        to: queuedEmail.userEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      // Mark as sent
      await db
        .update(emailSequenceQueue)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(emailSequenceQueue.id, queuedEmail.id));

      sent++;
      console.log(`[InstantOnboarding] Sent ${queuedEmail.emailName} to ${queuedEmail.userEmail}`);

      // Check if sequence is complete
      const remaining = await db
        .select()
        .from(emailSequenceQueue)
        .where(
          and(
            eq(emailSequenceQueue.userId, queuedEmail.userId),
            eq(emailSequenceQueue.sequenceType, "instant_onboarding"),
            eq(emailSequenceQueue.status, "pending")
          )
        );

      if (remaining.length === 0) {
        await db.insert(emailSequenceCompletion).values({
          userId: queuedEmail.userId,
          sequenceType: "instant_onboarding",
          emailsSent: 5, // 1 instant + 4 scheduled
        });
        console.log(`[InstantOnboarding] Completed onboarding sequence for user ${queuedEmail.userId}`);
      }
    } catch (error) {
      failed++;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      await db
        .update(emailSequenceQueue)
        .set({
          retryCount: queuedEmail.retryCount + 1,
          errorMessage,
          status: queuedEmail.retryCount >= 2 ? "failed" : "pending",
        })
        .where(eq(emailSequenceQueue.id, queuedEmail.id));

      console.error(`[InstantOnboarding] Failed to send ${queuedEmail.emailName} to ${queuedEmail.userEmail}: ${errorMessage}`);
    }
  }

  return { sent, failed };
}
