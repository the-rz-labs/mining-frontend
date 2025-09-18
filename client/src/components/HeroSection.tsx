import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp, Check, Cpu, Activity, DollarSign } from "lucide-react";
import heroImage from "@assets/generated_images/Futuristic_mining_facility_background_bae26e88.png";
import miningRigImage from "@assets/stock_images/cryptocurrency_minin_edbec455.jpg";

interface HeroSectionProps {
  onStartMining?: () => void;
  onLearnMore?: () => void;
}

export default function HeroSection({ onStartMining, onLearnMore }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [earnings, setEarnings] = useState(1247.56);
  const [hashRate, setHashRate] = useState(342.7);

  const features = [
    { icon: Zap, text: "High-Performance Mining", color: "text-neon-purple" },
    { icon: Shield, text: "Secure & Transparent", color: "text-neon-green" },
    { icon: TrendingUp, text: "Maximum ROI", color: "text-mining-orange" },
    { icon: Check, text: "No Token Deposits", color: "text-neon-green" }
  ];

  // Simulate live mining earnings and hash rate
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnings(prev => prev + Math.random() * 2);
      setHashRate(prev => prev + (Math.random() - 0.5) * 10);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      data-testid="hero-section"
    >
      {/* Multi-layered Background with Mining Rig */}
      <div className="absolute inset-0 z-0">
        {/* Primary mining facility background */}
        <img
          src={heroImage}
          alt="Futuristic Mining Facility"
          className="w-full h-full object-cover opacity-30"
        />
        
        {/* Secondary mining rig overlay */}
        <div className="absolute inset-0">
          <img
            src={miningRigImage}
            alt="Active Mining Rig"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        
        {/* Dynamic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-mining-orange/5 to-neon-green/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-purple/3 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Enhanced Animated Grid and Circuit Patterns */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `
            linear-gradient(rgba(142, 70, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(142, 70, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
        
        {/* Additional circuit-like patterns */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'circuitFlow 30s linear infinite reverse'
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
              className="border-neon-green text-neon-green hover:bg-neon-green/10 px-8 py-4 text-lg backdrop-blur-sm"
            >
              Connect Rank Account
            </Button>
          </div>

          {/* Live Mining Stats */}
          <div className="pt-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "24/7", label: "Mining Uptime", color: "text-neon-purple", icon: Activity },
                { value: "99.9%", label: "Success Rate", color: "text-neon-green", icon: Shield },
                { value: `${hashRate.toFixed(1)} MH/s`, label: "Current Hash Rate", color: "text-mining-orange", icon: Cpu },
                { value: `$${earnings.toFixed(2)}`, label: "Total Earned", color: "text-neon-green", icon: DollarSign }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover-elevate group" data-testid={`hero-stat-${index}`}>
                  <div className="flex justify-center mb-3">
                    <div className={`p-2 rounded-full bg-card/50 border border-border/50`}>
                      <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>
                  <div className={`text-xl sm:text-2xl font-bold ${stat.color} font-mono transition-all duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Mining Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mining hash particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`hash-${i}`}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#10b981' : '#f97316',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: `0 0 10px currentColor`
            }}
          ></div>
        ))}
        
        {/* Larger mining nodes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`node-${i}`}
            className="absolute w-3 h-3 rounded-full animate-ping"
            style={{
              backgroundColor: i % 2 === 0 ? '#8b5cf6' : '#10b981',
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 8)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: '4s',
              boxShadow: `0 0 20px currentColor`
            }}
          ></div>
        ))}
        
        {/* Data stream lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-60"
            style={{
              width: `${200 + Math.random() * 300}px`,
              left: `${Math.random() * 70}%`,
              top: `${20 + i * 15}%`,
              animation: `dataStream ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
    </section>
  );
}