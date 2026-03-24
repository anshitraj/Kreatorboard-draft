import { type Request, type Response, type NextFunction } from "express";
import { getSessionId, getSession } from "../lib/oidc-auth";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string | null;
      role: string;
      onboardingStep: number;
      onboardingComplete: boolean;
      replitUserId: string | null;
    }

    interface Request {
      user?: User;
      isAuthenticated(): this is Request & { user: User };
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.isAuthenticated = function (this: Request) {
    return this.user != null;
  } as Request["isAuthenticated"];

  const sid = getSessionId(req);
  if (!sid) {
    next();
    return;
  }

  const session = await getSession(sid);
  if (!session?.userId) {
    next();
    return;
  }

  req.user = {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    onboardingStep: session.onboardingStep,
    onboardingComplete: session.onboardingComplete,
    replitUserId: session.replitUserId,
  };

  next();
}
