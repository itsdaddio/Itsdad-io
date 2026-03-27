/**
 * SupportWidget.tsx
 *
 * itsdad.io — Support Bot floating chat widget.
 *
 * A warm AI-powered customer support assistant. Positioned bottom-left.
 * Handles billing questions, account issues, and escalation to email support.
 * Persona: Friendly, calm, efficient support agent for Affiliation Nation.
 */

import { useState, useRef, useEffect } from "react";
import { HeadphonesIcon, X, Send, Loader2, Mail } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUPPORT_SYSTEM_PROMPT = `You are the Affiliation Nation support assistant at itsdad.io.
You provide warm, efficient customer service for members and visitors.
You handle: billing questions, account access issues, membership tier questions, 
commission tracking questions, refund policy (cancel anytime, no contracts), 
and general platform questions.
Key info: 
- Email support: itsdad@itsdad.io
- Memberships: Starter Pack ($7/mo), Builder Club ($19/mo), Pro Club ($49.99/mo), Inner Circle Club ($99.99/mo)
- All plans are monthly, cancel anytime — no trials, no contracts
- Commissions: Starter Pack & Builder Club 30%, Pro Club 35%, Inner Circle 40% recurring
- For complex billing issues, always offer to escalate to itsdad@itsdad.io
Keep responses brief (2-3 sentences). Be warm, calm, and solution-focused.`;

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm here to help with any questions about your account, billing, or the platform. What can I help you with?",
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
      const res = await fetch("/api/chat/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt: SUPPORT_SYSTEM_PROMPT,
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I'm having trouble connecting right now. Please email itsdad@itsdad.io and we'll get back to you quickly.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. For immediate help, email itsdad@itsdad.io — we respond within 24 hours.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button — bottom left */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Open Support Chat"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <HeadphonesIcon className="w-6 h-6 text-slate-300" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 left-6 z-50 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0">
              <HeadphonesIcon className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Support</p>
              <p className="text-slate-400 text-xs">Affiliation Nation Help</p>
            </div>
            <a
              href="mailto:itsdad@itsdad.io"
              className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              title="Email support"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Email us</span>
            </a>
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
                      ? "bg-slate-700 text-white rounded-br-sm"
                      : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
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
              placeholder="How can we help?"
              className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-700 focus:border-slate-500 placeholder:text-slate-500"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
