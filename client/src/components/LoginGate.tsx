/**
 * client/src/components/LoginGate.tsx
 *
 * Wraps protected pages (Alliance, Affiliate-ly, etc.) with an
 * email-based login gate. If the user is not authenticated, shows
 * a clean login form. If authenticated, renders children.
 *
 * Design: Royal gold on dark slate, consistent with itsdad.io brand.
 */

import { useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface LoginGateProps {
  children: ReactNode;
  /** Optional message shown above the login form */
  message?: string;
}

export default function LoginGate({ children, message }: LoginGateProps) {
  const { user, loading, authenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoginLoading(true);
    setError(null);

    const result = await login(email.trim().toLowerCase());
    setLoginLoading(false);

    if (!result.success) {
      setError(result.error || "Login failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span style={{ color: "#D4AF37" }}>its</span>dad
            <span className="text-slate-500">.io</span>
          </h1>
          <p className="text-slate-400 text-sm">
            {message || "Sign in to access your member dashboard."}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">
            Enter the email you used when you signed up.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
              />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500/30"
              />
              <span className="text-slate-400 text-sm">Remember me</span>
            </label>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading || !email}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8962E)",
                color: "#0B0B0F",
              }}
            >
              {loginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/50 text-center">
            <p className="text-slate-500 text-xs">
              Don't have an account?{" "}
              <Link
                href="/memberships"
                className="font-semibold transition-colors"
                style={{ color: "#D4AF37" }}
              >
                Join a membership
              </Link>
            </p>
          </div>
        </div>

        {/* Help */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Need help?{" "}
          <a
            href="mailto:itsdad@itsdad.io"
            className="text-amber-500/70 hover:text-amber-400 transition-colors"
          >
            itsdad@itsdad.io
          </a>
        </p>
      </div>
    </div>
  );
}
