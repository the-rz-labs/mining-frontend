import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import { gsap } from "gsap";
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
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const morphShapeRef = useRef<SVGSVGElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const BASE_URL = "https://coinmaining.game";
  const heroImgPath = `${BASE_URL}/images/hero-img.png`;

  // Enhanced GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current], {
        opacity: 0,
        y: 50
      });
      gsap.set(charactersRef.current, { opacity: 0, x: 100 });

      // Create master timeline
      const tl = gsap.timeline();

      // Background entrance animation
      tl.from(".hero-bg-layer", {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        ease: "power2.out"
      });

      // Text animations with stagger
      tl.to([subtitleRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=1.5")
      .to([titleRef.current], {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.3")
      .to([descriptionRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .to([buttonsRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.3")
      .to([charactersRef.current], {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      }, "-=1");

      // Continuous animations
      gsap.to(".float-particle", {
        y: "-=20",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 4,
          from: "random"
        }
      });

      // Character floating animation
      gsap.to(".crypto-character", {
        y: -15,
        rotation: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Enhanced background animations  
      gsap.to(".morph-shape-1", {
        scale: 1.2,
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      gsap.to(".parallax-layer-1", {
        x: x * 0.5,
        y: y * 0.5,
        duration: 1,
        ease: "power2.out"
      });
      gsap.to(".parallax-layer-2", {
        x: x * 0.3,
        y: y * 0.3,
        duration: 1.2,
        ease: "power2.out"
      });
      gsap.to(".parallax-layer-3", {
        x: x * 0.1,
        y: y * 0.1,
        duration: 1.5,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { value: "50K+", label: "Active Miners", icon: Users },
    { value: "24/7", label: "Mining Uptime", icon: Zap },
    { value: "99.9%", label: "Success Rate", icon: Sparkles }
  ];

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center overflow-hidden pt-20"
      data-testid="hero-section"
    >
      {/* Advanced GSAP Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Morphing SVG Background */}
        <svg 
          ref={morphShapeRef}
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1000 1000"
        >
          <defs>
            <linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="#d946ef" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            className="morph-shape-1"
            d="M200,300 Q400,200 600,300 T900,400 Q700,600 500,500 T200,300"
            fill="url(#morphGradient)"
            filter="url(#glow)"
          />
          <path 
            className="morph-shape-2"
            d="M300,200 Q500,400 700,200 T800,500 Q600,700 400,600 T300,200"
            fill="none"
            opacity="0"
          />
        </svg>

        {/* Dynamic Particle System */}
        <div ref={particlesRef} className="absolute inset-0">
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              className={`float-particle parallax-layer-${(i % 3) + 1} absolute rounded-full pointer-events-none`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                background: ['#a855f7', '#d946ef', '#ec4899', '#06b6d4', '#10b981'][Math.floor(Math.random() * 5)],
                boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>

        {/* Liquid Background Layers */}
        <div className="hero-bg-layer parallax-layer-1 absolute -top-10 -right-10 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl opacity-70" />
        <div className="hero-bg-layer parallax-layer-2 absolute -bottom-10 -left-10 w-[700px] h-[700px] bg-gradient-to-r from-cyan-500/15 to-purple-600/15 rounded-full blur-3xl opacity-60" />
        <div className="hero-bg-layer parallax-layer-3 absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-50" />
        
        {/* Interactive Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Right Side - Enhanced Crypto Character */}
          <div ref={charactersRef} className="flex justify-center lg:justify-end order-2 lg:order-2">
            <div className="relative">
              {/* Main crypto character with GSAP animation */}
              <div className="crypto-character relative z-10">
                <img
                  src={heroImgPath}
                  alt="Crypto Mining Character"
                  className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] object-contain rounded-lg filter drop-shadow-2xl"
                  data-testid="hero-crypto-character"
                />
              </div>
              
              {/* Enhanced Glowing Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded-full blur-3xl opacity-60 animate-pulse transform scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-emerald-500/30 rounded-full blur-2xl opacity-40 animate-pulse transform scale-125" style={{animationDelay: '1s'}} />
              
              {/* Floating Orbital Elements */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="float-particle absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-sm"
                  style={{
                    width: `${Math.random() * 16 + 8}px`,
                    height: `${Math.random() * 16 + 8}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Left Side - Enhanced Content with GSAP */}
          <div className="space-y-8 text-center lg:text-left order-1 lg:order-1">
            {/* Main Headline with Character Animation */}
            <div className="space-y-6">
              <div>
                <p 
                  ref={subtitleRef}
                  className="text-lg sm:text-xl text-purple-300 font-medium tracking-wide uppercase mb-4"
                >
                  MINERS THAT GO
                </p>
                <h1 
                  ref={titleRef}
                  className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight"
                >
                  <span className="block hero-text-gradient animate-text-glow">
                    BEYOND YOUR GAME
                  </span>
                </h1>
              </div>
              
              <p 
                ref={descriptionRef}
                className="text-xl sm:text-2xl text-gray-300 leading-relaxed font-light"
              >
                Revolutionary mining platform built on fairness and transparency. 
                Start earning without deposits - mine with your resources, keep your rewards.
              </p>
            </div>

            {/* Enhanced CTA Section */}
            <div ref={buttonsRef} className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                <div className="relative group">
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
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500" />
                </div>
                
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="lg"
                    data-testid="button-learn-more"
                    onClick={onLearnMore}
                    className="glass-effect border-purple-400/30 text-purple-200 hover:text-white hover:border-purple-300 px-12 py-6 text-xl rounded-full transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}