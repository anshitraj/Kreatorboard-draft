import { Router, type IRouter, type Request, type Response } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: null,
    role: user.role,
    onboardingStep: user.onboardingStep,
    onboardingComplete: user.onboardingComplete,
    createdAt: new Date().toISOString(),
  });
});

router.post("/logout", async (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
