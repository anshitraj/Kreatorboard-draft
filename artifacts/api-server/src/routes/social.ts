import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { socialAccountsTable, metricSnapshotsTable, integrationsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await db
      .select()
      .from(socialAccountsTable)
      .where(eq(socialAccountsTable.userId, req.user!.id));
    res.json(accounts);
  } catch (err) {
    req.log.error({ err }, "Get social accounts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/metrics", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await db
      .select()
      .from(socialAccountsTable)
      .where(eq(socialAccountsTable.userId, req.user!.id));

    const platforms = accounts.map((a) => ({
      platform: a.platform,
      followers: a.followerCount,
      isEstimated: a.isEstimated,
      dataSource: a.dataSource,
      lastSyncAt: a.lastSyncAt?.toISOString() || null,
    }));

    const totalReach = accounts.reduce((sum, a) => sum + (a.followerCount || 0), 0);
    const hasEstimated = accounts.some((a) => a.isEstimated);

    res.json({
      totalReach: totalReach || null,
      isEstimated: hasEstimated,
      platforms,
      snapshotAt: new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Get metrics error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
