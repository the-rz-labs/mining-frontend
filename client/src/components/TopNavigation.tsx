import { useState } from "react";
import { Home, User, HelpCircle, MessageSquare, Settings, Users, Gift, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Navigation items
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

function NavItem({ item, isMobile = false, onClick }: { 
  item: typeof navigationItems[0]; 
  isMobile?: boolean;
  onClick?: () => void;
}) {
  const [location] = useLocation();
  const isActive = location === item.href || (item.href === "/app" && location === "/app");

  return (
    <Link href={item.href} data-testid={item.testId}>
      <Button
        variant="ghost"
        className={`
          ${isMobile ? 'w-full justify-start' : 'h-auto px-4 py-2'}
          text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300
          ${isActive ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' : 'border border-transparent'}
          hover-elevate
        `}
        onClick={onClick}
      >
        <item.icon className={`${isMobile ? 'mr-3' : 'mr-2'} w-5 h-5`} />
        <span className="font-medium">{item.title}</span>
      </Button>
    </Link>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:text-neon-purple hover:bg-white/10"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-green rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                  Ranking
                </h2>
                <p className="text-xs text-white/60">Mining Platform</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">
                Navigation
              </p>
              {navigationItems.map((item) => (
                <NavItem 
                  key={item.title} 
                  item={item} 
                  isMobile={true}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/40">v1.0.0</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function TopNavigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/app" data-testid="link-logo">
            <div className="flex items-center space-x-3 hover-elevate p-2 rounded-lg transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-green rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                  Ranking
                </h2>
                <p className="text-xs text-white/60 -mt-1">Mining Platform</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message - Hidden on mobile */}
            <div className="hidden lg:block text-sm text-white/60">
              Welcome to Ranking Mining Platform
            </div>

            {/* Mobile Menu */}
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}