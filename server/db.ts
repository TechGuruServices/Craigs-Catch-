import * as schema from "@shared/schema";
import Database from "better-sqlite3";
import * as dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/better-sqlite3";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite, { schema });
