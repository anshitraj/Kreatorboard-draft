import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import oidcRouter from "./oidc";
import profileRouter from "./profile";
import integrationsRouter from "./integrations";
import socialRouter from "./social";
import inboxRouter from "./inbox";
import calendarRouter from "./calendar";
import paymentsRouter from "./payments";
import discoveryRouter from "./discovery";
import syncRouter from "./sync";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(oidcRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/integrations", integrationsRouter);
router.use("/social", socialRouter);
router.use("/inbox", inboxRouter);
router.use("/calendar", calendarRouter);
router.use("/payments", paymentsRouter);
router.use("/discovery", discoveryRouter);
router.use("/sync", syncRouter);
router.use("/admin", adminRouter);

export default router;
