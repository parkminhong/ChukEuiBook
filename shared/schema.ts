import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const guests = pgTable("guests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  side: text("side").notNull(), // "신랑" or "신부"
  relationship: text("relationship").notNull(), // "친구", "직장", "가족/친척", "지인/기타"
  tickets: integer("tickets").notNull().default(0),
  memo: text("memo"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  timezone: text("timezone"),
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  timestamp: true,
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;

// Additional types for frontend
export type Language = 'ko' | 'en' | 'ja' | 'zh';
export type ColorTheme = 'classic-blue' | 'wedding-rose' | 'elegant-purple' | 'modern-green' | 'luxury-gold';
export type Relationship = '친구' | '직장' | '가족/친척' | '지인/기타';
export type Side = '신랑' | '신부';
