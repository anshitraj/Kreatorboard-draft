import { pgTable, text, boolean, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const integrationsTable = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  status: text("status").notNull().default("disconnected"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  scopes: jsonb("scopes").notNull().default([]),
  providerUserId: text("provider_user_id"),
  providerUserHandle: text("provider_user_handle"),
  providerUserName: text("provider_user_name"),
  metadata: jsonb("metadata").notNull().default({}),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncError: text("last_sync_error"),
  cooldownUntil: timestamp("cooldown_until"),
  syncMode: text("sync_mode").notNull().default("manual"),
  webhookId: text("webhook_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const walletsTable = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  chainId: integer("chain_id").notNull(),
  chainName: text("chain_name").notNull(),
  ensName: text("ens_name"),
  isPrimary: boolean("is_primary").notNull().default(false),
  label: text("label"),
  verified: boolean("verified").notNull().default(false),
  verificationSignature: text("verification_signature"),
  connectedAt: timestamp("connected_at").notNull().defaultNow(),
});

export const insertIntegrationSchema = createInsertSchema(integrationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrationsTable.$inferSelect;

export const insertWalletSchema = createInsertSchema(walletsTable).omit({ id: true });
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof walletsTable.$inferSelect;
