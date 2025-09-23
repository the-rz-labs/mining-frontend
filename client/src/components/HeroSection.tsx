import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import miningImage from "@assets/generated_images/Modern_3D_geometric_mining_cubes_55129112.png";

interface HeroSectionProps {
  onStartMining?: () => void;
  onLearnMore?: () => void;
}

export default function HeroSection({ onStartMining, onLearnMore }: HeroSectionProps) {
  const [, navigate] = useLocation();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      data-testid="hero-section"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
      }}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      
      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* New Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm text-white font-medium">New</span>
                <span className="ml-2 text-sm text-gray-300">Introducing our new most advanced MGC & RZ mining</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Mine on<br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  decentralized
                </span><br />
                crypto protocol
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                Ranking is a leading provider of cutting-edge decentralized solutions, powering the next generation of MGC, RZ, and Metaverse mining projects.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button
                onClick={() => navigate("/sign-up")}
                data-testid="button-start-mining"
                className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 py-4 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                <span className="flex items-center space-x-2">
                  <span>Schedule demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* 3D Mining Image */}
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotateY: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative"
            >
              <img
                src={miningImage}
                alt="3D Mining Cubes - MGC & RZ Tokens"
                className="w-80 h-80 lg:w-96 lg:h-96 xl:w-[500px] xl:h-[500px] object-contain"
                data-testid="hero-mining-image"
              />
              
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl scale-150 animate-pulse" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}