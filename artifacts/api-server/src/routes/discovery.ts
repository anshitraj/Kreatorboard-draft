import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { creatorProfilesTable } from "@workspace/db/schema";
import { eq, and, count, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/creators", async (req, res) => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 50);
    const offset = (pageNum - 1) * limitNum;

    const profiles = await db
      .select()
      .from(creatorProfilesTable)
      .where(eq(creatorProfilesTable.isPublic, true))
      .limit(limitNum)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(creatorProfilesTable)
      .where(eq(creatorProfilesTable.isPublic, true));

    res.json({
      items: profiles.map((p) => ({
        handle: p.handle,
        displayName: p.displayName,
        bio: p.bio,
        avatarUrl: p.avatarUrl,
        bannerUrl: p.bannerUrl,
        location: p.location,
        niches: p.niches as string[],
        ecosystems: p.ecosystems as string[],
        languages: p.languages as string[],
        website: p.website,
        calComLink: p.calComLink,
        socialLinks: [],
        services: [],
        portfolio: [],
        openToCollaboration: p.openToCollaboration,
        connectedWalletAddress: null,
      })),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error({ err }, "Discovery error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
