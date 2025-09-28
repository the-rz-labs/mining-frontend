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

  const BASE_URL = "https://coinmaining.game";
  const heroImgPath = `${BASE_URL}/images/hero-img.webp`;

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
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center overflow-hidden pt-20"
      data-testid="hero-section"
    >
      {/* Enhanced Background Effects with Lighting Curves and Lines */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-neon-green/30 rounded-full blur-3xl md:blur-3xl blur-xl animate-float opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl md:blur-3xl blur-xl animate-breathing opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-neon-green/20 to-mining-orange/20 rounded-full blur-3xl md:blur-3xl blur-xl animate-float opacity-50 hidden sm:block" style={{ animationDelay: "4s" }}></div>
        
        {/* Curved Lightning Lines */}
        <div className="absolute inset-0 w-full h-full opacity-20">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="lightningGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.4 }} />
              </linearGradient>
              <linearGradient id="lightningGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.7 }} />
                <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.3 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Static curved paths for now */}
            <path
              d="M0,200 Q300,100 600,250 T1200,150"
              fill="none"
              stroke="url(#lightningGrad1)"
              strokeWidth="2"
              filter="url(#glow)"
              className="animate-pulse"
            />
            <path
              d="M1200,300 Q900,200 600,400 T0,350"
              fill="none"
              stroke="url(#lightningGrad2)"
              strokeWidth="1.5"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <path
              d="M200,600 Q500,450 800,550 Q1000,600 1200,500"
              fill="none"
              stroke="url(#lightningGrad1)"
              strokeWidth="1"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </svg>
        </div>

        {/* Grid Pattern with Glow */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            filter: 'blur(0.5px)'
          }}></div>
        </div>

        {/* Floating Energy Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/6 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 20, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-50"></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60 hidden md:block shadow-lg shadow-purple-400/50"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-neon-green rounded-full animate-float opacity-40 hidden lg:block shadow-lg shadow-green-400/50" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-mining-orange rounded-full animate-float opacity-50 hidden md:block shadow-lg shadow-orange-400/50" style={{ animationDelay: "3s" }}></div>
        
        {/* Additional corner lighting effects */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-transparent blur-2xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-600/20 to-transparent blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-600/20 to-transparent blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-600/20 to-transparent blur-2xl"></div>
      </div>

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
                  src={heroImgPath}
                  alt="Crypto Mining Character"
                  className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] object-contain rounded-lg"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}