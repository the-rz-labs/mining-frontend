import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LiveStats from "@/components/LiveStats";
import MiningPlansSection from "@/components/MiningPlansSection";
import TokenChartsSection from "@/components/TokenChartsSection";
import ReferralSection from "@/components/ReferralSection";
import ExperienceSection from "@/components/ExperienceSection";
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

         {/* Experience Section */}
        <ExperienceSection />

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

      {/* Auth Modal removed - now using dedicated auth pages */}
    </div>
  );
}