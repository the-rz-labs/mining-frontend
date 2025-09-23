import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import cryptoCharacterImage from "@assets/Gemini_Generated_Image_sh6axdsh6axdsh6a (1)_1758609322691.png";

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Right Side - Crypto Character */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex justify-center lg:justify-end order-2 lg:order-2"
          >
            <div className="relative">
              {/* Main crypto character */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img
                  src={cryptoCharacterImage}
                  alt="Crypto Mining Character"
                  className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] object-contain"
                  data-testid="hero-crypto-character"
                />
              </motion.div>
              
              {/* Glowing effect behind character */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl opacity-60 animate-pulse transform scale-110" />
              
              {/* Additional glow particles */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500 rounded-full blur-md"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 w-6 h-6 bg-pink-500 rounded-full blur-md"
              />
            </div>
          </motion.div>

          {/* Left Side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left order-1 lg:order-1"
          >
            {/* Main Headline */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <p className="text-lg sm:text-xl text-purple-300 font-medium tracking-wide uppercase mb-4">
                  MINERS THAT GO
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                  <span className="block hero-text-gradient animate-text-glow">
                    BEYOND YOUR GAME
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl sm:text-2xl text-gray-300 leading-relaxed font-light"
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
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
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
            
            {/* Supporting text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="pt-8"
            >
              <p className="text-lg text-gray-300">
                Join thousands of crypto enthusiasts earning with our mining platform
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}