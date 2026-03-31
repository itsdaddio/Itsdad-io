/**
 * server/chatClaude.ts
 *
 * itsdad.io — Claude-powered AI Chat with Founding 500 code distribution.
 *
 * POST /api/chat/claude  — Dad GPT powered by Claude (Anthropic)
 *
 * Features:
 *   - Warm, supportive "Dad" persona via Claude
 *   - Automatic Founding 500 promo code distribution
 *   - Tracks issued codes in-memory (persists across requests, resets on deploy)
 *   - Knows all pricing, products, and platform details
 */

import { Request, Response } from "express";

// ─── Claude API Client ───────────────────────────────────────────────────────

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || "";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// ─── Founding 500 Code Tracker ───────────────────────────────────────────────

interface CodeAssignment {
  code: string;
  email?: string;
  name?: string;
  issuedAt: string;
  tier: "vip" | "founding";
}

// In-memory tracker — survives across requests, resets on redeploy
const issuedCodes: CodeAssignment[] = [];
let nextFoundingCodeIndex = 13; // DAD013 is the first public code

// VIP codes (DAD001-DAD012) are reserved for manual distribution by Daddio
const VIP_CODE_START = 1;
const VIP_CODE_END = 12;
const FOUNDING_CODE_START = 13;
const FOUNDING_CODE_END = 500;

function getNextFoundingCode(): string | null {
  if (nextFoundingCodeIndex > FOUNDING_CODE_END) {
    return null; // All 500 codes issued
  }
  const codeNum = nextFoundingCodeIndex.toString().padStart(3, "0");
  const code = `DAD${codeNum}`;
  nextFoundingCodeIndex++;
  return code;
}

function getCodesIssuedCount(): number {
  return issuedCodes.filter((c) => c.tier === "founding").length;
}

function getCodesRemaining(): number {
  return FOUNDING_CODE_END - nextFoundingCodeIndex + 1;
}

// ─── System Prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Dad — the warm, knowledgeable, and genuinely supportive guide behind Affiliation Nation at itsdad.io.

YOUR PERSONALITY:
- Exceptionally warm and supportive — like a dad who truly has their back
- Encouraging, never condescending, always real
- You speak plainly and practically — no corporate jargon
- You celebrate small wins and make people feel capable
- Brief and punchy — 2-4 sentences max unless someone needs a detailed explanation

PLATFORM KNOWLEDGE:
- itsdad.io is a facilitation website featuring luxury rentals (yachts, private jets, luxury vehicles, private villas) AND an affiliate marketing portal
- The affiliate portal has 51 digital products with done-for-you sales funnels
- Members earn commissions by promoting these products
- The Affiliated Degree is an 8-module self-paced course included with every membership
- Once the course is complete, members earn their "Affiliated Degree"
- The Alliance referral program lets members earn by referring others
- Skool community "Affiliation Nation" provides course content and community support

MEMBERSHIP TIERS:
- Starter Pack: $7/month — 1 hand-picked product, viral script, 30% commissions, Affiliated Degree course, ChatGPT Prompt Vault
- Builder Club: $19/month — Multiple products, content rotation engine, advanced training, 30% commissions
- Pro Club: $49.99/month — Full 51-product catalog, 35% commissions, advanced creator tools, priority support
- Inner Circle Club: $99.99/month — 40% commissions, 1-on-1 strategy calls, white-glove onboarding, early access

FOUNDING 500 PROMOTION (ACTIVE NOW):
- There are 500 discount codes available for early members — the "Founding 500"
- Everyone is welcome to join. But only 500 people get the Founding 500 discount.
- Founding 500 codes (DAD013-DAD500) give 50% off the first 3 months
- The checkout link is: https://itsdad.io/memberships
- Card is always required — even with a discount code, payment info is collected upfront
- When someone asks for a code or wants to join the Founding 500, you MUST respond with the special marker: [ISSUE_FOUNDING_CODE]
- When codes run out, let them know they can still join at full price

