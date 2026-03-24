import { useAuth } from "@/hooks/use-auth";
import { useCompleteOnboarding, useGetMyProfile, useGenerateDashboard, useGetMyIntegrations } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const { user, isLoading: isAuthLoading } = useAuth(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: profile } = useGetMyProfile();
  const { data: integrations } = useGetMyIntegrations();
  
  const completeMutation = useCompleteOnboarding();
  const generateMutation = useGenerateDashboard();

  const [step, setStep] = useState(1);
  const [handle, setHandle] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (user?.onboardingComplete) {
      setLocation("/dashboard");
    } else if (user?.onboardingStep && user.onboardingStep > step) {
      setStep(user.onboardingStep);
    }
    if (profile?.handle) {
      setHandle(profile.handle);
      setIsPublic(profile.isPublic);
    }
  }, [user, profile, step, setLocation]);

  if (isAuthLoading || !user) return null;

  const handleNext = async () => {
    try {
      if (step === 2 && !handle.trim()) {
        toast({ title: "Handle required", variant: "destructive" });
        return;
      }

      if (step === 3) {
        const connectedCount = integrations?.filter(i => i.status === "connected").length || 0;
        if (connectedCount === 0) {
          toast({ title: "Please connect at least one account to continue", variant: "destructive" });
          return;
        }
      }

      if (step === 4) {
        await generateMutation.mutateAsync();
      }

      const res = await completeMutation.mutateAsync({
        data: {
          step,
          data: step === 2 ? { handle, isPublic } : {}
        }
      });

      if (res.complete) {
        setLocation("/dashboard");
      } else {
        setStep(res.currentStep);
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to proceed", 
        variant: "destructive" 
      });
    }
  };

  const steps = [
    { num: 1, title: "Welcome" },
    { num: 2, title: "Identity" },
    { num: 3, title: "Connect" },
    { num: 4, title: "Generate" },
    { num: 5, title: "Launch" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {steps.map(s => (
              <div key={s.num} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  step >= s.num ? 'bg-primary text-white shadow-[0_0_20px_rgba(123,97,255,0.4)]' : 'bg-secondary text-muted-foreground'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-8 sm:p-10 border-border/50">
              {step === 1 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">👋</span>
                  </div>
                  <h1 className="text-3xl font-display font-bold">Welcome to Kreatorboard</h1>
                  <p className="text-muted-foreground text-lg">
                    We're setting up your workspace, {user.name || "Creator"}. Get ready to manage your entire business on-chain.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">Claim your identity</h2>
                    <p className="text-muted-foreground">This will be your unique URL.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="handle">Creator Handle</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                          kreatorboard.com/c/
                        </span>
                        <Input 
                          id="handle"
                          value={handle}
                          onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="pl-44 h-14 text-lg bg-background/50"
                          placeholder="your-name"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/30 mt-6">
                      <div className="space-y-1">
                        <Label className="text-base">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile discoverable to founders.</p>
                      </div>
                      <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2">Connect your world</h2>
                    <p className="text-muted-foreground">Connect at least one account to power your dashboard.</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {integrations?.filter(i => ["twitter", "youtube", "discord", "wallet"].includes(i.provider) || true).slice(0, 4).map(int => (
                      <div key={int.provider} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">{int.displayName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{int.status}</p>
                          </div>
                        </div>
                        <Button 
                          variant={int.status === "connected" ? "outline" : "default"}
                          size="sm"
                          className={int.status === "connected" ? "border-green-500/50 text-green-400" : ""}
                          onClick={() => {
                            // Mocking connection for onboarding flow ease
                            toast({ title: "Connection simulation", description: "In real app, this redirects to OAuth."});
                          }}
                        >
                          {int.status === "connected" ? "Connected" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center space-y-8 py-10">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-2">Building your OS</h2>
                    <p className="text-muted-foreground">Analyzing connections, fetching metrics, and generating your custom dashboard layout...</p>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center space-y-8 py-8">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-border">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </div>
                  <h2 className="text-4xl font-display font-bold">You're all set!</h2>
                  <p className="text-xl text-muted-foreground">
                    Your Kreatorboard is ready. Let's start building your empire.
                  </p>
                </div>
              )}

              <div className="mt-10 flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleNext}
                  disabled={completeMutation.isPending || generateMutation.isPending}
                  className="w-full sm:w-auto px-8"
                >
                  {(completeMutation.isPending || generateMutation.isPending) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : step === 5 ? (
                    "Go to Dashboard"
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
