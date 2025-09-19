import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModernSidebar } from "@/components/ModernSidebar";
import { MinimalHeader } from "@/components/MinimalHeader";
import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import ForgotPassword from "@/pages/ForgotPassword";
import DashboardHome from "@/pages/DashboardHome";
import Profile from "@/pages/Profile";
import Referrals from "@/pages/Referrals";
import Giveaways from "@/pages/Giveaways";
import Support from "@/pages/Support";
import FAQ from "@/pages/FAQ";
import Achievements from "@/pages/Achievements";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* App routes with top navigation layout */}
      <Route path="/app/profile">
        <AppLayout>
          <Profile />
        </AppLayout>
      </Route>
      <Route path="/app/referrals">
        <AppLayout>
          <Referrals />
        </AppLayout>
      </Route>
      <Route path="/app/giveaways">
        <AppLayout>
          <Giveaways />
        </AppLayout>
      </Route>
      <Route path="/app/support">
        <AppLayout>
          <Support />
        </AppLayout>
      </Route>
      <Route path="/app/faq">
        <AppLayout>
          <FAQ />
        </AppLayout>
      </Route>
      <Route path="/app/achievements">
        <AppLayout>
          <Achievements />
        </AppLayout>
      </Route>
      <Route path="/app">
        <AppLayout>
          <DashboardHome />
        </AppLayout>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <ModernSidebar />
      <div className="flex flex-col flex-1">
        <MinimalHeader />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-black via-purple-900/20 to-black p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  // Enable dark mode by default for the futuristic theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground antialiased">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
