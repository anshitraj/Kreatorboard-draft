import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Inbox, 
  Calendar as CalendarIcon, 
  Wallet, 
  UserCircle, 
  LogOut,
  Zap,
  ShieldAlert,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, logout } = useAuth(true);
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground font-medium text-sm">Initializing OS...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Integrations", path: "/dashboard/integrations", icon: LinkIcon },
    { name: "Inbox", path: "/dashboard/inbox", icon: Inbox },
    { name: "Calendar", path: "/dashboard/calendar", icon: CalendarIcon },
    { name: "Payments", path: "/dashboard/payments", icon: Wallet },
    { name: "Profile", path: "/dashboard/profile", icon: UserCircle },
  ];

  if (user.role === "admin") {
    navItems.push({ name: "Admin Panel", path: "/admin", icon: ShieldAlert });
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-lg uppercase tracking-tight text-foreground">
            Kreatorboard
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== "/dashboard" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <div className={`
                flex items-center gap-3 px-3 py-2.5 rounded font-medium transition-all duration-150 cursor-pointer text-sm
                ${isActive 
                  ? "bg-primary/12 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
                }
              `}>
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="editorial-card rounded p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatarUrl || `${import.meta.env.BASE_URL}images/avatar-placeholder.png`} 
              alt={user.name || "User"} 
              className="w-9 h-9 rounded bg-secondary object-cover border border-border"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user.name || "Creator"}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-colors rounded text-xs"
            onClick={logout}
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-black text-lg uppercase tracking-tight">Kreatorboard</span>
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground w-9 h-9">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-sidebar-border">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
