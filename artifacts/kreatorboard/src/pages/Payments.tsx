import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetWallets, useGetPaymentRequests, useCreatePaymentRequest } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Copy, ExternalLink, Plus, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Payments() {
  const { data: wallets, isLoading: wLoad } = useGetWallets();
  const { data: requests, isLoading: rLoad, refetch } = useGetPaymentRequests();
  const createMutation = useCreatePaymentRequest();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", amount: "", currency: "USDC", walletId: "" });

  if (wLoad || rLoad) return <DashboardLayout><LoadingScreen message="Loading Wallet Data..." /></DashboardLayout>;

  const handleCreate = async () => {
    if (!formData.title || !formData.amount || !formData.walletId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      await createMutation.mutateAsync({ data: formData });
      setIsDialogOpen(false);
      setFormData({ title: "", amount: "", currency: "USDC", walletId: "" });
      toast({ title: "Payment Request Created", description: "You can now share the link." });
      refetch();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Wallet & Payments</h1>
            <p className="text-muted-foreground">Manage your crypto payouts and payment requests.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> New Payment Request
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/10 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Create Payment Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title / Purpose</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Q3 Sponsorship Video" className="bg-background/50" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="500" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={formData.currency} onValueChange={v => setFormData({...formData, currency: v})}>
                      <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Receive to Wallet</Label>
                  <Select value={formData.walletId} onValueChange={v => setFormData({...formData, walletId: v})}>
                    <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select a connected wallet" /></SelectTrigger>
                    <SelectContent>
                      {wallets?.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.chainName} - {w.address.slice(0,6)}...{w.address.slice(-4)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full h-12 text-lg font-bold">
                Generate Link
              </Button>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallets */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold">Connected Wallets</h2>
            {wallets?.map(wallet => (
              <Card key={wallet.id} className="glass-card p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-background/50 border-border">{wallet.chainName}</Badge>
                    {wallet.isPrimary && <Badge className="bg-primary text-white border-none">Primary Payout</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-muted-foreground" />
                    <span className="font-mono font-medium text-lg">{wallet.address.slice(0,6)}...{wallet.address.slice(-4)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => copyToClipboard(wallet.address)}>
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-400 mt-4">
                    <CheckCircle2 className="w-3 h-3" /> Signature Verified
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-6 border-dashed border-border bg-secondary/30 text-center hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => toast({ title: "WalletConnect Modal", description: "Simulating Reown AppKit open..."})}>
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-4 border border-border">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-bold mb-1">Connect Another Wallet</h3>
              <p className="text-xs text-muted-foreground">Support for EVM and Solana</p>
            </Card>
          </div>

          {/* Requests */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Payment Requests</h2>
            
            {requests && requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map(req => (
                  <Card key={req.id} className="p-4 sm:p-5 bg-card/40 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg">{req.title}</h4>
                        {req.status === 'paid' ? (
                          <Badge className="bg-green-500/20 text-green-400 border-none">Paid</Badge>
                        ) : req.status === 'pending' ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border-none">Pending</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Cancelled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {format(new Date(req.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                      <div className="text-right">
                        <p className="font-display font-bold text-xl text-primary">{req.amount} {req.currency}</p>
                      </div>
                      
                      {req.status === 'pending' && req.paymentLink && (
                        <Button variant="outline" size="sm" className="bg-background/50" onClick={() => copyToClipboard(`https://${req.paymentLink}`)}>
                          <Copy className="w-4 h-4 mr-2" /> Link
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-20 text-center bg-secondary/20 border-dashed border-border">
                <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No payment requests yet</h3>
                <p className="text-muted-foreground mb-6">Create a request to get a shareable payment link.</p>
                <Button onClick={() => setIsDialogOpen(true)}>Create Request</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
