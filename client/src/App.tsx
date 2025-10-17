import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
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
import Miners from "@/pages/Miners";
import MiningHistory from "@/pages/MiningHistory";
import Earnings from "@/pages/Earnings";
import Referrals from "@/pages/Referrals";
import Giveaways from "@/pages/Giveaways";
import Support from "@/pages/Support";
import FAQ from "@/pages/FAQ";
import Achievements from "@/pages/Achievements";
import Contact from "@/pages/Contact";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/not-found";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!token) {
      setLocation('/sign-in');
    }
  }, [token, setLocation]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* App routes with top navigation layout - Protected */}
      <Route path="/app/profile">
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/miners">
        <ProtectedRoute>
          <AppLayout>
            <Miners />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/history">
        <ProtectedRoute>
          <AppLayout>
            <MiningHistory />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/earnings">
        <ProtectedRoute>
          <AppLayout>
            <Earnings />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/referrals">
        <ProtectedRoute>
          <AppLayout>
            <Referrals />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/giveaways">
        <ProtectedRoute>
          <AppLayout>
            <Giveaways />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/support">
        <ProtectedRoute>
          <AppLayout>
            <Support />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/faq">
        <ProtectedRoute>
          <AppLayout>
            <FAQ />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app/achievements">
        <ProtectedRoute>
          <AppLayout>
            <Achievements />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/app">
        <ProtectedRoute>
          <AppLayout>
            <DashboardHome />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Modern Background Effects matching sign-in page */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-mining-orange/30 rounded-full blur-3xl animate-float opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl animate-breathing opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-neon-purple/20 to-mining-orange/20 rounded-full blur-3xl animate-float opacity-50 hidden sm:block" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-50"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60 hidden md:block"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-neon-purple rounded-full animate-float opacity-40 hidden lg:block" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-mining-orange rounded-full animate-float opacity-50 hidden md:block" style={{ animationDelay: "3s" }}></div>
      </div>
      
      <ModernSidebar />
      <div className="flex flex-col flex-1 relative z-10">
        <MinimalHeader />
        <main className="flex-1 overflow-auto p-6">
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
