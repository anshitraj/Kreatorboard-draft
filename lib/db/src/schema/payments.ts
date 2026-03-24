import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { walletsTable } from "./integrations";

export const paymentRequestsTable = pgTable("payment_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  walletId: uuid("wallet_id").references(() => walletsTable.id),
  title: text("title").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("USDC"),
  toAddress: text("to_address").notNull(),
  fromAddress: text("from_address"),
  status: text("status").notNull().default("pending"),
  paymentLink: text("payment_link"),
  serviceId: uuid("service_id"),
  notes: text("notes"),
  isManuallyLogged: boolean("is_manually_logged").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const insertPaymentRequestSchema = createInsertSchema(paymentRequestsTable).omit({ id: true, createdAt: true });
export type InsertPaymentRequest = z.infer<typeof insertPaymentRequestSchema>;
export type PaymentRequest = typeof paymentRequestsTable.$inferSelect;
