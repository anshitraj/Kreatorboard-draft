import { useGetPublicProfile } from "@workspace/api-client-react";
import { useParams, Link as WouterLink } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { MapPin, Globe, Wallet, Calendar, Sparkles, LayoutGrid, CheckCircle2 } from "lucide-react";

export default function PublicProfile() {
  const params = useParams();
  const { data: profile, isLoading, isError } = useGetPublicProfile(params.handle || "");

  if (isLoading) return <LoadingScreen message="Loading Profile..." />;
  if (isError || !profile) return (
    <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold">Profile Not Found</h1>
      <WouterLink href="/"><Button>Return Home</Button></WouterLink>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-primary/40 to-accent/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar & Left Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="p-2 bg-background rounded-3xl shadow-xl w-40 h-40">
              <img 
                src={profile.avatarUrl || `${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
                alt={profile.displayName || profile.handle}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-display font-bold">{profile.displayName || profile.handle}</h1>
                <p className="text-primary font-medium">@{profile.handle}</p>
              </div>

              {profile.location && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </div>
              )}

              {profile.website && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Globe className="w-4 h-4" /> 
                  <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              {profile.connectedWalletAddress && (
                <div className="flex items-center gap-2 text-sm px-3 py-2 bg-secondary/50 rounded-lg border border-border">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                    {profile.connectedWalletAddress.slice(0,6)}...{profile.connectedWalletAddress.slice(-4)}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {profile.openToCollaboration && (
                <Button className="w-full h-12 text-md font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                  <Sparkles className="w-4 h-4 mr-2" /> Request Collab
                </Button>
              )}
              {profile.calComLink && (
                <Button variant="outline" className="w-full h-12 text-md font-bold glass-card" onClick={() => window.open(`https://${profile.calComLink}`, '_blank')}>
                  <Calendar className="w-4 h-4 mr-2" /> Book a Call
                </Button>
              )}
            </div>
            
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Socials</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.socialLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors capitalize">
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 flex flex-col gap-8 pt-4 md:pt-24">
            
            {/* Bio & Niches */}
            <div className="space-y-6">
              {profile.bio && (
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                  {profile.bio}
                </div>
              )}
              
              {profile.niches && profile.niches.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.niches.map((n, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1 bg-primary/10 border-primary/20 text-primary-foreground text-sm font-medium">
                      {n}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-bold">Services</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.services.map(s => (
                    <Card key={s.id} className="glass-card p-5 border-white/5 flex flex-col h-full hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/50">
                        <div>
                          <p className="font-display font-bold text-xl text-primary">{s.price} {s.currency}</p>
                          <p className="text-xs text-muted-foreground">{s.deliveryTime}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {profile.portfolio && profile.portfolio.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6" /> Selected Work
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.portfolio.map(p => (
                    <a key={p.id} href={p.url || "#"} target="_blank" rel="noreferrer" className="block group">
                      <Card className="glass-card overflow-hidden border-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(123,97,255,0.15)] group-hover:border-primary/30">
                        {p.imageUrl && (
                          <div className="h-40 overflow-hidden bg-secondary">
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                        </div>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
