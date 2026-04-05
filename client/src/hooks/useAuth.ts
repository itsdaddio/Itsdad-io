/**
 * client/src/hooks/useAuth.ts
 *
 * Authentication hook for itsdad.io.
 *
 * Provides:
 *   - user: current authenticated user info (or null)
 *   - loading: whether auth state is being fetched
 *   - authenticated: boolean shorthand
 *   - login(email): email-based login
 *   - logout(): destroy session
 *   - autoLoginFromStripe(stripeSessionId): auto-login after checkout
 *   - refresh(): re-fetch current user
 */

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  tier: string;
  status: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  autoLoginFromStripe: (stripeSessionId: string) => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setError(null);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setError(null);
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed." };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }, []);

  const logoutFn = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors — clear local state anyway
    }
    setUser(null);
  }, []);

  const autoLoginFromStripe = useCallback(async (stripeSessionId: string) => {
    try {
      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stripeSessionId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setError(null);
        return { success: true };
      }
      return { success: false, error: data.error || "Auto-login failed." };
    } catch {
      return { success: false, error: "Network error during auto-login." };
    }
  }, []);

  return {
    user,
    loading,
    authenticated: !!user,
    error,
    login,
    logout: logoutFn,
    autoLoginFromStripe,
    refresh: fetchMe,
  };
}
