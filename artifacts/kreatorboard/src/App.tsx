import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Landing from "@/pages/Landing";
import Discover from "@/pages/Discover";
import PublicProfile from "@/pages/PublicProfile";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Integrations from "@/pages/Integrations";
import Inbox from "@/pages/Inbox";
import Calendar from "@/pages/Calendar";
import Payments from "@/pages/Payments";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/discover" component={Discover} />
      <Route path="/c/:handle" component={PublicProfile} />
      
      {/* Protected Routes - Auth logic is handled inside layout/pages via useAuth hook */}
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/integrations" component={Integrations} />
      <Route path="/dashboard/inbox" component={Inbox} />
      <Route path="/dashboard/calendar" component={Calendar} />
      <Route path="/dashboard/payments" component={Payments} />
      <Route path="/dashboard/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
