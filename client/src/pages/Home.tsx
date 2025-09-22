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
  const handleStartMining = (plan?: MiningPlan) => {
    if (plan) {
      console.log(`Starting mining for ${plan.name} (${plan.token})`);
      // todo: remove mock functionality - implement real mining start logic
    }
    // For now, just scroll to plans section or show auth if needed
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden" data-testid="home-page">
      {/* Navigation */}
      <Navigation />

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

        {/* Experience Section */}
        <section className="py-32 bg-black text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <div className="w-px h-32 bg-gray-600 mx-auto mb-16"></div>
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-center mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-none">
                  WE'VE BEEN BUILDING MINERS
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-none">
                  FOR 5+ YEARS
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mt-8">
                TRUSTED BY 25000+ DEVELOPERS
              </p>
            </div>
          </div>
        </section>

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

      {/* Auth Modal removed - now using dedicated auth pages */}
    </div>
  );
}