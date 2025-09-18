import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavigationProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

export default function Navigation({ onSignIn, onSignUp }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Mining Plans", href: "#plans" },
    { name: "Live Stats", href: "#stats" },
    { name: "Tokens", href: "#tokens" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
                  className="text-foreground hover:text-neon-purple transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium hover-elevate"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Navigating to ${item.name}`);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              data-testid="button-sign-in"
              onClick={() => {
                console.log("Sign In clicked");
                onSignIn?.();
              }}
              className="text-foreground hover:text-neon-purple"
            >
              Sign In
            </Button>
            <Button
              data-testid="button-sign-up"
              onClick={() => {
                console.log("Sign Up clicked");
                onSignUp?.();
              }}
              className="bg-gradient-to-r from-neon-purple to-mining-orange text-white font-semibold hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                className="text-foreground hover:text-neon-purple block px-3 py-2 rounded-md text-base font-medium hover-elevate"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Mobile nav: ${item.name}`);
                  setMobileMenuOpen(false);
                }}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Button
                variant="ghost"
                data-testid="mobile-button-sign-in"
                onClick={() => {
                  console.log("Mobile Sign In clicked");
                  onSignIn?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-foreground hover:text-neon-purple"
              >
                Sign In
              </Button>
              <Button
                data-testid="mobile-button-sign-up"
                onClick={() => {
                  console.log("Mobile Sign Up clicked");
                  onSignUp?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-neon-purple to-mining-orange text-white font-semibold"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}