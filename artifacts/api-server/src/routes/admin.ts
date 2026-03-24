import { Router, type IRouter } from "express";
import { requireAuth, requireRole, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { usersTable, integrationsTable, syncJobsTable } from "@workspace/db/schema";
import { eq, count, sql } from "drizzle-orm";

const router: IRouter = Router();

const adminMiddleware = [requireAuth, requireRole("admin")];

router.get("/users", ...adminMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const [users, [{ total }]] = await Promise.all([
      db.select().from(usersTable).limit(limitNum).offset(offset),
      db.select({ total: count() }).from(usersTable),
    ]);

    res.json({
      items: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        role: u.role,
        onboardingStep: u.onboardingStep,
        onboardingComplete: u.onboardingComplete,
        createdAt: u.createdAt.toISOString(),
      })),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Admin get users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sync-health", ...adminMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const [totalJobs, failedJobs, deadLetterJobs] = await Promise.all([
      db.select({ total: count() }).from(syncJobsTable).then(([r]) => r.total),
      db.select({ total: count() }).from(syncJobsTable)
        .where(eq(syncJobsTable.status, "failed")).then(([r]) => r.total),
      db.select({ total: count() }).from(syncJobsTable)
        .where(eq(syncJobsTable.status, "dead_letter")).then(([r]) => r.total),
    ]);

    const integrationStats = await db
      .select({
        provider: integrationsTable.provider,
        status: integrationsTable.status,
      })
      .from(integrationsTable);

    const providerMap = new Map<string, { total: number; connected: number; lastSuccess: Date | null }>();
    for (const row of integrationStats) {
      if (!providerMap.has(row.provider)) {
        providerMap.set(row.provider, { total: 0, connected: 0, lastSuccess: null });
      }
      const entry = providerMap.get(row.provider)!;
      entry.total++;
      if (row.status === "connected") entry.connected++;
    }

    const providerHealth = Array.from(providerMap.entries()).map(([provider, stats]) => ({
      provider,
      successRate: stats.total > 0 ? stats.connected / stats.total : 0,
      lastSuccess: null,
      activeConnections: stats.connected,
    }));

    res.json({
      totalJobs,
      failedJobs,
      deadLetterJobs,
      avgJobDurationMs: 0,
      providerHealth,
    });
  } catch (err) {
    req.log.error({ err }, "Admin sync health error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/integrations", ...adminMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const integrations = await db
      .select({
        userId: integrationsTable.userId,
        provider: integrationsTable.provider,
        status: integrationsTable.status,
        lastSyncAt: integrationsTable.lastSyncAt,
        lastSyncError: integrationsTable.lastSyncError,
        email: usersTable.email,
      })
      .from(integrationsTable)
      .leftJoin(usersTable, eq(integrationsTable.userId, usersTable.id))
      .limit(100);

    res.json(integrations.map((i) => ({
      userId: i.userId,
      userEmail: i.email || "unknown",
      provider: i.provider,
      status: i.status,
      lastSyncAt: i.lastSyncAt?.toISOString() || null,
      errorMessage: i.lastSyncError,
    })));
  } catch (err) {
    req.log.error({ err }, "Admin integrations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
