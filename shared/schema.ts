import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const monitors = sqliteTable("monitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  lastChecked: text("last_checked"),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  monitorId: integer("monitor_id").notNull(),
  title: text("title").notNull(),
  link: text("link").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  postedAt: text("posted_at"),
  guid: text("guid").notNull().unique(), // The RSS item guide to prevent duplicates
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

export const monitorsRelations = relations(monitors, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  monitor: one(monitors, {
    fields: [items.monitorId],
    references: [monitors.id],
  }),
}));

export const insertMonitorSchema = createInsertSchema(monitors).omit({ id: true, lastChecked: true });
export const insertItemSchema = createInsertSchema(items).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

export type Monitor = typeof monitors.$inferSelect;
export type InsertMonitor = z.infer<typeof insertMonitorSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type CreateMonitorRequest = InsertMonitor;
export type UpdateMonitorRequest = Partial<InsertMonitor> & { lastChecked?: string | Date | null };
export type CreateItemRequest = Omit<InsertItem, 'postedAt'> & { postedAt?: string | Date | null };

export type MonitorResponse = Monitor;
export type MonitorsListResponse = Monitor[];
export type ItemResponse = Item;
export type ItemsListResponse = Item[];
