import { Router, type IRouter } from "express";
import { requireAuth, type AuthenticatedRequest } from "../lib/auth";
import { db } from "@workspace/db";
import { calendarEventsTable, creatorProfilesTable } from "@workspace/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

const router: IRouter = Router();

router.get("/events", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { from, to } = req.query as Record<string, string>;
    const conditions = [eq(calendarEventsTable.userId, req.user!.id)];
    if (from) conditions.push(gte(calendarEventsTable.startAt, new Date(from)));
    if (to) conditions.push(lte(calendarEventsTable.endAt, new Date(to)));

    const events = await db
      .select()
      .from(calendarEventsTable)
      .where(and(...conditions))
      .orderBy(calendarEventsTable.startAt);

    res.json(events.map((e) => ({
      id: e.id,
      title: e.title,
      startAt: e.startAt.toISOString(),
      endAt: e.endAt.toISOString(),
      description: e.description,
      location: e.location,
      isBooking: e.isBooking,
      calendarSource: e.calendarSource,
      attendees: e.attendees as string[],
    })));
  } catch (err) {
    req.log.error({ err }, "Get calendar events error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/summary", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [nextEvent, weekEvents, monthBookings, profile] = await Promise.all([
      db.select().from(calendarEventsTable)
        .where(and(eq(calendarEventsTable.userId, userId), gte(calendarEventsTable.startAt, now)))
        .orderBy(calendarEventsTable.startAt)
        .limit(1)
        .then((r) => r[0]),
      db.select().from(calendarEventsTable)
        .where(and(eq(calendarEventsTable.userId, userId), gte(calendarEventsTable.startAt, now), lte(calendarEventsTable.endAt, weekEnd)))
        .then((r) => r.length),
      db.select().from(calendarEventsTable)
        .where(and(eq(calendarEventsTable.userId, userId), eq(calendarEventsTable.isBooking, true), gte(calendarEventsTable.startAt, now), lte(calendarEventsTable.startAt, monthEnd)))
        .then((r) => r.length),
      db.select({ calComLink: creatorProfilesTable.calComLink })
        .from(creatorProfilesTable)
        .where(eq(creatorProfilesTable.userId, userId))
        .limit(1)
        .then((r) => r[0]),
    ]);

    res.json({
      nextEvent: nextEvent ? {
        id: nextEvent.id,
        title: nextEvent.title,
        startAt: nextEvent.startAt.toISOString(),
        endAt: nextEvent.endAt.toISOString(),
        description: nextEvent.description,
        location: nextEvent.location,
        isBooking: nextEvent.isBooking,
        calendarSource: nextEvent.calendarSource,
        attendees: nextEvent.attendees as string[],
      } : null,
      eventsThisWeek: weekEvents,
      bookingsThisMonth: monthBookings,
      calComLink: profile?.calComLink || null,
      lastSyncAt: null,
    });
  } catch (err) {
    req.log.error({ err }, "Get calendar summary error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
