import * as oidcClient from "openid-client";
import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  clearSession,
  createSession,
  deleteSession,
  getOidcConfig,
  getSessionId,
  SESSION_COOKIE,
  SESSION_TTL,
  type SessionData,
} from "../lib/oidc-auth";

const OIDC_COOKIE_TTL = 10 * 60 * 1000;

const router: IRouter = Router();

function getOrigin(req: Request): string {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
  return `${proto}://${host}`;
}

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

function setOidcCookie(res: Response, name: string, value: string) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: OIDC_COOKIE_TTL,
  });
}

function getSafeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }
  return value;
}

async function upsertUserFromClaims(claims: Record<string, unknown>) {
  const replitUserId = claims.sub as string;
  const email = (claims.email as string) || `${replitUserId}@replit.user`;
  const name = (claims.first_name as string)
    ? `${claims.first_name} ${claims.last_name || ""}`.trim()
    : (claims.name as string) || null;
  const avatarUrl = (claims.profile_image_url || claims.picture) as string | null;

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
        email,
        name,
        avatarUrl,
        replitUserId,
        role: "creator",
        onboardingStep: 1,
        onboardingComplete: false,
      })
      .returning();
    user = newUser;
  } else {
    const [updated] = await db
      .update(usersTable)
      .set({ name: name ?? user.name, avatarUrl: avatarUrl ?? user.avatarUrl, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id))
      .returning();
    user = updated;
  }

  return user;
}

router.get("/login", async (req: Request, res: Response) => {
  try {
    const config = await getOidcConfig();
    const callbackUrl = `${getOrigin(req)}/api/callback`;
    const returnTo = getSafeReturnTo(req.query.returnTo);

    const state = oidcClient.randomState();
    const nonce = oidcClient.randomNonce();
    const codeVerifier = oidcClient.randomPKCECodeVerifier();
    const codeChallenge = await oidcClient.calculatePKCECodeChallenge(codeVerifier);

    const redirectTo = oidcClient.buildAuthorizationUrl(config, {
      redirect_uri: callbackUrl,
      scope: "openid email profile offline_access",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      prompt: "login consent",
      state,
      nonce,
    });

    setOidcCookie(res, "code_verifier", codeVerifier);
    setOidcCookie(res, "nonce", nonce);
    setOidcCookie(res, "state", state);
    setOidcCookie(res, "return_to", returnTo);

    res.redirect(redirectTo.href);
  } catch (err) {
    req.log?.error({ err }, "OIDC login error");
    res.status(500).send("Authentication error. Please try again.");
  }
});

router.get("/callback", async (req: Request, res: Response) => {
  try {
    const config = await getOidcConfig();
    const callbackUrl = `${getOrigin(req)}/api/callback`;

    const codeVerifier = req.cookies?.code_verifier;
    const nonce = req.cookies?.nonce;
    const expectedState = req.cookies?.state;

    if (!codeVerifier || !expectedState) {
      res.redirect("/api/login");
      return;
    }

    const currentUrl = new URL(
      `${callbackUrl}?${new URL(req.url, `http://${req.headers.host}`).searchParams}`,
    );

    let tokens: oidcClient.TokenEndpointResponse & oidcClient.TokenEndpointResponseHelpers;
    try {
      tokens = await oidcClient.authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: codeVerifier,
        expectedNonce: nonce,
        expectedState,
        idTokenExpected: true,
      });
    } catch (e) {
      req.log?.error({ e }, "OIDC token exchange error");
      res.redirect("/api/login");
      return;
    }

    const returnTo = getSafeReturnTo(req.cookies?.return_to);

    res.clearCookie("code_verifier", { path: "/" });
    res.clearCookie("nonce", { path: "/" });
    res.clearCookie("state", { path: "/" });
    res.clearCookie("return_to", { path: "/" });

    const claims = tokens.claims();
    if (!claims) {
      res.redirect("/api/login");
      return;
    }

    const dbUser = await upsertUserFromClaims(claims as unknown as Record<string, unknown>);

    const now = Math.floor(Date.now() / 1000);
    const sessionData: SessionData = {
      userId: dbUser.id,
      replitUserId: dbUser.replitUserId!,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      onboardingStep: dbUser.onboardingStep,
      onboardingComplete: dbUser.onboardingComplete,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiresIn() ? now + tokens.expiresIn()! : (claims.exp as number | undefined),
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);
    res.redirect(returnTo);
  } catch (err) {
    req.log?.error({ err }, "OIDC callback error");
    res.redirect("/api/login");
  }
});

router.get("/logout", async (req: Request, res: Response) => {
  const origin = getOrigin(req);
  const sid = getSessionId(req);
  await clearSession(res, sid);

  try {
    const config = await getOidcConfig();
    const endSessionUrl = oidcClient.buildEndSessionUrl(config, {
      client_id: process.env.REPL_ID!,
      post_logout_redirect_uri: origin,
    });
    res.redirect(endSessionUrl.href);
  } catch {
    res.redirect("/");
  }
});

export default router;
