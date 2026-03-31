/**
 * DadGPTWidget.tsx
 *
 * itsdad.io — Dad GPT floating chat widget powered by Claude.
 *
 * A warm, supportive AI chat assistant that can:
 * - Answer questions about affiliate marketing and the platform
 * - Distribute Founding 500 promo codes automatically
 * - Guide users to checkout with their code
 *
 * Positioned bottom-right, opens as a floating panel.
 * Persona: Dad — knowledgeable, encouraging, never condescending.
 */

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  codeIssued?: string | null;
}

export function DadGPTWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey — I'm Dad. Welcome to itsdad.io! Ask me anything about affiliate marketing, the platform, or how to get started. I've got you. 💛\n\nLooking for a Founding 500 code? Just ask!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [codesRemaining, setCodesRemaining] = useState<number | null>(null);
  const [hasReceivedCode, setHasReceivedCode] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
      setShowPulse(false);
    }
  }, [open, messages]);

  // Pulse the chat button every 30 seconds if not opened
  useEffect(() => {
    if (!open && showPulse) {
      const timer = setInterval(() => {
        setShowPulse((v) => !v);
        setTimeout(() => setShowPulse(true), 2000);
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [open, showPulse]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const reply =
        data.reply || "I'm having a moment — try again in a sec.";

      if (data.codesRemaining !== undefined) {
        setCodesRemaining(data.codesRemaining);
      }

      if (data.codeIssued) {
        setHasReceivedCode(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          codeIssued: data.codeIssued || null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went sideways on my end. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Render message content with basic markdown-like formatting
  function renderContent(content: string) {
    return content.split("\n").map((line, i) => {
      // Bold text
      const formatted = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-amber-400">$1</strong>'
      );
      if (line.trim() === "") return <br key={i} />;
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{ __html: formatted }}
          className="block"
        />
      );
    });
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 transition-all ${
          showPulse && !open ? "animate-bounce" : ""
        }`}
        aria-label="Chat with Dad GPT"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Notification badge when not open */}
      {!open && !hasReceivedCode && (
        <div className="fixed bottom-[72px] right-6 z-50 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
          Founding 500
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm flex items-center gap-1">
                Dad GPT
                <Sparkles className="w-3 h-3 text-amber-400" />
              </p>
              <p className="text-slate-400 text-xs">
                Affiliation Nation Guide
              </p>
            </div>
            <div className="flex items-center gap-2">
              {codesRemaining !== null && (
                <span className="text-xs text-amber-400/80 font-medium">
                  {codesRemaining} codes left
                </span>
              )}
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500/20 text-amber-100 rounded-br-sm"
                      : msg.codeIssued
                      ? "bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/30 text-slate-200 rounded-bl-sm"
                      : "bg-slate-800 text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {renderContent(msg.content)}
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

          {/* Quick actions */}
          {messages.length <= 2 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {[
                "I want a Founding 500 code!",
                "What is Affiliation Nation?",
                "How do I earn commissions?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      const fakeEvent = { key: "Enter" } as React.KeyboardEvent;
                      if (fakeEvent.key === "Enter") {
                        setMessages((prev) => [
                          ...prev,
                          { role: "user", content: q },
                        ]);
                        setInput("");
                        setLoading(true);
                        fetch("/api/chat/claude", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            messages: [
                              ...messages,
                              { role: "user", content: q },
                            ].map((m) => ({
                              role: m.role,
                              content: m.content,
                            })),
                          }),
                        })
                          .then((r) => r.json())
                          .then((data) => {
                            const reply =
                              data.reply ||
                              "I'm having a moment — try again in a sec.";
                            if (data.codesRemaining !== undefined)
                              setCodesRemaining(data.codesRemaining);
                            if (data.codeIssued) setHasReceivedCode(true);
                            setMessages((prev) => [
                              ...prev,
                              {
                                role: "assistant",
                                content: reply,
                                codeIssued: data.codeIssued || null,
                              },
                            ]);
                          })
                          .catch(() => {
                            setMessages((prev) => [
                              ...prev,
                              {
                                role: "assistant",
                                content:
                                  "Something went sideways. Try again in a moment.",
                              },
                            ]);
                          })
                          .finally(() => setLoading(false));
                      }
                    }, 50);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

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
