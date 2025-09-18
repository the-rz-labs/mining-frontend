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
    { name: "Home", href: "#home" },
    { name: "Mining Plans", href: "#plans" },
    { name: "Live Stats", href: "#stats" },
    { name: "Tokens", href: "#tokens" },
    { name: "Boost Rewards", href: "#referral" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-neon-purple/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  data-testid={`nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                  className="text-white/80 hover:text-neon-purple transition-all duration-300 px-4 py-2 rounded-lg text-sm font-medium relative group hover-elevate"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                data-testid="button-sign-in"
                className="text-white/90 border border-white/10 rounded-lg backdrop-blur-sm hover-elevate"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                data-testid="button-sign-up"
                className="bg-gradient-to-r from-neon-green to-mining-orange text-white font-semibold rounded-lg border border-white/10 hover-elevate active-elevate-2"
              >
                Sign Up
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
              className="text-white/90 border border-white/10 rounded-lg hover-elevate"
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
        <div id="mobile-menu" className="md:hidden bg-black/30 backdrop-blur-xl border-t border-white/10 transform transition-all duration-300 ease-out translate-y-0 opacity-100" role="menu">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                className="text-white/90 hover:text-neon-purple block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 relative group hover-elevate"
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
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            ))}
            <div className="flex flex-col space-y-3 px-4 py-4 border-t border-white/10 mt-4">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  data-testid="mobile-button-sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-center text-white/90 border border-white/10 rounded-lg h-12 hover-elevate"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  data-testid="mobile-button-sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-neon-green to-mining-orange text-white font-semibold rounded-lg h-12 hover-elevate active-elevate-2"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}