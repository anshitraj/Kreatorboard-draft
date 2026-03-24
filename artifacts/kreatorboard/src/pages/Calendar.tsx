import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetCalendarEvents, useGetCalendarSummary } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Video, MapPin, Users, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Calendar() {
  // Get next 30 days
  const from = new Date().toISOString();
  const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: events, isLoading } = useGetCalendarEvents({ query: { from, to }});
  const { data: summary } = useGetCalendarSummary();
  const { toast } = useToast();

  if (isLoading) return <DashboardLayout><LoadingScreen message="Loading Calendar..." /></DashboardLayout>;

  // Group events by day
  const groupedEvents = events?.reduce((acc: any, event) => {
    const dateStr = format(new Date(event.startAt), "yyyy-MM-dd");
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(event);
    return acc;
  }, {});

  const copyLink = () => {
    if (summary?.calComLink) {
      navigator.clipboard.writeText(summary.calComLink);
      toast({ title: "Copied!", description: "Booking link copied to clipboard" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Calendar</h1>
            <p className="text-muted-foreground">Manage your schedule and bookings.</p>
          </div>
          {summary?.calComLink && (
            <Button variant="outline" className="glass-card" onClick={copyLink}>
              <Copy className="w-4 h-4 mr-2" /> Copy Booking Link
            </Button>
          )}
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {groupedEvents && Object.keys(groupedEvents).length > 0 ? (
              Object.entries(groupedEvents).map(([dateStr, dayEvents]: [string, any]) => (
                <div key={dateStr} className="space-y-4">
                  <h3 className="font-bold text-lg sticky top-16 bg-background/80 backdrop-blur py-2 z-10 border-b border-border">
                    {format(new Date(dateStr), "EEEE, MMMM d")}
                  </h3>
                  <div className="grid gap-3 pl-4 border-l-2 border-border/50">
                    {dayEvents.map((event: any) => (
                      <Card key={event.id} className={`p-4 transition-all hover:translate-x-1 ${event.isBooking ? 'bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(123,97,255,0.05)]' : 'bg-card/50'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-semibold text-primary">
                                {format(new Date(event.startAt), "h:mm a")} - {format(new Date(event.endAt), "h:mm a")}
                              </span>
                              {event.isBooking && <Badge className="bg-primary hover:bg-primary text-white border-none h-5 px-1.5 text-[10px]">Booking</Badge>}
                            </div>
                            <h4 className="font-bold text-lg">{event.title}</h4>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                              {event.location && (
                                <div className="flex items-center gap-1.5">
                                  {event.location.includes("http") ? <Video className="w-4 h-4"/> : <MapPin className="w-4 h-4"/>}
                                  <span className="truncate max-w-[200px]">{event.location}</span>
                                </div>
                              )}
                              {event.attendees && event.attendees.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4"/>
                                  <span>{event.attendees.length} Attendees</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/20">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No upcoming events</h3>
                <p className="text-muted-foreground mb-6">Your calendar looks clear for the next 30 days.</p>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard/integrations'}>
                  Manage Calendar Integration
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass-card p-6 bg-gradient-to-br from-card to-primary/5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> At a Glance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Events this week</span>
                  <span className="font-bold text-xl">{summary?.eventsThisWeek || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bookings this month</span>
                  <span className="font-bold text-xl">{summary?.bookingsThisMonth || 0}</span>
                </div>
              </div>
            </Card>

            {!summary?.calComLink && (
              <Card className="p-6 border-dashed border-border bg-secondary/30 text-center">
                <p className="text-sm text-muted-foreground mb-4">Want to accept automated bookings directly on your profile?</p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/integrations'}>
                  Connect Cal.com
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
