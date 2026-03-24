import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { syncJobsTable } from "@workspace/db/schema";
import { eq, count, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/jobs", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const [jobs, [{ total }]] = await Promise.all([
      db.select().from(syncJobsTable)
        .where(eq(syncJobsTable.userId, req.user!.id))
        .orderBy(desc(syncJobsTable.createdAt))
        .limit(limitNum)
        .offset(offset),
      db.select({ total: count() }).from(syncJobsTable)
        .where(eq(syncJobsTable.userId, req.user!.id)),
    ]);

    res.json({
      items: jobs.map((j) => ({
        id: j.id,
        provider: j.provider,
        jobType: j.jobType,
        status: j.status,
        startedAt: j.startedAt?.toISOString() || null,
        completedAt: j.completedAt?.toISOString() || null,
        errorMessage: j.errorMessage,
        retryCount: j.retryCount,
        createdAt: j.createdAt.toISOString(),
      })),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Get sync jobs error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
