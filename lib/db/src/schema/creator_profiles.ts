import { pgTable, text, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const creatorProfilesTable = pgTable("creator_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  handle: text("handle").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  location: text("location"),
  timezone: text("timezone"),
  website: text("website"),
  niches: jsonb("niches").notNull().default([]),
  ecosystems: jsonb("ecosystems").notNull().default([]),
  languages: jsonb("languages").notNull().default([]),
  isPublic: boolean("is_public").notNull().default(false),
  openToCollaboration: boolean("open_to_collaboration").notNull().default(true),
  profileCompleteness: integer("profile_completeness").notNull().default(0),
  calComLink: text("cal_com_link"),
  linktreeUrl: text("linktree_url"),
  twitterHandle: text("twitter_handle"),
  discordHandle: text("discord_handle"),
  telegramHandle: text("telegram_handle"),
  mediaKitUrl: text("media_kit_url"),
  publicPageUrl: text("public_page_url"),
  summaryGeneratedAt: timestamp("summary_generated_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCreatorProfileSchema = createInsertSchema(creatorProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCreatorProfile = z.infer<typeof insertCreatorProfileSchema>;
export type CreatorProfile = typeof creatorProfilesTable.$inferSelect;
