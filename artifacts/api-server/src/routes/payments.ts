import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { paymentRequestsTable, walletsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/wallets", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const wallets = await db
      .select()
      .from(walletsTable)
      .where(eq(walletsTable.userId, req.user!.id));

    res.json(wallets.map((w) => ({
      id: w.id,
      address: w.address,
      chainId: w.chainId,
      chainName: w.chainName,
      ensName: null,
      isPrimary: w.isPrimary,
      label: w.label,
      verified: w.verified,
      connectedAt: w.connectedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Get payment wallets error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/requests", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const requests = await db
      .select()
      .from(paymentRequestsTable)
      .where(eq(paymentRequestsTable.userId, req.user!.id))
      .orderBy(paymentRequestsTable.createdAt);

    res.json(requests.map((r) => ({
      id: r.id,
      title: r.title,
      amount: r.amount,
      currency: r.currency,
      toAddress: r.toAddress,
      fromAddress: r.fromAddress,
      status: r.status,
      paymentLink: r.paymentLink,
      serviceId: r.serviceId,
      notes: r.notes,
      createdAt: r.createdAt.toISOString(),
      paidAt: r.paidAt?.toISOString() || null,
    })));
  } catch (err) {
    req.log.error({ err }, "Get payment requests error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/requests", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, amount, currency, walletId, serviceId, notes } = req.body;
    const userId = req.user!.id;

    const wallet = await db
      .select()
      .from(walletsTable)
      .where(and(eq(walletsTable.id, walletId), eq(walletsTable.userId, userId)))
      .limit(1)
      .then((r) => r[0]);

    if (!wallet) {
      res.status(400).json({ error: "Wallet not found or not owned by user" });
      return;
    }

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const paymentLink = `${process.env.REPLIT_DOMAINS?.split(",")[0] || "localhost"}/pay/${paymentId}`;

    const [request] = await db
      .insert(paymentRequestsTable)
      .values({
        userId,
        walletId,
        title,
        amount,
        currency: currency || "USDC",
        toAddress: wallet.address,
        status: "pending",
        paymentLink,
        serviceId: serviceId || null,
        notes: notes || null,
      })
      .returning();

    res.status(201).json({
      id: request.id,
      title: request.title,
      amount: request.amount,
      currency: request.currency,
      toAddress: request.toAddress,
      fromAddress: request.fromAddress,
      status: request.status,
      paymentLink: request.paymentLink,
      serviceId: request.serviceId,
      notes: request.notes,
      createdAt: request.createdAt.toISOString(),
      paidAt: null,
    });
  } catch (err) {
    req.log.error({ err }, "Create payment request error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/requests/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const request = await db
      .select()
      .from(paymentRequestsTable)
      .where(and(eq(paymentRequestsTable.id, req.params.id), eq(paymentRequestsTable.userId, req.user!.id)))
      .limit(1)
      .then((r) => r[0]);

    if (!request) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    res.json({
      id: request.id,
      title: request.title,
      amount: request.amount,
      currency: request.currency,
      toAddress: request.toAddress,
      fromAddress: request.fromAddress,
      status: request.status,
      paymentLink: request.paymentLink,
      serviceId: request.serviceId,
      notes: request.notes,
      createdAt: request.createdAt.toISOString(),
      paidAt: request.paidAt?.toISOString() || null,
    });
  } catch (err) {
    req.log.error({ err }, "Get payment request error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/requests/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, fromAddress, notes } = req.body;
    const updates: any = {};
    if (status) updates.status = status;
    if (fromAddress) updates.fromAddress = fromAddress;
    if (notes) updates.notes = notes;
    if (status === "paid") updates.paidAt = new Date();

    const [request] = await db
      .update(paymentRequestsTable)
      .set(updates)
      .where(and(eq(paymentRequestsTable.id, req.params.id), eq(paymentRequestsTable.userId, req.user!.id)))
      .returning();

    if (!request) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    res.json({
      id: request.id,
      title: request.title,
      amount: request.amount,
      currency: request.currency,
      toAddress: request.toAddress,
      fromAddress: request.fromAddress,
      status: request.status,
      paymentLink: request.paymentLink,
      serviceId: request.serviceId,
      notes: request.notes,
      createdAt: request.createdAt.toISOString(),
      paidAt: request.paidAt?.toISOString() || null,
    });
  } catch (err) {
    req.log.error({ err }, "Update payment request error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
