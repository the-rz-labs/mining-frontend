import { Home, User, HelpCircle, MessageSquare, Users, Gift, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

// Navigation items matching modern dashboard layout
const navigationItems = [
  {
    title: "Dashboard",
    href: "/app",
    icon: Home,
    testId: "link-nav-dashboard",
  },
  {
    title: "Profile", 
    href: "/app/profile",
    icon: User,
    testId: "link-nav-profile",
  },
  {
    title: "Achievements",
    href: "/app/achievements", 
    icon: Trophy,
    testId: "link-nav-achievements",
  },
  {
    title: "Referrals",
    href: "/app/referrals",
    icon: Users, 
    testId: "link-nav-referrals",
  },
  {
    title: "Giveaways",
    href: "/app/giveaways",
    icon: Gift,
    testId: "link-nav-giveaways",
  },
  {
    title: "Support",
    href: "/app/support", 
    icon: MessageSquare,
    testId: "link-nav-support",
  },
  {
    title: "FAQ",
    href: "/app/faq",
    icon: HelpCircle,
    testId: "link-nav-faq",
  },
];

export function ModernSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 h-screen bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Sidebar content */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {navigationItems.map((item) => {
            const isActive = location === item.href || (item.href === "/app" && location === "/app");
            
            return (
              <Link key={item.title} href={item.href} data-testid={item.testId}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start space-x-3 h-11 text-left font-medium transition-all duration-200 hover-elevate ${
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

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-white/40">v1.0.0</p>
        </div>
      </div>
    </div>
  );
}