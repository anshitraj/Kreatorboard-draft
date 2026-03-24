import { pgTable, text, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const collaborationsTable = pgTable("collaborations", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorUserId: uuid("creator_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email"),
  senderWallet: text("sender_wallet"),
  subject: text("subject").notNull(),
  description: text("description"),
  status: text("status").notNull().default("new"),
  budget: text("budget"),
  deadline: timestamp("deadline"),
  deliverables: jsonb("deliverables").notNull().default([]),
  labels: jsonb("labels").notNull().default([]),
  hasUnreadNotes: boolean("has_unread_notes").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const collaborationNotesTable = pgTable("collaboration_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  collaborationId: uuid("collaboration_id").notNull().references(() => collaborationsTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorUserId: uuid("author_user_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCollaborationSchema = createInsertSchema(collaborationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;
export type Collaboration = typeof collaborationsTable.$inferSelect;

export const insertCollaborationNoteSchema = createInsertSchema(collaborationNotesTable).omit({ id: true, createdAt: true });
export type InsertCollaborationNote = z.infer<typeof insertCollaborationNoteSchema>;
export type CollaborationNote = typeof collaborationNotesTable.$inferSelect;
