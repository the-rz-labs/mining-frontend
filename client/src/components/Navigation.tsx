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
    { name: "Solutions", href: "#plans" },
    { name: "Pricing", href: "#tokens" },
    { name: "Resources", href: "#referral" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  data-testid={`nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-normal"
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
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                data-testid="button-login"
                className="text-gray-300 hover:text-white font-normal text-sm"
              >
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                variant="outline"
                data-testid="button-sign-up"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-normal text-sm px-6 py-2 rounded-full transition-all duration-200"
              >
                Sign up
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
        <div id="mobile-menu" className="md:hidden bg-gray-900/95 backdrop-blur-xl" role="menu">
          <div className="px-6 pt-4 pb-6 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                className="text-gray-300 hover:text-white block px-4 py-3 text-base font-normal transition-all duration-200"
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
            ))}
            <div className="pt-4 border-t border-gray-700 mt-4 space-y-2">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  data-testid="mobile-button-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-gray-300 hover:text-white font-normal"
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="outline"
                  data-testid="mobile-button-sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full border-gray-600 text-gray-300 hover:text-white font-normal rounded-full"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}