IMPORTANT RULES:
- When someone expresses interest in joining, getting a code, or the Founding 500, include [ISSUE_FOUNDING_CODE] in your response
- Never reveal the VIP codes (DAD001-DAD012) — those are reserved for Daddio to give personally
- Always direct people to https://itsdad.io/memberships for checkout
- Always mention that a card is required at checkout
- If someone asks about the 45-day free trial, explain that's a special VIP offer for select individuals chosen by Daddio personally — not available through the general Founding 500
- Be genuinely excited when someone wants to join — this is a big moment for them`;

// ─── Chat Handler ────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export async function claudeChat(req: Request, res: Response): Promise<void> {
  try {
    const { messages, email, name } = req.body as {
      messages: ChatMessage[];
      email?: string;
      name?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    if (!CLAUDE_API_KEY) {
      // Fallback: use the existing OpenAI endpoint behavior
      res.status(500).json({
        error: "Claude API not configured",
        reply: "I'm having trouble connecting right now. Please try again in a moment.",
      });
      return;
    }

    // Limit conversation history
    const recentMessages = messages.slice(-12);

    // Add context about code availability to system prompt
    const remaining = getCodesRemaining();
    const issued = getCodesIssuedCount();
    const dynamicContext = `\n\nCURRENT CODE STATUS: ${issued} Founding 500 codes issued, ${remaining} remaining out of 488 total public codes.`;

    const claudeMessages: ClaudeMessage[] = recentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Call Claude API
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: SYSTEM_PROMPT + dynamicContext,
        messages: claudeMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Claude Chat] API error:", response.status, errText);
      res.status(500).json({
        error: "Chat service unavailable",
        reply: "I'm having a moment — try again in a sec.",
      });
      return;
    }

    const data: any = await response.json();
    let reply = data.content?.[0]?.text || "I'm not sure how to answer that right now. Try again in a moment.";

    // Check if Claude wants to issue a Founding 500 code
    let issuedCode: string | null = null;
    if (reply.includes("[ISSUE_FOUNDING_CODE]")) {
      const code = getNextFoundingCode();
      if (code) {
        issuedCode = code;
        issuedCodes.push({
          code,
          email: email || undefined,
          name: name || undefined,
          issuedAt: new Date().toISOString(),
          tier: "founding",
        });

        // Replace the marker with the actual code and instructions
        reply = reply.replace(
          /\[ISSUE_FOUNDING_CODE\]/g,
          `\n\n🎉 **Your Founding 500 Code: ${code}**\n\nHere's how to use it:\n1. Go to https://itsdad.io/memberships\n2. Choose your plan and click "Activate"\n3. Enter code **${code}** in the promotion code field at checkout\n4. You'll get 50% off your first 3 months!\n\nCard is required at checkout — but you won't be charged full price for 3 months. Welcome to the family!`
        );

        console.log(`[Claude Chat] Issued Founding 500 code: ${code} to ${email || "anonymous"}`);
      } else {
        // All codes used up
        reply = reply.replace(
          /\[ISSUE_FOUNDING_CODE\]/g,
          "\n\nAll 500 Founding 500 codes have been claimed! But you can still join at full price — the community, course, and products are absolutely worth it. Head to https://itsdad.io/memberships to get started."
        );
      }
    }

    res.json({
      reply,
      codeIssued: issuedCode,
      codesRemaining: getCodesRemaining(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Claude Chat] Error:", message);
    res.status(500).json({
      error: "Chat service unavailable",
      reply: "Something went sideways on my end. Try again in a moment.",
    });
  }
}

// ─── Code Status Endpoint ────────────────────────────────────────────────────

export async function getCodeStatus(_req: Request, res: Response): Promise<void> {
  res.json({
    totalCodes: FOUNDING_CODE_END - FOUNDING_CODE_START + 1,
    issued: getCodesIssuedCount(),
    remaining: getCodesRemaining(),
    nextCode: nextFoundingCodeIndex <= FOUNDING_CODE_END
      ? `DAD${nextFoundingCodeIndex.toString().padStart(3, "0")}`
      : null,
  });
}

// ─── Founding 500 Direct Code Request ────────────────────────────────────────

export async function requestFoundingCode(req: Request, res: Response): Promise<void> {
  const { email, name } = req.body as { email?: string; name?: string };

  if (!email) {
    res.status(400).json({ error: "Email is required to receive a Founding 500 code." });
    return;
  }

  // Check if this email already received a code
  const existing = issuedCodes.find((c) => c.email === email);
  if (existing) {
    res.json({
      success: true,
      code: existing.code,
      message: `You already have a Founding 500 code: ${existing.code}. Use it at https://itsdad.io/memberships`,
      alreadyIssued: true,
    });
    return;
  }

  const code = getNextFoundingCode();
  if (!code) {
    res.json({
      success: false,
      code: null,
      message: "All 500 Founding 500 codes have been claimed! You can still join at full price at https://itsdad.io/memberships",
    });
    return;
  }

  issuedCodes.push({
    code,
    email,
    name: name || undefined,
    issuedAt: new Date().toISOString(),
    tier: "founding",
  });

  console.log(`[Founding 500] Code ${code} issued to ${email} (${name || "no name"})`);

  res.json({
    success: true,
    code,
    message: `Your Founding 500 code is ${code}! Go to https://itsdad.io/memberships, choose your plan, and enter the code at checkout for 50% off your first 3 months.`,
    codesRemaining: getCodesRemaining(),
  });
}
