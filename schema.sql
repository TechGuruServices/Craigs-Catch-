-- CraigsCatch D1 Database Schema
-- Run via: npx wrangler d1 execute craigs-catch-db --file=./schema.sql

CREATE TABLE IF NOT EXISTS monitors (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  url        TEXT    NOT NULL,
  active     INTEGER NOT NULL DEFAULT 1,
  last_checked TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  monitor_id INTEGER NOT NULL,
  title      TEXT    NOT NULL,
  link       TEXT    NOT NULL,
  description TEXT,
  posted_at  TEXT,
  guid       TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  role       TEXT    NOT NULL CHECK(role IN ('user', 'assistant')),
  content    TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
