import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { useDiscoverCreators } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Input } from "@/components/ui/input";
import { Search, Compass } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

function useLocalDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Discover() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useLocalDebounce(search, 500);

  const { data, isLoading } = useDiscoverCreators({ 
    query: { niche: debouncedSearch || undefined } 
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Discover Creators</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect web3 native creators for your next campaign. 
            Connect directly, view real metrics, and pay on-chain.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
          <div className="relative relative glass-card p-2 rounded-2xl flex items-center">
            <Search className="w-5 h-5 ml-3 text-muted-foreground" />
            <Input 
              placeholder="Search by niche, ecosystem, or name..." 
              className="border-none bg-transparent h-12 text-lg focus-visible:ring-0 px-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingScreen />
        ) : data?.items?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((creator) => (
              <Link key={creator.handle} href={`/c/${creator.handle}`}>
                <Card className="glass-card p-6 h-full interactive-card cursor-pointer border-white/5 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                      <img 
                        src={creator.avatarUrl || `${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
                        alt={creator.displayName || creator.handle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-lg truncate">{creator.displayName || creator.handle}</h3>
                      <p className="text-primary text-sm truncate">@{creator.handle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {creator.bio || "No bio provided."}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {creator.niches?.slice(0, 3).map((n, i) => (
                      <Badge key={i} variant="secondary" className="bg-secondary/50 text-xs font-medium">
                        {n}
                      </Badge>
                    ))}
                    {creator.openToCollaboration && (
                      <Badge className="bg-green-500/20 text-green-400 border-none text-xs ml-auto">
                        Available
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Compass className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No creators found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
