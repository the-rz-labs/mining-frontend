import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import Logo from "./Logo";

interface NavigationProps {
  // No auth props needed - using navigation instead
}

export default function Navigation({ }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home", isRoute: false },
    { name: "Live Stats", href: "#stats", isRoute: false },
    { name: "Mining Plans", href: "#plans", isRoute: false },
    { name: "Tokens", href: "#tokens", isRoute: false },
    { name: "Boost Rewards", href: "#referral", isRoute: false },
    { name: "Contact", href: "/contact", isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50  bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-neon-purple/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-12">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link key={item.name} href={item.href}>
                    <span
                      data-testid={`nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                      className="text-white/80 hover:text-white transition-all duration-300 text-base font-medium relative group hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] cursor-pointer"
                    >
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    data-testid={`nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                    className="text-white/80 hover:text-white transition-all duration-300 text-base font-medium relative group hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.name}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center">
            <Link href="/sign-up">
              <Button
                data-testid="button-sign-up"
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium rounded-full px-8 py-2 text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Start Mining
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-xl border-t border-white/10" role="menu">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link key={item.name} href={item.href}>
                  <span
                    data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                    className="text-white/80 hover:text-white block px-4 py-3 text-base font-medium transition-all duration-300 hover:bg-white/5 rounded-lg mx-2 cursor-pointer"
                    role="menuitem"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                  className="text-white/80 hover:text-white block px-4 py-3 text-base font-medium transition-all duration-300 hover:bg-white/5 rounded-lg mx-2"
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </a>
              )
            ))}
            <div className="pt-4 border-t border-gray-800 mt-4">
              <Link href="/sign-up">
                <Button
                  data-testid="mobile-button-sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-full h-12"
                >
                  Start Mining
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}