import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMyProfile, useUpdateMyProfile } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save, Lock, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { data: profile, isLoading } = useGetMyProfile();
  const updateMutation = useUpdateMyProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        calComLink: profile.calComLink || "",
        isPublic: profile.isPublic,
        openToCollaboration: profile.openToCollaboration,
        niches: profile.niches?.join(", ") || "", // simplifying array to string for basic input
      });
    }
  }, [profile]);

  if (isLoading || !profile) return <DashboardLayout><LoadingScreen message="Loading Profile Editor..." /></DashboardLayout>;

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        niches: formData.niches.split(",").map((n: string) => n.trim()).filter(Boolean)
      };
      await updateMutation.mutateAsync({ data: payload });
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
    } catch (e: any) {
      toast({ title: "Update Failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-20">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 sm:top-0 bg-background/80 backdrop-blur-xl z-10 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">Manage how founders and brands see you.</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/c/${profile.handle}`} target="_blank">
              <Button variant="outline" className="glass-card">
                Preview <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button 
              onClick={handleSave} 
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              {updateMutation.isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </header>

        <div className="grid gap-8">
          {/* Visuals */}
          <Card className="glass-card p-6 border-white/5">
            <h3 className="font-bold text-lg mb-6">Visuals</h3>
            <div className="space-y-6">
              <div>
                <Label className="block mb-3">Banner Image</Label>
                <div className="w-full h-32 rounded-xl bg-secondary/50 border border-dashed border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer group">
                  <div className="text-center group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload banner (1500x500)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden relative group cursor-pointer">
                  <img src={profile.avatarUrl || `${import.meta.env.BASE_URL}images/avatar-placeholder.png`} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <Label>Avatar Image</Label>
                  <p className="text-sm text-muted-foreground mt-1">Recommended size 400x400px.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="glass-card p-6 border-white/5 space-y-6">
            <h3 className="font-bold text-lg">Basic Information</h3>
            
            <div className="space-y-2">
              <Label>Handle (URL)</Label>
              <div className="relative">
                <Input value={profile.handle} disabled className="bg-secondary/30 pr-10" />
                <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Handles cannot be changed once set.</p>
            </div>

            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="bg-background/50" />
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="bg-background/50 min-h-[120px]" 
                placeholder="Tell your story..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-background/50" placeholder="e.g. San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label>Niches (comma separated)</Label>
                <Input value={formData.niches} onChange={e => setFormData({...formData, niches: e.target.value})} className="bg-background/50" placeholder="Web3, DeFi, Content" />
              </div>
            </div>
          </Card>

          {/* Links & Visibility */}
          <Card className="glass-card p-6 border-white/5 space-y-6">
            <h3 className="font-bold text-lg">Links & Preferences</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Personal Website</Label>
                <Input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="bg-background/50" placeholder="https://" />
              </div>
              <div className="space-y-2">
                <Label>Cal.com Link</Label>
                <Input value={formData.calComLink} onChange={e => setFormData({...formData, calComLink: e.target.value})} className="bg-background/50" placeholder="cal.com/your-name" />
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border">
                <div>
                  <h4 className="font-medium">Public Profile</h4>
                  <p className="text-sm text-muted-foreground">Allow your profile to be viewed by anyone.</p>
                </div>
                <Switch checked={formData.isPublic} onCheckedChange={v => setFormData({...formData, isPublic: v})} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border">
                <div>
                  <h4 className="font-medium">Open to Collaboration</h4>
                  <p className="text-sm text-muted-foreground">Show the "Request Collaboration" button on your profile.</p>
                </div>
                <Switch checked={formData.openToCollaboration} onCheckedChange={v => setFormData({...formData, openToCollaboration: v})} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
