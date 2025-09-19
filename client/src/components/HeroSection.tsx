import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp, Check } from "lucide-react";
import heroImage from "@assets/generated_images/Futuristic_mining_facility_background_bae26e88.png";

interface HeroSectionProps {
  onStartMining?: () => void;
  onLearnMore?: () => void;
}

export default function HeroSection({ onStartMining, onLearnMore }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, navigate] = useLocation();

  const features = [
    { icon: Zap, text: "High-Performance Mining", color: "text-neon-purple" },
    { icon: Shield, text: "Secure & Transparent", color: "text-neon-green" },
    { icon: TrendingUp, text: "Maximum ROI", color: "text-mining-orange" },
    { icon: Check, text: "No Token Deposits", color: "text-neon-green" }
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      data-testid="hero-section"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Futuristic Mining Facility"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-neon-green/5"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(142, 70, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(142, 70, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-foreground font-mono">
                MINE AND EARN
              </span>
              <span className="block bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent animate-pulse tracking-wider">
                With RZ Tokens
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our system is built on fairness and transparency. Here's what makes us different:
              No token deposits: We don't take your assets. You mine using your resources.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 py-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 hover-elevate"
                data-testid={`feature-pill-${index}`}
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              data-testid="button-start-mining"
              onClick={() => {
                navigate("/sign-up");
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group bg-gradient-to-r from-neon-purple to-mining-orange text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover:shadow-neon-purple/30 transition-all duration-500 transform hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <span>Start Mining Now</span>
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-neon-purple to-mining-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              data-testid="button-connect-rank-account"
              onClick={() => {
                console.log("Connect Rank Account clicked");
                onLearnMore?.();
              }}
              className="border-neon-green text-neon-green hover:bg-neon-green/10 px-8 py-4 text-lg backdrop-blur-sm"
            >
              Connect Rank Account
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="pt-12">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { value: "24/7", label: "Mining Uptime", color: "text-neon-purple" },
                { value: "99.9%", label: "Success Rate", color: "text-neon-green" },
                { value: "10K+", label: "Active Miners", color: "text-mining-orange" }
              ].map((stat, index) => (
                <div key={index} className="text-center" data-testid={`hero-stat-${index}`}>
                  <div className={`text-2xl sm:text-3xl font-bold ${stat.color} font-mono`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#10b981' : '#f97316',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </section>
  );
}