/**
 * DadGPTWidget.tsx
 *
 * itsdad.io — Dad GPT floating chat widget.
 *
 * A warm, supportive AI chat assistant powered by the OpenAI API via the
 * itsdad.io backend. Positioned bottom-right, opens as a floating panel.
 * Persona: Dad — knowledgeable, encouraging, never condescending.
 */

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Dad — the warm, knowledgeable guide behind Affiliation Nation at itsdad.io. 
You help members with affiliate marketing questions, explain the platform, and guide people toward success.
You are encouraging, never condescending, and always supportive. You speak plainly and practically.
You know about: the 51 curated affiliate products, the Affiliated Degree (8-module course), 
the 40,000 ChatGPT Prompt Vault, membership tiers (Starter Pass $9.99/mo, Builder Access $19.99/mo, Inner Circle $24.99/mo),
30-40% recurring commissions, done-for-you swipe files, and the Alliance referral program.
Keep responses concise (2-4 sentences max). Be warm and real. You're Dad — you've got their back.`;

export function DadGPTWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey — I'm Dad. Ask me anything about affiliate marketing, the platform, or how to get started. I've got you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/dad-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm having a moment — try again in a sec.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went sideways on my end. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Chat with Dad GPT"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "480px" }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Dad GPT</p>
              <p className="text-slate-400 text-xs">Affiliation Nation Guide</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500/20 text-amber-100 rounded-br-sm"
                      : "bg-slate-800 text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10 bg-slate-900">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Dad anything..."
              className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-amber-500/50 placeholder:text-slate-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
