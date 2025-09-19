import { Home, User, HelpCircle, MessageSquare, Settings, Users, Gift } from "lucide-react";
import { Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

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

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-white/10 bg-black/40 backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/10 p-6">
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
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 text-xs uppercase tracking-wider font-semibold px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-neon-purple/20 data-[active=true]:text-neon-purple border-0">
                    <Link href={item.href} data-testid={item.testId}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="text-center">
          <p className="text-xs text-white/40">v1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}