import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import {
  creatorProfilesTable,
  creatorServicesTable,
  portfolioItemsTable,
  collaborationsTable,
  integrationsTable,
  walletsTable,
  usersTable,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

function computeCompleteness(profile: any): number {
  let score = 0;
  if (profile.displayName) score += 10;
  if (profile.bio) score += 15;
  if (profile.avatarUrl) score += 10;
  if (profile.location) score += 5;
  if (profile.website) score += 5;
  if (Array.isArray(profile.niches) && profile.niches.length > 0) score += 10;
  if (Array.isArray(profile.ecosystems) && profile.ecosystems.length > 0) score += 10;
  if (profile.calComLink) score += 10;
  if (profile.twitterHandle || profile.discordHandle || profile.telegramHandle) score += 10;
  if (profile.isPublic) score += 15;
  return Math.min(score, 100);
}

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await db
      .select()
      .from(creatorProfilesTable)
      .where(eq(creatorProfilesTable.userId, req.user!.id))
      .limit(1)
      .then((r) => r[0]);

    if (!profile) {
      res.status(404).json({ error: "not_found", message: "Profile not found" });
      return;
    }

    res.json({
      ...profile,
      niches: profile.niches as string[],
      ecosystems: profile.ecosystems as string[],
      languages: profile.languages as string[],
    });
  } catch (err) {
    req.log.error({ err }, "Get profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const updates = req.body;
    const existing = await db
      .select()
      .from(creatorProfilesTable)
      .where(eq(creatorProfilesTable.userId, req.user!.id))
      .limit(1)
      .then((r) => r[0]);

    if (!existing) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    const merged = { ...existing, ...updates };
    const completeness = computeCompleteness(merged);

    const [updated] = await db
      .update(creatorProfilesTable)
      .set({ ...updates, profileCompleteness: completeness, updatedAt: new Date() })
      .where(eq(creatorProfilesTable.userId, req.user!.id))
      .returning();

    res.json({
      ...updated,
      niches: updated.niches as string[],
      ecosystems: updated.ecosystems as string[],
      languages: updated.languages as string[],
    });
  } catch (err) {
    req.log.error({ err }, "Update profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/onboarding", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { step, data } = req.body;
    const userId = req.user!.id;

    if (step === 2 && data?.handle) {
      const existing = await db
        .select()
        .from(creatorProfilesTable)
        .where(eq(creatorProfilesTable.handle, data.handle))
        .limit(1)
        .then((r) => r[0]);

      if (existing && existing.userId !== userId) {
        res.status(409).json({ error: "handle_taken", message: "This handle is already taken" });
        return;
      }

      const profileExists = await db
        .select()
        .from(creatorProfilesTable)
        .where(eq(creatorProfilesTable.userId, userId))
        .limit(1)
        .then((r) => r[0]);

      if (!profileExists) {
        await db.insert(creatorProfilesTable).values({
          userId,
          handle: data.handle,
          displayName: req.user!.name || data.handle,
          isPublic: data.isPublic ?? false,
        });
      } else {
        await db
          .update(creatorProfilesTable)
          .set({ handle: data.handle, isPublic: data.isPublic ?? false, updatedAt: new Date() })
          .where(eq(creatorProfilesTable.userId, userId));
      }
    }

    const nextStep = step + 1;
    const isComplete = step >= 5;

    await db
      .update(usersTable)
      .set({
        onboardingStep: isComplete ? 5 : nextStep,
        onboardingComplete: isComplete,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    res.json({
      currentStep: isComplete ? 5 : nextStep,
      complete: isComplete,
      nextAction: isComplete ? null : `Complete step ${nextStep}`,
    });
  } catch (err) {
    req.log.error({ err }, "Onboarding error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/generate-dashboard", requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  req.log.info({ userId }, "Dashboard generation triggered");
  res.json({ message: "Dashboard generation queued. Your dashboard will be ready shortly." });
});

router.get("/public/:handle", async (req, res) => {
  try {
    const { handle } = req.params;
    const profile = await db
      .select()
      .from(creatorProfilesTable)
      .where(and(eq(creatorProfilesTable.handle, handle), eq(creatorProfilesTable.isPublic, true)))
      .limit(1)
      .then((r) => r[0]);

    if (!profile) {
      res.status(404).json({ error: "not_found", message: "Creator not found" });
      return;
    }

    const [services, portfolio, wallets] = await Promise.all([
      db.select().from(creatorServicesTable).where(
        and(eq(creatorServicesTable.userId, profile.userId), eq(creatorServicesTable.isActive, true))
      ),
      db.select().from(portfolioItemsTable).where(eq(portfolioItemsTable.userId, profile.userId)),
      db.select().from(walletsTable).where(
        and(eq(walletsTable.userId, profile.userId), eq(walletsTable.isPrimary, true))
      ).limit(1),
    ]);

    const socialLinks = [];
    if (profile.twitterHandle) socialLinks.push({ platform: "twitter", url: `https://x.com/${profile.twitterHandle}`, handle: profile.twitterHandle });
    if (profile.discordHandle) socialLinks.push({ platform: "discord", url: `https://discord.com/users/${profile.discordHandle}`, handle: profile.discordHandle });
    if (profile.telegramHandle) socialLinks.push({ platform: "telegram", url: `https://t.me/${profile.telegramHandle}`, handle: profile.telegramHandle });
    if (profile.website) socialLinks.push({ platform: "website", url: profile.website });
    if (profile.linktreeUrl) socialLinks.push({ platform: "linktree", url: profile.linktreeUrl });

    res.json({
      handle: profile.handle,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      bannerUrl: profile.bannerUrl,
      location: profile.location,
      niches: profile.niches as string[],
      ecosystems: profile.ecosystems as string[],
      languages: profile.languages as string[],
      website: profile.website,
      calComLink: profile.calComLink,
      socialLinks,
      services: services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: s.price,
        currency: s.currency,
        deliveryTime: s.deliveryTime,
        category: s.category,
        isActive: s.isActive,
      })),
      portfolio: portfolio.map((p) => ({
        id: p.id,
        title: p.title,
        url: p.url,
        description: p.description,
        imageUrl: p.imageUrl,
        platform: p.platform,
        featured: p.featured,
        sortOrder: p.sortOrder,
      })),
      openToCollaboration: profile.openToCollaboration,
      connectedWalletAddress: wallets[0]?.address || null,
    });
  } catch (err) {
    req.log.error({ err }, "Public profile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/services", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const services = await db
      .select()
      .from(creatorServicesTable)
      .where(eq(creatorServicesTable.userId, req.user!.id));
    res.json(services);
  } catch (err) {
    req.log.error({ err }, "Get services error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const [service] = await db
      .insert(creatorServicesTable)
      .values({ ...req.body, userId: req.user!.id })
      .returning();
    res.status(201).json(service);
  } catch (err) {
    req.log.error({ err }, "Create service error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/services/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const [service] = await db
      .update(creatorServicesTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(and(eq(creatorServicesTable.id, req.params.id), eq(creatorServicesTable.userId, req.user!.id)))
      .returning();
    if (!service) { res.status(404).json({ error: "not_found" }); return; }
    res.json(service);
  } catch (err) {
    req.log.error({ err }, "Update service error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await db
      .delete(creatorServicesTable)
      .where(and(eq(creatorServicesTable.id, req.params.id), eq(creatorServicesTable.userId, req.user!.id)));
    res.json({ message: "Service deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete service error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/portfolio", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const items = await db
      .select()
      .from(portfolioItemsTable)
      .where(eq(portfolioItemsTable.userId, req.user!.id));
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Get portfolio error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/portfolio", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const [item] = await db
      .insert(portfolioItemsTable)
      .values({ ...req.body, userId: req.user!.id })
      .returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Create portfolio item error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
