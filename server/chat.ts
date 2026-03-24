/**
 * server/chat.ts
 *
 * itsdad.io — Chat API endpoints for Dad GPT and Support Bot.
 *
 * POST /api/chat/dad-gpt   — Dad GPT affiliate marketing guide
 * POST /api/chat/support   — Customer support assistant
 *
 * Both use OpenAI GPT-4o-mini for fast, cost-effective responses.
 * System prompts are passed from the client to keep persona logic frontend-owned.
 */

import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  systemPrompt?: string;
}

/**
 * Shared chat handler used by both Dad GPT and Support endpoints.
 */
async function handleChat(req: Request, res: Response): Promise<void> {
  try {
    const { messages, systemPrompt } = req.body as ChatRequestBody;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    // Limit conversation history to last 10 messages to control token usage
    const recentMessages = messages.slice(-10);

    const chatMessages: ChatMessage[] = [
      ...(systemPrompt
        ? [{ role: "system" as const, content: systemPrompt }]
        : []),
      ...recentMessages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm not sure how to answer that right now. Try again in a moment.";

    res.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Chat] Error:", message);
    res.status(500).json({
      error: "Chat service unavailable",
      reply: "I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
}

export const dadGptChat = handleChat;
export const supportChat = handleChat;
