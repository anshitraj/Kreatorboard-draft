import { pgTable, text, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const socialAccountsTable = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  displayName: text("display_name"),
  profileUrl: text("profile_url"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  followerCount: integer("follower_count"),
  followingCount: integer("following_count"),
  isEstimated: boolean("is_estimated").notNull().default(false),
  dataSource: text("data_source").notNull().default("manual"),
  status: text("status").notNull().default("active"),
  metadata: jsonb("metadata").notNull().default({}),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const metricSnapshotsTable = pgTable("metric_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  followerCount: integer("follower_count"),
  isEstimated: boolean("is_estimated").notNull().default(false),
  dataSource: text("data_source").notNull(),
  rawPayload: jsonb("raw_payload"),
  snapshotAt: timestamp("snapshot_at").notNull().defaultNow(),
});

export const insertSocialAccountSchema = createInsertSchema(socialAccountsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type SocialAccount = typeof socialAccountsTable.$inferSelect;
