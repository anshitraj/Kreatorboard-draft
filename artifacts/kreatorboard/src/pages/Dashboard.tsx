import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMyIntegrations, useGetSocialMetrics, useGetCalendarSummary, useGetInbox, useGetPaymentRequests, useGetMyProfile } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Calendar, Wallet, AlertCircle, ArrowUpRight, Inbox as InboxIcon } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const profileQ = useGetMyProfile();
  const metricsQ = useGetSocialMetrics();
  const integrationsQ = useGetMyIntegrations();
  const calendarQ = useGetCalendarSummary();
  const inboxQ = useGetInbox({ query: { status: 'new' as any }});
  const paymentsQ = useGetPaymentRequests();

  if (profileQ.isLoading || metricsQ.isLoading) {
    return (
      <DashboardLayout>
        <LoadingScreen message="Loading Dashboard..." />
      </DashboardLayout>
    );
  }

  const profile = profileQ.data;
  const metrics = metricsQ.data;
  const connectedCount = integrationsQ.data?.filter(i => i.status === "connected").length || 0;
  const pendingPayments = paymentsQ.data?.filter(p => p.status === "pending") || [];
  const totalPendingVal = pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header>
          <h1 className="text-3xl font-display font-bold mb-2">Overview</h1>
          <p className="text-muted-foreground">Welcome back. Here's what's happening with your creator business today.</p>
        </header>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              {metrics?.isEstimated && (
                <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">Estimated</Badge>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Audience Reach</p>
            <h3 className="text-3xl font-bold">{metrics?.totalReach ? (metrics.totalReach / 1000).toFixed(1) + 'k' : '0'}</h3>
          </Card>

          <Card className="glass-card p-6 border-l-4 border-l-accent">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <InboxIcon className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">New Collab Requests</p>
            <h3 className="text-3xl font-bold">{inboxQ.data?.total || 0}</h3>
          </Card>

          <Card className="glass-card p-6 border-l-4 border-l-green-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Pending Payments</p>
            <h3 className="text-3xl font-bold">${totalPendingVal.toLocaleString()}</h3>
          </Card>

          <Card className="glass-card p-6 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Profile Completeness</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold">{profile?.profileCompleteness || 0}%</h3>
            </div>
            <Progress value={profile?.profileCompleteness || 0} className="h-2 mt-3 bg-secondary" />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Social Platforms Breakdown */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Platform Metrics</h3>
                <Link href="/dashboard/integrations">
                  <Button variant="ghost" size="sm" className="text-primary">Manage <ArrowUpRight className="w-4 h-4 ml-1"/></Button>
                </Link>
              </div>
              
              {metrics?.platforms && metrics.platforms.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {metrics.platforms.map((p) => (
                    <div key={p.platform} className="bg-secondary/50 border border-border p-4 rounded-xl flex items-center justify-between group hover:bg-secondary transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center capitalize font-bold">
                          {p.platform[0]}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{p.platform}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                              {p.dataSource}
                            </span>
                            {p.isEstimated && <AlertCircle className="w-3 h-3 text-amber-500" />}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{p.followers?.toLocaleString() || '-'}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary/30 rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground mb-4">No platform metrics found.</p>
                  <Link href="/dashboard/integrations">
                    <Button>Connect Platforms</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Collaborations */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Requests</h3>
                <Link href="/dashboard/inbox">
                  <Button variant="ghost" size="sm">View Inbox <ArrowUpRight className="w-4 h-4 ml-1"/></Button>
                </Link>
              </div>
              
              {inboxQ.data?.items && inboxQ.data.items.length > 0 ? (
                <div className="space-y-3">
                  {inboxQ.data.items.slice(0, 3).map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border">
                      <div>
                        <p className="font-semibold">{req.subject}</p>
                        <p className="text-sm text-muted-foreground">From: {req.senderName}</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">New</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No new collaboration requests.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Calendar Widget */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Upcoming</h3>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              
              {calendarQ.data?.nextEvent ? (
                <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-xl p-4 glow-border">
                  <Badge className="mb-2 bg-primary text-white border-none">Next Event</Badge>
                  <h4 className="font-bold text-lg mb-1">{calendarQ.data.nextEvent.title}</h4>
                  <p className="text-sm text-primary-foreground/80 mb-3">
                    {new Date(calendarQ.data.nextEvent.startAt).toLocaleString()}
                  </p>
                  <Link href="/dashboard/calendar">
                    <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white">View Calendar</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 bg-secondary/50 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground mb-3">No upcoming events this week</p>
                  <Link href="/dashboard/calendar">
                    <Button variant="outline" size="sm">Open Calendar</Button>
                  </Link>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center text-sm border-t border-border pt-4">
                <span className="text-muted-foreground">Events this week:</span>
                <span className="font-bold">{calendarQ.data?.eventsThisWeek || 0}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 bg-secondary/50 border-border" onClick={() => window.open(`/c/${profile?.handle}`, '_blank')}>
                  <ArrowUpRight className="w-4 h-4 mr-3 text-muted-foreground" />
                  View Public Profile
                </Button>
                <Link href="/dashboard/payments">
                  <Button variant="outline" className="w-full justify-start h-12 bg-secondary/50 border-border">
                    <Wallet className="w-4 h-4 mr-3 text-muted-foreground" />
                    Request Payment
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start h-12 bg-secondary/50 border-border">
                    <Activity className="w-4 h-4 mr-3 text-muted-foreground" />
                    Edit Services
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
