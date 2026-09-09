import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: postgres.Sql | null = null;
let db: PostgresJsDatabase<typeof schema> | null = null;

/**
 * Returns a lazy singleton Drizzle client with Postgres.js.
 * Fail-soft: if DATABASE_URL is not set or initialization fails, returns null.
 */
export function getDb(): PostgresJsDatabase<typeof schema> | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === '') {
    return null;
  }

  if (!db) {
    try {
      // prepare: false is required for Supabase transaction mode pooler (DEC-001)
      client = postgres(url, { prepare: false });
      db = drizzle(client, { schema });
    } catch {
      return null;
    }
  }

  return db;
}

export type DbType = PostgresJsDatabase<typeof schema>;
