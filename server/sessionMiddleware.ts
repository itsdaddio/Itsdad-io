/**
 * server/sessionMiddleware.ts
 *
 * Cookie-based session middleware for itsdad.io.
 *
 * Reads the `itsdad_session` cookie from incoming requests, looks up the
 * session in the `sessions` table, and populates `req.session.userId` for
 * downstream handlers (referral.ts, products.ts, etc.).
 *
 * Session lifecycle:
 *   - Created after Stripe checkout (webhook-stripe.ts) or email-based login
 *   - Stored in the `sessions` table with a 30-day expiry
 *   - Cookie is HttpOnly, Secure, SameSite=Lax for security
 *   - Expired sessions are cleaned up on read
 */

import { Request, Response, NextFunction } from "express";
import { getDb } from "./db";
import { sessions } from "../drizzle/schema";
import { eq, and, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// ─── Constants ───────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = "itsdad_session";
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ─── Types ───────────────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      session?: {
        userId: number;
        sessionId: string;
      };
    }
  }
}

// ─── Create Session ──────────────────────────────────────────────────────────

/**
 * Creates a new session for a user and returns the session ID.
 * Call this after successful authentication (Stripe checkout, email login).
 */
export async function createSession(userId: number): Promise<string | null> {
  const db = (await getDb()) as any;
  if (!db) return null;

  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  console.log(`[Session] Created session for userId=${userId} sessionId=${sessionId.slice(0, 8)}...`);
  return sessionId;
}

// ─── Set Session Cookie ──────────────────────────────────────────────────────

/**
 * Sets the session cookie on the response.
 */
export function setSessionCookie(res: Response, sessionId: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
    domain: isProduction ? ".itsdad.io" : undefined,
  });
}

// ─── Clear Session Cookie ────────────────────────────────────────────────────

export function clearSessionCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    domain: isProduction ? ".itsdad.io" : undefined,
  });
}

// ─── Session Middleware ──────────────────────────────────────────────────────

/**
 * Express middleware that reads the session cookie, validates it against
 * the database, and populates `req.session` with `{ userId, sessionId }`.
 *
 * If no valid session is found, `req.session` remains undefined — downstream
 * handlers decide whether to return 401 or allow anonymous access.
 */
export async function sessionMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (!sessionId) {
      next();
      return;
    }

    const db = (await getDb()) as any;
    if (!db) {
      next();
      return;
    }

    // Look up session — must exist and not be expired
    const [sessionRow] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, sessionId),
          gt(sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (sessionRow) {
      (req as any).session = {
        userId: sessionRow.userId,
        sessionId: sessionRow.id,
      };
    }
  } catch (err) {
    console.error("[Session] Middleware error:", err instanceof Error ? err.message : err);
  }

  next();
}
