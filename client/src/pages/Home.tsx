import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LiveStats from "@/components/LiveStats";
import MiningPlansSection from "@/components/MiningPlansSection";
import TokenChartsSection from "@/components/TokenChartsSection";
import ReferralSection from "@/components/ReferralSection";
import Footer from "@/components/Footer";
import { type MiningPlan } from "@/components/MiningPlanCard";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleStartMining = (plan?: MiningPlan) => {
    if (plan) {
      console.log(`Starting mining for ${plan.name} (${plan.token})`);
      // todo: remove mock functionality - implement real mining start logic
    }
    // For now, just scroll to plans section or show auth if needed
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignIn = () => {
    console.log("Sign In clicked");
    setAuthMode("signin");
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked");
    setAuthMode("signup");
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      {/* Navigation */}
      <Navigation
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection
          onStartMining={() => handleStartMining()}
          onLearnMore={() => scrollToSection("stats")}
        />

        {/* Live Statistics */}
        <LiveStats />

        {/* Mining Plans */}
        <MiningPlansSection
          onStartMining={handleStartMining}
        />

        {/* Token Charts */}
        <TokenChartsSection />

        {/* Referral Section */}
        <ReferralSection
          onLearnMore={() => console.log("Learn more about referral program")}
        />
      </main>

      {/* Footer */}
      <Footer
        onContactClick={() => scrollToSection("contact")}
        onNewsletterSignup={(email) => {
          console.log("Newsletter signup:", email);
          // todo: remove mock functionality - implement real newsletter signup
        }}
      />

      {/* Auth Modal Placeholder */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowAuthModal(false)}
          data-testid="auth-modal-overlay"
        >
          <div 
            className="bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="auth-modal"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent"
                data-testid="auth-email-input"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent"
                data-testid="auth-password-input"
              />
              <button
                onClick={() => {
                  console.log(`${authMode} attempted`);
                  setShowAuthModal(false);
                }}
                className="w-full bg-gradient-to-r from-neon-purple to-mining-orange text-white font-semibold py-3 rounded-md hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300"
                data-testid="auth-submit-button"
              >
                {authMode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                className="text-neon-purple hover:text-neon-purple/80 text-sm transition-colors"
                data-testid="auth-switch-mode"
              >
                {authMode === "signin" 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}