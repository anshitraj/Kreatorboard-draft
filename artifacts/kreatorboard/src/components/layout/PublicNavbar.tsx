import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass } from "lucide-react";

export function PublicNavbar() {
  const { user, isLoading } = useAuth(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                Kreatorboard
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Discover Creators
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-24 h-10 bg-muted animate-pulse rounded-lg" />
            ) : user ? (
              <Link href="/dashboard">
                <Button className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => window.location.href = `/__replauthv2/login?redirect=/dashboard`}
                className="font-semibold bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
