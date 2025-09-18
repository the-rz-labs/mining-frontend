import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp, Check, Activity, Thermometer, Cpu, DollarSign } from "lucide-react";
import heroImage from "@assets/generated_images/Futuristic_mining_facility_background_bae26e88.png";
import MiningRigVisualizer from "@/components/MiningRigVisualizer";

interface HeroSectionProps {
  onStartMining?: () => void;
  onLearnMore?: () => void;
}

export default function HeroSection({ onStartMining, onLearnMore }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hashRate, setHashRate] = useState(1247.8);
  const [temperature, setTemperature] = useState(67);
  const [minedTokens, setMinedTokens] = useState(342.15);
  const [earnings, setEarnings] = useState(1847.92);

  // Animate live stats
  useEffect(() => {
    const interval = setInterval(() => {
      setHashRate(prev => prev + (Math.random() - 0.5) * 5);
      setTemperature(prev => Math.max(60, Math.min(75, prev + (Math.random() - 0.5) * 2)));
      setMinedTokens(prev => prev + Math.random() * 0.1);
      setEarnings(prev => prev + Math.random() * 0.5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Zap, text: "High-Performance Mining", color: "text-neon-purple" },
    { icon: Shield, text: "Secure & Transparent", color: "text-neon-green" },
    { icon: TrendingUp, text: "Maximum ROI", color: "text-mining-orange" },
    { icon: Check, text: "No Token Deposits", color: "text-neon-green" }
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-background"
      data-testid="hero-section"
    >
      {/* Background with subtle overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Futuristic Mining Facility"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 animate-grid-move" style={{
          backgroundImage: `
            linear-gradient(rgba(142, 70, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(142, 70, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          
          {/* Left Side - Content */}
          <div className="flex flex-col justify-center space-y-8 lg:pr-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-sm font-mono text-neon-green uppercase tracking-wider">Live Mining Status</span>
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="block text-foreground font-mono leading-tight">
                  MINE AND EARN
                </span>
                <span className="block bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent animate-pulse tracking-wider leading-tight">
                  With RZ Tokens
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Our system is built on fairness and transparency. Here's what makes us different:
                <span className="block mt-2 text-neon-green font-medium">
                  No token deposits: We don't take your assets. You mine using your resources.
                </span>
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-card/60 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 hover-elevate transition-all duration-300 group"
                  data-testid={`feature-pill-${index}`}
                >
                  <feature.icon className={`w-4 h-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="text-sm font-medium text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                data-testid="button-start-mining"
                onClick={() => {
                  console.log("Start Mining clicked");
                  onStartMining?.();
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
                className="border-neon-green text-neon-green hover:bg-neon-green/10 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 hover:border-neon-green/80"
              >
                Connect Rank Account
              </Button>
            </div>

            {/* Live Stats Preview */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                { value: `${hashRate.toFixed(1)} MH/s`, label: "Current Hash Rate", color: "text-neon-purple", icon: Activity },
                { value: `${temperature.toFixed(0)}°C`, label: "Temperature", color: "text-mining-orange", icon: Thermometer },
                { value: `${minedTokens.toFixed(2)} RZ`, label: "Tokens Mined", color: "text-neon-green", icon: DollarSign }
              ].map((stat, index) => (
                <div key={index} className="text-left group" data-testid={`hero-stat-${index}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    <div className={`text-lg sm:text-xl font-bold ${stat.color} font-mono`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Advanced Mining Rig Visualization */}
          <div className="hidden lg:flex flex-col justify-center items-center relative">
            <MiningRigVisualizer
              hashRate={hashRate}
              temperature={temperature}
              minedTokens={minedTokens}
              earnings={earnings}
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </div>

    </section>
  );
}