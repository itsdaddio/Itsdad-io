/**
 * server/db.ts
 *
 * Database connection singleton for Its Dad LLC.
 * Uses Drizzle ORM with a MySQL/TiDB-compatible driver.
 * Returns null gracefully if DATABASE_URL is not configured,
 * allowing the server to start without crashing in dev/test environments.
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import * as emailSchema from "../drizzle/schema-email-sequences";
import * as referralSchema from "../drizzle/schema-referral";

// Merge all schema tables for full Drizzle type inference
const fullSchema = { ...schema, ...emailSchema, ...referralSchema };

type DrizzleDb = ReturnType<typeof drizzle<typeof fullSchema>>;

let db: DrizzleDb | null = null;
let connectionPool: mysql.Pool | null = null;

/**
 * Returns the Drizzle database instance.
 * Creates the connection pool on first call (lazy initialization).
 * Returns null if DATABASE_URL is not set.
 */
export async function getDb(): Promise<DrizzleDb | null> {
  if (db) return db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("[DB] DATABASE_URL not set — database features are disabled.");
    return null;
  }

  try {
    connectionPool = mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    db = drizzle(connectionPool, { schema: fullSchema, mode: "default" }) as unknown as DrizzleDb;

    console.log("[DB] Database connection pool initialized.");
    return db;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[DB] Failed to initialize database connection: ${message}`);
    return null;
  }
}

/**
 * Gracefully closes the database connection pool.
 * Call this during server shutdown.
 */
export async function closeDb(): Promise<void> {
  if (connectionPool) {
    await connectionPool.end();
    connectionPool = null;
    db = null;
    console.log("[DB] Database connection pool closed.");
  }
}
