import { useState, useEffect, useRef } from "react";
import { Bell, Menu, X, Home, User, Trophy, Users, Gift, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import Logo from "@/components/Logo";
import { useAppKitAccount } from "@reown/appkit/react";
import { queryClient } from "@/lib/queryClient";

const navigationItems = [
  { title: "Dashboard", href: "/app", icon: Home },
  { title: "Profile", href: "/app/profile", icon: User },
  { title: "Achievements", href: "/app/achievements", icon: Trophy },
  { title: "Referrals", href: "/app/referrals", icon: Users },
  { title: "Giveaways", href: "/app/giveaways", icon: Gift },
  { title: "Support", href: "/app/support", icon: MessageSquare },
  { title: "FAQ", href: "/app/faq", icon: HelpCircle },
];

export function MinimalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { address, isConnected } = useAppKitAccount();
  const prevConnectedRef = useRef<boolean>(false);

  // Handle wallet disconnect - clear cache and logout
  useEffect(() => {
    // If was connected and now disconnected
    if (prevConnectedRef.current && !isConnected) {
      // Clear all query cache
      queryClient.clear();
      
      // Redirect to home page
      navigate("/");
    }
    
    // Update the ref for next render
    prevConnectedRef.current = isConnected;
  }, [isConnected, navigate]);

  return (
    <>
      <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-6 shadow-lg shadow-neon-purple/10">
        {/* Mobile menu button and logo */}
        <div className="flex items-center space-x-4 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Logo />
        </div>
        
        {/* Desktop - Empty left side since logo is in sidebar */}
        <div className="hidden lg:block"></div>

        {/* Right side with user actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/5">
            <Bell className="w-5 h-5" />
          </Button>
          <appkit-account-button />
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 p-6">
            <div className="flex items-center justify-between mb-8">
              <Logo />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location === item.href || (item.href === "/app" && location === "/app");
                
                return (
                  <Link key={item.title} href={item.href}>
                    <Button
                      variant="ghost"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full justify-start space-x-3 h-12 text-left font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-neon-purple/20 to-neon-purple/10 text-neon-purple border border-neon-purple/30' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
