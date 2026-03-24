import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { collaborationsTable, collaborationNotesTable, creatorProfilesTable } from "@workspace/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = db
      .select()
      .from(collaborationsTable)
      .where(eq(collaborationsTable.creatorUserId, req.user!.id))
      .orderBy(desc(collaborationsTable.createdAt))
      .limit(limitNum)
      .offset(offset);

    const items = await query;
    const [{ total }] = await db
      .select({ total: count() })
      .from(collaborationsTable)
      .where(eq(collaborationsTable.creatorUserId, req.user!.id));

    res.json({
      items: items.map((c) => ({
        id: c.id,
        senderName: c.senderName,
        senderEmail: c.senderEmail,
        subject: c.subject,
        status: c.status,
        budget: c.budget,
        deadline: c.deadline?.toISOString() || null,
        createdAt: c.createdAt.toISOString(),
        hasUnreadNotes: c.hasUnreadNotes,
      })),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Get inbox error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const collab = await db
      .select()
      .from(collaborationsTable)
      .where(and(eq(collaborationsTable.id, req.params.id), eq(collaborationsTable.creatorUserId, req.user!.id)))
      .limit(1)
      .then((r) => r[0]);

    if (!collab) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const notes = await db
      .select()
      .from(collaborationNotesTable)
      .where(eq(collaborationNotesTable.collaborationId, collab.id))
      .orderBy(collaborationNotesTable.createdAt);

    await db
      .update(collaborationsTable)
      .set({ hasUnreadNotes: false, updatedAt: new Date() })
      .where(eq(collaborationsTable.id, collab.id));

    res.json({
      ...collab,
      deadline: collab.deadline?.toISOString() || null,
      deliverables: collab.deliverables as string[],
      labels: collab.labels as string[],
      createdAt: collab.createdAt.toISOString(),
      updatedAt: collab.updatedAt.toISOString(),
      notes: notes.map((n) => ({
        id: n.id,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Get collaboration error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, note, labels, deliverables, budget, deadline } = req.body;
    const updates: any = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (labels) updates.labels = labels;
    if (deliverables) updates.deliverables = deliverables;
    if (budget) updates.budget = budget;
    if (deadline) updates.deadline = new Date(deadline);

    const [collab] = await db
      .update(collaborationsTable)
      .set(updates)
      .where(and(eq(collaborationsTable.id, req.params.id), eq(collaborationsTable.creatorUserId, req.user!.id)))
      .returning();

    if (!collab) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    if (note) {
      await db.insert(collaborationNotesTable).values({
        collaborationId: collab.id,
        content: note,
        authorUserId: req.user!.id,
      });
    }

    const notes = await db
      .select()
      .from(collaborationNotesTable)
      .where(eq(collaborationNotesTable.collaborationId, collab.id));

    res.json({
      ...collab,
      deadline: collab.deadline?.toISOString() || null,
      deliverables: collab.deliverables as string[],
      labels: collab.labels as string[],
      createdAt: collab.createdAt.toISOString(),
      updatedAt: collab.updatedAt.toISOString(),
      notes: notes.map((n) => ({
        id: n.id,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Update collaboration error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/request", async (req, res) => {
  try {
    const { creatorHandle, senderName, senderEmail, senderWallet, subject, description, budget, deadline, deliverables } = req.body;

    if (!creatorHandle || !senderName || !subject) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const profile = await db
      .select()
      .from(creatorProfilesTable)
      .where(eq(creatorProfilesTable.handle, creatorHandle))
      .limit(1)
      .then((r) => r[0]);

    if (!profile) {
      res.status(404).json({ error: "Creator not found" });
      return;
    }

    const [collab] = await db
      .insert(collaborationsTable)
      .values({
        creatorUserId: profile.userId,
        senderName,
        senderEmail: senderEmail || null,
        senderWallet: senderWallet || null,
        subject,
        description: description || null,
        budget: budget || null,
        deadline: deadline ? new Date(deadline) : null,
        deliverables: deliverables || [],
        status: "new",
        hasUnreadNotes: true,
      })
      .returning();

    res.status(201).json({
      ...collab,
      deadline: collab.deadline?.toISOString() || null,
      deliverables: collab.deliverables as string[],
      labels: collab.labels as string[],
      createdAt: collab.createdAt.toISOString(),
      updatedAt: collab.updatedAt.toISOString(),
      notes: [],
    });
  } catch (err) {
    req.log.error({ err }, "Submit collaboration request error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
