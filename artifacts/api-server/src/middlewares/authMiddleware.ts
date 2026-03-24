import { type Request, type Response, type NextFunction } from "express";
import {
  clearSession,
  getSessionId,
  getSession,
  type SessionData,
} from "../lib/oidc-auth";

declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): this is AuthenticatedRequest;
      sessionId?: string;
      sessionData?: SessionData;
    }

    interface AuthenticatedRequest extends Request {
      user: NonNullable<Request["user"]>;
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

  req.sessionId = sid;
  req.sessionData = session;
  req.user = {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    onboardingStep: session.onboardingStep,
    onboardingComplete: session.onboardingComplete,
    replitUserId: session.replitUserId,
  } as any;

  next();
}
