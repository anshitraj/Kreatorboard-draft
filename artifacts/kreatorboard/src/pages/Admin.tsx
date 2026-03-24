import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAdminGetUsers, useAdminGetSyncHealth } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Admin() {
  const { data: users, isLoading: uLoad } = useAdminGetUsers();
  const { data: health, isLoading: hLoad } = useAdminGetSyncHealth();

  if (uLoad || hLoad) return <DashboardLayout><LoadingScreen message="Loading Admin Panel..." /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display font-bold mb-2 text-red-500">Admin Dashboard</h1>
          <p className="text-muted-foreground">System-wide overview and health metrics.</p>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card p-6 border-red-500/20">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
            <h3 className="text-3xl font-bold">{users?.total || 0}</h3>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Sync Jobs</p>
            <h3 className="text-3xl font-bold">{health?.totalJobs || 0}</h3>
          </Card>
          <Card className="glass-card p-6 border-red-500/50">
            <p className="text-sm font-medium text-muted-foreground mb-1 text-red-400">Failed Jobs</p>
            <h3 className="text-3xl font-bold text-red-500">{health?.failedJobs || 0}</h3>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">Integration Health</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Provider</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Success Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {health?.providerHealth?.map((p) => (
                  <TableRow key={p.provider} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-medium capitalize">{p.provider}</TableCell>
                    <TableCell>{p.activeConnections}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={p.successRate > 0.9 ? 'text-green-500 border-green-500/30' : 'text-red-500 border-red-500/30'}>
                        {(p.successRate * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">Recent Users</h3>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.items?.slice(0, 10).map((u) => (
                  <TableRow key={u.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-medium truncate max-w-[150px]" title={u.email}>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={u.role === 'admin' ? 'bg-red-500/20 text-red-400' : ''}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(u.createdAt), "MMM d, yy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
