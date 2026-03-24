import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMyIntegrations, useTriggerIntegrationSync, useInitiateIntegrationConnect, useDisconnectIntegration } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { RefreshCw, Unplug, ExternalLink, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Integrations() {
  const { data: integrations, isLoading, refetch } = useGetMyIntegrations();
  const syncMutation = useTriggerIntegrationSync();
  const connectMutation = useInitiateIntegrationConnect();
  const disconnectMutation = useDisconnectIntegration();
  const { toast } = useToast();

  if (isLoading) {
    return <DashboardLayout><LoadingScreen message="Loading Integrations..." /></DashboardLayout>;
  }

  const handleSync = async (provider: string) => {
    try {
      const res = await syncMutation.mutateAsync({ provider });
      toast({ title: "Sync Started", description: res.message });
      refetch();
    } catch (err: any) {
      toast({ title: "Sync Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleConnect = async (provider: any) => {
    if (provider === "wallet") {
      toast({ title: "Wallet Connect", description: "Simulating AppKit modal open..." });
      return;
    }
    try {
      const res = await connectMutation.mutateAsync({ provider, data: {} });
      if (res.requiresRedirect && res.authUrl) {
        window.location.href = res.authUrl;
      } else {
        toast({ title: "Connected", description: res.message });
        refetch();
      }
    } catch (err: any) {
      toast({ title: "Connection Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      await disconnectMutation.mutateAsync({ provider });
      toast({ title: "Disconnected", description: `Successfully disconnected ${provider}` });
      refetch();
    } catch (err: any) {
      toast({ title: "Disconnect Failed", description: err.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "error": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "limited": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "action_required": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Integrations</h1>
            <p className="text-muted-foreground">Connect platforms to automate your dashboard and sync data.</p>
          </div>
          <Button variant="outline" className="glass-card" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Status
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations?.map((integration) => (
            <Card key={integration.provider} className="glass-card overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-xl uppercase border border-border">
                      {integration.displayName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{integration.displayName}</h3>
                      <Badge variant="outline" className={`mt-1 ${getStatusColor(integration.status)}`}>
                        {integration.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{integration.description}</p>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-semibold flex items-center gap-1"><Info className="w-4 h-4 text-primary"/> Available Data:</span>
                    <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                      {integration.availableData.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                  {integration.limitations.length > 0 && (
                    <div>
                      <span className="font-semibold flex items-center gap-1"><AlertCircle className="w-4 h-4 text-amber-500"/> Limitations:</span>
                      <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                        {integration.limitations.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                
                {integration.errorMessage && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {integration.errorMessage}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {integration.status === "connected" && (
                     <span>Last sync: {integration.dataFreshness || 'Never'}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {integration.status === "connected" ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-background/50 border-border hover:bg-secondary"
                        onClick={() => handleSync(integration.provider)}
                        disabled={syncMutation.isPending}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                        Sync
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDisconnect(integration.provider)}>
                            <Unplug className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Disconnect</TooltipContent>
                      </Tooltip>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleConnect(integration.provider)}
                      disabled={connectMutation.isPending}
                    >
                      Connect <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
