/**
 * client/src/pages/RefCapture.tsx
 *
 * Its Dad LLC — Referral Link Landing Page
 *
 * Handles the /ref/:code route used by Alliance members when sharing their link.
 *
 * Flow:
 *   1. Reads the referral code from the URL param (/ref/DAD-XXXXXXXX)
 *   2. Stores it in a 30-day cookie (itsdad_ref) so it persists through checkout
 *   3. Also stores in sessionStorage as a backup
 *   4. Redirects to /memberships?invited=1&ref=CODE with a branded banner
 *
 * Route: /ref/:code
 */
import { useEffect } from "react";
import { useParams, useLocation } from "wouter";

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export default function RefCapture() {
  const params = useParams<{ code: string }>();
  const [, setLocation] = useLocation();
  const code = params.code ?? "";

  useEffect(() => {
    if (code) {
      setCookie("itsdad_ref", code, 30);
      sessionStorage.setItem("itsdad_ref", code);
    }
    const dest = code
      ? `/memberships?invited=1&ref=${encodeURIComponent(code)}`
      : "/memberships";
    setLocation(dest);
  }, [code, setLocation]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="text-white text-lg font-semibold">Taking you to the table…</p>
        <p className="text-slate-400 text-sm mt-2">Your invite is confirmed.</p>
      </div>
    </div>
  );
}
