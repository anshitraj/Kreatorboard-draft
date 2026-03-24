import { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    onboardingStep: number;
    onboardingComplete: boolean;
    replitUserId: string | null;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const replitUserId = req.headers["x-replit-user-id"] as string | undefined;
  const replitUserName = req.headers["x-replit-user-name"] as string | undefined;

  if (!replitUserId) {
    res.status(401).json({ error: "Unauthorized", message: "Authentication required" });
    return;
  }

  try {
    let user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.replitUserId, replitUserId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          email: `${replitUserId}@replit.user`,
          name: replitUserName || null,
          replitUserId,
          role: "creator",
          onboardingStep: 1,
          onboardingComplete: false,
        })
        .returning();
      user = newUser;
    } else if (replitUserName && user.name !== replitUserName) {
      const [updated] = await db
        .update(usersTable)
        .set({ name: replitUserName, updatedAt: new Date() })
        .where(eq(usersTable.id, user.id))
        .returning();
      user = updated;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      onboardingStep: user.onboardingStep,
      onboardingComplete: user.onboardingComplete,
      replitUserId: user.replitUserId,
    };
    next();
  } catch (err) {
    req.log.error({ err }, "Auth middleware error");
    res.status(500).json({ error: "Internal server error" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden", message: "Insufficient permissions" });
      return;
    }
    next();
  };
}
