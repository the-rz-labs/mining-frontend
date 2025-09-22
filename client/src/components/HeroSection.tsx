import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  onStartMining?: () => void;
  onLearnMore?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

export default function HeroSection({ onStartMining, onLearnMore }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [, navigate] = useLocation();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  // Create floating particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: ['#a855f7', '#d946ef', '#ec4899'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 8
    }));
    setParticles(newParticles);
  }, []);

  const stats = [
    { value: "50K+", label: "Active Miners", icon: Users },
    { value: "24/7", label: "Mining Uptime", icon: Zap },
    { value: "99.9%", label: "Success Rate", icon: Sparkles }
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 hero-gradient animate-gradient-shift"
        style={{ y }}
      />
      
      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle floating-orb"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 6 + particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-pink-900/10" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Main Headline */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="text-lg sm:text-xl text-purple-300 font-medium tracking-wide uppercase mb-4">
                The Future of Digital Mining
              </p>
              <h1 className="text-hero font-black tracking-tight">
                <span className="block text-white mb-4">
                  MINING THAT GOES
                </span>
                <span className="block hero-text-gradient animate-text-glow">
                  BEYOND YOUR GAME
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Revolutionary mining platform built on fairness and transparency. 
              Start earning without deposits - mine with your resources, keep your rewards.
            </motion.p>
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  data-testid="button-start-mining"
                  onClick={() => navigate("/sign-up")}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative group bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 animate-glow-pulse"
                >
                  <span className="flex items-center space-x-3">
                    <span>Start Mining Now</span>
                    <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  data-testid="button-learn-more"
                  onClick={onLearnMore}
                  className="glass-effect border-purple-400/30 text-purple-200 hover:text-white hover:border-purple-300 px-12 py-6 text-xl rounded-full transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group cursor-pointer"
                  data-testid={`hero-stat-${index}`}
                >
                  <div className="glass-effect rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                    <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:text-purple-300 transition-colors" />
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2 font-mono">
                      {stat.value}
                    </div>
                    <div className="text-sm text-purple-200 font-medium uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}