import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import ForgotPassword from "@/pages/ForgotPassword";
import DashboardHome from "@/pages/DashboardHome";
import Profile from "@/pages/Profile";
import Support from "@/pages/Support";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* App routes with sidebar layout */}
      <Route path="/app/profile">
        <AppLayout>
          <Profile />
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
  // Custom sidebar width for crypto mining platform
  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full bg-black">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">
            <SidebarTrigger data-testid="button-sidebar-toggle" className="text-white hover:text-neon-purple" />
            <div className="text-sm text-white/60">
              Welcome to Ranking Mining Platform
            </div>
          </header>
          <main className="flex-1 overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
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
