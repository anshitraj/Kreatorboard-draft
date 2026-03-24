import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass } from "lucide-react";

export function PublicNavbar() {
  const { user, isLoading } = useAuth(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                Kreatorboard
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Product
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How it works
              </a>
              <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Discover
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-9 bg-muted animate-pulse rounded-lg" />
            ) : user ? (
              <Link href="/dashboard">
                <Button size="sm" className="font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { window.location.href = `/api/login?returnTo=/dashboard`; }}
                  className="font-medium text-muted-foreground hover:text-foreground hidden sm:flex"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => { window.location.href = `/api/login?returnTo=/dashboard`; }}
                  className="font-semibold bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
