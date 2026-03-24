import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetInbox, useGetCollaboration, useUpdateCollaboration } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useState } from "react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Clock, DollarSign, Calendar as CalendarIcon, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Inbox() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  
  // Need to map tab to status type based on schema
  const statusParam = activeTab === "all" ? undefined : activeTab as any;
  const { data, isLoading, refetch } = useGetInbox({ query: { status: statusParam }});
  
  const { data: collabDetail, isLoading: isDetailLoading } = useGetCollaboration(
    selectedCollabId || "", 
    { query: { enabled: !!selectedCollabId } }
  );
  
  const updateMutation = useUpdateCollaboration();
  const { toast } = useToast();

  if (isLoading) return <DashboardLayout><LoadingScreen message="Loading Inbox..." /></DashboardLayout>;

  const handleUpdateStatus = async (status: any) => {
    if (!selectedCollabId) return;
    try {
      await updateMutation.mutateAsync({ id: selectedCollabId, data: { status } });
      toast({ title: "Status Updated" });
      refetch();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const handleAddNote = async () => {
    if (!selectedCollabId || !noteContent.trim()) return;
    try {
      await updateMutation.mutateAsync({ id: selectedCollabId, data: { note: noteContent } });
      setNoteContent("");
      toast({ title: "Note Added" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">New</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500/20 text-amber-500 border-none">In Progress</Badge>;
      case 'accepted': return <Badge className="bg-green-500/20 text-green-500 border-none">Accepted</Badge>;
      case 'rejected': return <Badge className="bg-red-500/20 text-red-500 border-none">Rejected</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Collaboration CRM</h1>
            <p className="text-muted-foreground">Manage incoming requests from founders and brands.</p>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-secondary/50 border border-border mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
          </TabsList>

          <div className="grid gap-4">
            <AnimatePresence>
              {data?.items?.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCollabId(item.id)}
                >
                  <Card className="glass-card p-4 sm:p-6 cursor-pointer interactive-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(item.status)}
                        {item.hasUnreadNotes && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        <span className="text-sm text-muted-foreground">{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{item.subject}</h3>
                      <p className="text-sm text-muted-foreground">From: <span className="text-foreground font-medium">{item.senderName}</span> {item.senderEmail && `(${item.senderEmail})`}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      {item.budget && (
                        <div className="flex items-center gap-1 text-green-400">
                          <DollarSign className="w-4 h-4" /> {item.budget}
                        </div>
                      )}
                      {item.deadline && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" /> {format(new Date(item.deadline), "MMM d")}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
              {data?.items?.length === 0 && (
                <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/20">
                  <InboxIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">No requests found</h3>
                  <p className="text-muted-foreground">When founders request to collaborate, they'll appear here.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>

        {/* Detail Panel */}
        <Sheet open={!!selectedCollabId} onOpenChange={(open) => !open && setSelectedCollabId(null)}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-background/95 backdrop-blur-xl border-l-white/10 p-0">
            {isDetailLoading || !collabDetail ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="flex flex-col min-h-full">
                <div className="p-6 border-b border-border bg-card/50">
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(collabDetail.status)}
                    <span className="text-sm text-muted-foreground">{format(new Date(collabDetail.createdAt), "PPP p")}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{collabDetail.subject}</h2>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>From: <span className="text-foreground">{collabDetail.senderName}</span></p>
                    {collabDetail.senderEmail && <p>Email: <span className="text-foreground">{collabDetail.senderEmail}</span></p>}
                    {collabDetail.senderWallet && <p>Wallet: <span className="text-foreground font-mono text-xs">{collabDetail.senderWallet}</span></p>}
                  </div>
                </div>

                <div className="p-6 space-y-8 flex-1">
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleUpdateStatus('accepted')}>Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus('in_progress')}>Mark In Progress</Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={() => handleUpdateStatus('rejected')}>Reject</Button>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Budget</p>
                      <p className="font-semibold">{collabDetail.budget || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> Deadline</p>
                      <p className="font-semibold">{collabDetail.deadline ? format(new Date(collabDetail.deadline), "PPP") : "Flexible"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{collabDetail.description || "No description provided."}</p>
                  </div>

                  {collabDetail.deliverables && collabDetail.deliverables.length > 0 && (
                    <div>
                      <h4 className="font-bold mb-2 flex items-center gap-2"><Tag className="w-4 h-4"/> Deliverables</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {collabDetail.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Notes Thread */}
                  <div className="border-t border-border pt-8">
                    <h4 className="font-bold mb-4">Internal Notes</h4>
                    <div className="space-y-4 mb-6">
                      {collabDetail.notes?.map(note => (
                        <div key={note.id} className="p-3 rounded-lg bg-card border border-border">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2 text-right">{format(new Date(note.createdAt), "MMM d, h:mm a")}</p>
                        </div>
                      ))}
                      {(!collabDetail.notes || collabDetail.notes.length === 0) && (
                        <p className="text-sm text-muted-foreground italic">No notes yet.</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Add a private note..." 
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                        className="min-h-[80px] bg-background/50"
                      />
                      <Button className="h-auto" onClick={handleAddNote} disabled={!noteContent.trim() || updateMutation.isPending}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
