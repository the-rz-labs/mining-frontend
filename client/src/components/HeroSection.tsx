import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import miningImage from "@assets/generated_images/RZ_CoinMining_3D_character_with_custom_coins_9e579aa4.png";

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
        background: "linear-gradient(135deg, #4a1a5c 0%, #6b2c7a 25%, #8b4ba8 50%, #a855f7 75%, #c084fc 100%)"
      }}
    >
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating rectangles with gradients */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 rounded-3xl opacity-40"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            transform: "rotate(15deg)"
          }}
        />
        
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-80 w-24 h-40 rounded-2xl opacity-30"
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
            transform: "rotate(-20deg)"
          }}
        />
        
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 right-40 w-20 h-20 rounded-2xl opacity-50"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
            transform: "rotate(25deg)"
          }}
        />
        
        <motion.div
          animate={{
            y: [25, -25, 25],
            rotate: [0, -8, 8, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-60 right-10 w-16 h-32 rounded-xl opacity-35"
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            transform: "rotate(-30deg)"
          }}
        />
        
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 4, -4, 0]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 right-60 w-28 h-16 rounded-2xl opacity-40"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            transform: "rotate(35deg)"
          }}
        />
      </div>
      
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
                alt="RZ CoinMining 3D Character"
                className="w-80 h-80 lg:w-96 lg:h-96 xl:w-[500px] xl:h-[400px] object-contain"
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