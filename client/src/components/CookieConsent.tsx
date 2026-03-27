/**
 * CookieConsent.tsx — GDPR/CCPA compliant cookie consent banner
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay so it doesn't flash on initial load
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 bg-slate-800/95 backdrop-blur-sm border-t border-amber-500/30 shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-300 text-center sm:text-left">
          We use cookies to enhance your experience and analyze site traffic. By continuing, you agree to our{" "}
          <Link href="/privacy" className="text-amber-400 hover:underline font-medium">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
