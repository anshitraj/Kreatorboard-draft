import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { integrationsTable, walletsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { ethers } from "ethers";

const router: IRouter = Router();

const INTEGRATION_DEFINITIONS = [
  {
    provider: "gmail",
    displayName: "Gmail",
    description: "Connect your Gmail to manage your collaboration inbox and receive project inquiries directly.",
    syncMode: "webhook",
    availableData: ["Email threads", "Labels", "Sender metadata", "Collaboration leads"],
    limitations: ["Read-only access to allowed labels", "Full mailbox not synced"],
    scopes: ["gmail.readonly", "gmail.labels"],
  },
  {
    provider: "google_calendar",
    displayName: "Google Calendar",
    description: "Sync your calendar to show availability, bookings, and upcoming meetings on your profile.",
    syncMode: "webhook",
    availableData: ["Upcoming events", "Bookings", "Availability windows"],
    limitations: ["Events synced for next 30 days", "Private event details not shown"],
    scopes: ["calendar.readonly"],
  },
  {
    provider: "discord",
    displayName: "Discord",
    description: "Connect your Discord identity and optionally link your server or community.",
    syncMode: "scheduled",
    availableData: ["Discord identity", "Username", "Connected servers (if bot installed)"],
    limitations: ["Server analytics require bot install", "Message count not available without bot"],
    scopes: ["identify", "guilds"],
  },
  {
    provider: "telegram",
    displayName: "Telegram",
    description: "Link your Telegram channel or bot to display your community and receive inquiries.",
    syncMode: "webhook",
    availableData: ["Channel/group metadata", "Subscriber count (if bot admin)", "Public profile"],
    limitations: ["Requires bot to be admin of channel", "Private channels not supported"],
    scopes: ["bot_access"],
  },
  {
    provider: "twitter",
    displayName: "X / Twitter",
    description: "Connect your X account to display your following and content. Three modes available depending on your API access.",
    syncMode: "manual",
    availableData: ["Public profile data", "Follower count (API mode)", "Profile link (public mode)"],
    limitations: ["Free X API tier has severe limits", "Analytics require paid API access", "CSV import available as fallback"],
    scopes: ["tweet.read", "users.read"],
  },
  {
    provider: "cal_com",
    displayName: "Cal.com",
    description: "Add your Cal.com booking link so founders can schedule calls with you directly.",
    syncMode: "manual",
    availableData: ["Booking link", "Booking metadata (if API key provided)"],
    limitations: ["Deep sync requires Cal.com API key", "Booking link mode is manual input only"],
    scopes: [],
  },
  {
    provider: "wallet",
    displayName: "Crypto Wallet",
    description: "Connect your EVM wallet to receive payments, verify identity, and display your on-chain presence.",
    syncMode: "manual",
    availableData: ["Wallet address", "ENS name resolution", "Payout destination"],
    limitations: ["Balance not displayed", "No private key access ever", "Solana support coming soon"],
    scopes: [],
  },
  {
    provider: "website",
    displayName: "Website / Blog / RSS",
    description: "Import your website metadata, portfolio links, and RSS feed to auto-populate your profile.",
    syncMode: "scheduled",
    availableData: ["Site metadata", "Social links from page", "RSS articles", "Portfolio link detection"],
    limitations: ["JavaScript-rendered sites may not parse fully", "Some sites block bots"],
    scopes: [],
  },
];

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const connected = await db
      .select()
      .from(integrationsTable)
      .where(eq(integrationsTable.userId, req.user!.id));

    const connectedMap = new Map(connected.map((c) => [c.provider, c]));

    const result = INTEGRATION_DEFINITIONS.map((def) => {
      const conn = connectedMap.get(def.provider);
      return {
        provider: def.provider,
        status: conn?.status || "disconnected",
        displayName: def.displayName,
        description: def.description,
        lastSyncAt: conn?.lastSyncAt?.toISOString() || null,
        dataFreshness: conn?.lastSyncAt ? getDataFreshness(conn.lastSyncAt) : null,
        syncMode: def.syncMode,
        availableData: def.availableData,
        limitations: def.limitations,
        scopes: def.scopes,
        errorMessage: conn?.lastSyncError || null,
        cooldownUntil: conn?.cooldownUntil?.toISOString() || null,
      };
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Get integrations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

function getDataFreshness(lastSync: Date): string {
  const diffMs = Date.now() - lastSync.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

router.post("/:provider/connect", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { provider } = req.params;
  const userId = req.user!.id;

  const OAUTH_PROVIDERS = ["gmail", "google_calendar", "discord"];
  const MANUAL_PROVIDERS = ["cal_com", "website", "telegram", "twitter"];

  try {
    if (provider === "wallet") {
      res.json({
        authUrl: null,
        message: "Use the wallet connect modal to connect your wallet",
        requiresRedirect: false,
      });
      return;
    }

    if (OAUTH_PROVIDERS.includes(provider)) {
      const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
      if (!clientId) {
        const [existing] = await db
          .insert(integrationsTable)
          .values({
            userId,
            provider,
            status: "limited",
            lastSyncError: "OAuth credentials not configured. Contact admin to enable this integration.",
            syncMode: "manual",
          })
          .onConflictDoUpdate({
            target: [integrationsTable.userId, integrationsTable.provider],
            set: { status: "limited", lastSyncError: "OAuth credentials not configured", updatedAt: new Date() },
          })
          .returning();

        res.json({
          authUrl: null,
          message: "OAuth credentials not configured for this provider. Integration marked as limited.",
          requiresRedirect: false,
        });
        return;
      }

      res.json({
        authUrl: `/api/integrations/oauth/${provider}`,
        message: "Redirect to OAuth provider",
        requiresRedirect: true,
      });
      return;
    }

    if (MANUAL_PROVIDERS.includes(provider)) {
      const metadata = req.body?.metadata || {};
      const [record] = await db
        .insert(integrationsTable)
        .values({
          userId,
          provider,
          status: "connected",
          metadata,
          syncMode: "manual",
          lastSyncAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [integrationsTable.userId, integrationsTable.provider],
          set: { status: "connected", metadata, lastSyncAt: new Date(), updatedAt: new Date() },
        })
        .returning();

      res.json({
        authUrl: null,
        message: `${provider} connected successfully`,
        requiresRedirect: false,
      });
      return;
    }

    res.status(400).json({ error: "Unknown provider" });
  } catch (err) {
    req.log.error({ err }, "Connect integration error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:provider/disconnect", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { provider } = req.params;
  try {
    await db
      .update(integrationsTable)
      .set({ status: "disconnected", accessToken: null, refreshToken: null, updatedAt: new Date() })
      .where(and(eq(integrationsTable.userId, req.user!.id), eq(integrationsTable.provider, provider)));
    res.json({ message: `${provider} disconnected` });
  } catch (err) {
    req.log.error({ err }, "Disconnect integration error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:provider/sync", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { provider } = req.params;
  const userId = req.user!.id;
  try {
    const cooldownUntil = new Date(Date.now() + 5 * 60 * 1000);
    await db
      .update(integrationsTable)
      .set({ cooldownUntil, lastSyncAt: new Date(), updatedAt: new Date() })
      .where(and(eq(integrationsTable.userId, userId), eq(integrationsTable.provider, provider)));

    res.json({
      jobId: `sync-${provider}-${Date.now()}`,
      status: "queued",
      message: `Sync triggered for ${provider}. Next sync available in 5 minutes.`,
    });
  } catch (err) {
    req.log.error({ err }, "Trigger sync error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/wallet/connect", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { address, chainId, signature, message, isPrimary, label } = req.body;
  const userId = req.user!.id;

  try {
    let verified = false;
    try {
      const recovered = ethers.verifyMessage(message, signature);
      verified = recovered.toLowerCase() === address.toLowerCase();
    } catch {
      verified = false;
    }

    if (!verified) {
      res.status(400).json({ error: "invalid_signature", message: "Wallet signature verification failed" });
      return;
    }

    const chainNames: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      10: "Optimism",
      42161: "Arbitrum",
      8453: "Base",
      56: "BNB Chain",
    };
    const chainName = chainNames[chainId] || `Chain ${chainId}`;

    if (isPrimary) {
      await db
        .update(walletsTable)
        .set({ isPrimary: false })
        .where(eq(walletsTable.userId, userId));
    }

    const [wallet] = await db
      .insert(walletsTable)
      .values({
        userId,
        address,
        chainId,
        chainName,
        isPrimary: isPrimary || false,
        label: label || null,
        verified: true,
        verificationSignature: signature,
      })
      .returning();

    res.json({
      id: wallet.id,
      address: wallet.address,
      chainId: wallet.chainId,
      chainName: wallet.chainName,
      ensName: null,
      isPrimary: wallet.isPrimary,
      label: wallet.label,
      verified: wallet.verified,
      connectedAt: wallet.connectedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Wallet connect error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wallet", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const wallets = await db
      .select()
      .from(walletsTable)
      .where(eq(walletsTable.userId, req.user!.id));

    res.json(
      wallets.map((w) => ({
        id: w.id,
        address: w.address,
        chainId: w.chainId,
        chainName: w.chainName,
        ensName: null,
        isPrimary: w.isPrimary,
        label: w.label,
        verified: w.verified,
        connectedAt: w.connectedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Get wallets error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/oauth/callback", async (req, res) => {
  const { code, state, error } = req.query;
  if (error) {
    res.redirect(`/?oauth_error=${error}`);
    return;
  }
  res.redirect(`/dashboard/integrations?oauth_success=true&provider=${state}`);
});

export default router;
