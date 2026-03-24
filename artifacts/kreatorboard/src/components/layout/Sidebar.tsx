import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Puzzle, 
  Inbox, 
  Calendar, 
  Wallet, 
  UserCircle, 
  Globe,
  Settings,
  LogOut,
  ShieldAlert
} from "lucide-react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Inbox, label: "Inbox", href: "/dashboard/inbox" },
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Wallet, label: "Payments", href: "/dashboard/payments" },
  { icon: Puzzle, label: "Integrations", href: "/dashboard/integrations" },
  { icon: UserCircle, label: "Profile Editor", href: "/dashboard/profile" },
  { icon: Globe, label: "Discover", href: "/discover", external: true },
];

export function Sidebar() {
  const [location] = useLocation();
  const { data: user } = useGetMe();
  const { mutate: logout } = useLogout();

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-display font-bold text-white text-lg leading-none">K</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Kreatorboard
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "text-primary-foreground bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-transparent border border-primary/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
              <span className="font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-2 px-3">
              Admin
            </div>
            <Link 
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                location.startsWith("/admin") 
                  ? "text-destructive bg-destructive/10 border border-destructive/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <ShieldAlert className="w-5 h-5" />
              <span className="font-medium">System Health</span>
            </Link>
          </>
        )}
      </div>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Creator'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
