import { useState, useEffect, useRef, useCallback } from "react";
import { Activity, Thermometer, DollarSign, Zap } from "lucide-react";
import miningRigMGC from "@assets/generated_images/Purple_neon_mining_rig_MGC_62391ec5.png";
import miningRigRZ from "@assets/generated_images/Green_neon_mining_rig_RZ_7f27de2a.png";
import miningRigPowerful from "@assets/generated_images/Powerful_mining_rig_setup_a43064be.png";

interface MiningRigVisualizerProps {
  hashRate: number;
  temperature: number;
  minedTokens: number;
  earnings: number;
  className?: string;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  velocity: number;
  type: 'MGC' | 'RZ';
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export default function MiningRigVisualizer({
  hashRate,
  temperature,
  minedTokens,
  earnings,
  className = ""
}: MiningRigVisualizerProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isInView, setIsInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const coinIdCounter = useRef(0);
  const lastCoinDrop = useRef(Date.now());

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Create new coin
  const createCoin = useCallback((): Coin => {
    coinIdCounter.current += 1;
    return {
      id: coinIdCounter.current,
      x: Math.random() * 300 + 50, // Random x position within rig area
      y: -20, // Start above the container
      velocity: Math.random() * 2 + 2, // Fall speed
      type: Math.random() > 0.5 ? 'MGC' : 'RZ',
      opacity: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10 // Random rotation speed
    };
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!isInView || prefersReducedMotion) return;

    setCoins(prevCoins => {
      let newCoins = [...prevCoins];

      // Create new coins based on hash rate (higher hash rate = more coins)
      const now = Date.now();
      const coinDropInterval = Math.max(500, 2000 - (hashRate * 2)); // More frequent drops for higher hash rate
      
      if (now - lastCoinDrop.current > coinDropInterval && newCoins.length < 30) {
        lastCoinDrop.current = now;
        newCoins.push(createCoin());
      }

      // Update coin positions
      newCoins = newCoins.map(coin => ({
        ...coin,
        y: coin.y + coin.velocity,
        rotation: coin.rotation + coin.rotationSpeed,
        opacity: coin.y > 400 ? Math.max(0, coin.opacity - 0.05) : coin.opacity // Fade out at bottom
      }));

      // Remove coins that are off-screen or faded
      newCoins = newCoins.filter(coin => coin.y < 500 && coin.opacity > 0);

      return newCoins;
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isInView, prefersReducedMotion, hashRate, createCoin]);

  // Start animation loop
  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, isInView, prefersReducedMotion]);

  // Calculate visual intensity based on hash rate
  const intensity = Math.min(hashRate / 1500, 1); // Normalize to 0-1
  const glowIntensity = Math.max(0.3, intensity); // Minimum glow level

  return (
    <div 
      ref={containerRef}
      className={`relative group ${className}`}
      data-testid="mining-rig-visualizer"
    >
      {/* Main Mining Rig Container */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Background Mining Rig */}
        <div className="relative">
          <img
            src={miningRigPowerful}
            alt="Mining Rig Base"
            className="w-full h-auto max-w-lg rounded-xl"
          />
          
          {/* Neon Overlay Rigs - Switch based on hash rate */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${intensity > 0.6 ? 'opacity-80' : 'opacity-40'}`}>
            <img
              src={miningRigMGC}
              alt="MGC Mining Rig"
              className={`absolute inset-0 w-full h-full object-cover rounded-xl mix-blend-color-dodge ${!prefersReducedMotion ? 'animate-neon-flicker-purple' : ''}`}
              style={{ 
                filter: `drop-shadow(0 0 ${10 * glowIntensity}px #8b5cf6) brightness(${0.8 + 0.4 * intensity})` 
              }}
            />
          </div>
          
          <div className={`absolute inset-0 transition-opacity duration-1000 ${intensity > 0.4 ? 'opacity-60' : 'opacity-20'}`}>
            <img
              src={miningRigRZ}
              alt="RZ Mining Rig"
              className={`absolute inset-0 w-full h-full object-cover rounded-xl mix-blend-color-dodge ${!prefersReducedMotion ? 'animate-neon-flicker-green' : ''}`}
              style={{ 
                filter: `drop-shadow(0 0 ${8 * glowIntensity}px #10b981) brightness(${0.7 + 0.3 * intensity})` 
              }}
            />
          </div>

          {/* Spinning Fan Overlays */}
          {!prefersReducedMotion && (
            <>
              {/* Fan 1 - Top Left */}
              <div 
                className="absolute top-16 left-12 w-8 h-8 rounded-full border-2 border-neon-purple/60 animate-fan-spin"
                style={{ 
                  animationDuration: `${Math.max(0.5, 2 - intensity)}s`,
                  boxShadow: `0 0 ${5 * glowIntensity}px #8b5cf6, inset 0 0 ${3 * glowIntensity}px #8b5cf6` 
                }}
              >
                <div className="absolute inset-2 rounded-full border border-neon-purple/40"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-3 bg-neon-purple/80 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-3 h-1 bg-neon-purple/80 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              </div>

              {/* Fan 2 - Top Right */}
              <div 
                className="absolute top-20 right-16 w-6 h-6 rounded-full border-2 border-neon-green/60 animate-fan-spin-reverse"
                style={{ 
                  animationDuration: `${Math.max(0.6, 2.2 - intensity)}s`,
                  boxShadow: `0 0 ${4 * glowIntensity}px #10b981, inset 0 0 ${2 * glowIntensity}px #10b981` 
                }}
              >
                <div className="absolute inset-1 rounded-full border border-neon-green/40"></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-neon-green/80 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-neon-green/80 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              </div>

              {/* Fan 3 - Bottom Center */}
              <div 
                className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 border-mining-orange/60 animate-fan-spin"
                style={{ 
                  animationDuration: `${Math.max(0.4, 1.8 - intensity)}s`,
                  boxShadow: `0 0 ${6 * glowIntensity}px #f97316, inset 0 0 ${4 * glowIntensity}px #f97316` 
                }}
              >
                <div className="absolute inset-2 rounded-full border border-mining-orange/40"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-mining-orange/80 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-1 bg-mining-orange/80 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              </div>
            </>
          )}

          {/* Neon Border Glow */}
          <div 
            className={`absolute inset-0 rounded-xl pointer-events-none ${!prefersReducedMotion ? 'animate-glow-pulse' : ''}`}
            style={{
              boxShadow: `
                inset 0 0 ${20 * glowIntensity}px rgba(139, 92, 246, ${0.3 * intensity}),
                inset 0 0 ${30 * glowIntensity}px rgba(16, 185, 129, ${0.2 * intensity}),
                0 0 ${15 * glowIntensity}px rgba(139, 92, 246, ${0.4 * intensity}),
                0 0 ${25 * glowIntensity}px rgba(16, 185, 129, ${0.3 * intensity})
              `
            }}
          ></div>
        </div>

        {/* Falling Coins */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {coins.map(coin => (
              <div
                key={coin.id}
                className={`absolute w-4 h-4 rounded-full font-bold text-xs flex items-center justify-center shadow-lg ${
                  coin.type === 'MGC' 
                    ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' 
                    : 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                }`}
                style={{
                  left: `${coin.x}px`,
                  top: `${coin.y}px`,
                  opacity: coin.opacity,
                  transform: `rotate(${coin.rotation}deg)`,
                  boxShadow: coin.type === 'MGC' 
                    ? `0 0 8px rgba(139, 92, 246, ${coin.opacity * 0.8})` 
                    : `0 0 8px rgba(16, 185, 129, ${coin.opacity * 0.8})`
                }}
                data-testid={`coin-${coin.type.toLowerCase()}-${coin.id}`}
              >
                {coin.type === 'MGC' ? 'M' : 'R'}
              </div>
            ))}
          </div>
        )}

        {/* Digital Overlay Stats - Top Right */}
        <div className="absolute top-4 right-4 space-y-2">
          {/* Hash Rate Display */}
          <div className="bg-black/90 backdrop-blur-md border border-neon-purple/50 rounded-lg p-3 min-w-[180px] shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <Activity className="w-4 h-4 text-neon-purple" />
              <div className={`w-2 h-2 rounded-full bg-neon-green ${!prefersReducedMotion ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="text-neon-purple font-mono text-lg font-bold">
              {hashRate.toFixed(1)} MH/s
            </div>
            <div className="text-xs text-gray-400">Hash Rate</div>
            {/* Visual intensity bar */}
            <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-neon-purple to-mining-orange h-1 rounded-full transition-all duration-500"
                style={{ width: `${intensity * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Temperature Display */}
          <div className="bg-black/90 backdrop-blur-md border border-mining-orange/50 rounded-lg p-3 min-w-[180px] shadow-xl">
            <div className="flex items-center justify-between mb-1">
              <Thermometer className="w-4 h-4 text-mining-orange" />
              <div className={`w-2 h-2 rounded-full ${
                temperature > 70 ? 'bg-red-500' : 'bg-mining-orange'
              } ${!prefersReducedMotion ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="text-mining-orange font-mono text-lg font-bold">
              {temperature.toFixed(0)}°C
            </div>
            <div className="text-xs text-gray-400">GPU Temp</div>
          </div>
        </div>

        {/* Bottom Stats Panel */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/95 backdrop-blur-md border border-neon-green/50 rounded-lg p-4 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <DollarSign className="w-4 h-4 text-neon-green" />
                  <div className="text-neon-green font-mono text-xl font-bold">
                    {minedTokens.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-400">RZ Tokens</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap className="w-4 h-4 text-neon-green" />
                  <div className="text-neon-green font-mono text-xl font-bold">
                    ${earnings.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs text-gray-400">Earnings</div>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Mining Progress</span>
                <span className="text-xs text-neon-green font-mono">{Math.round(87 + intensity * 10)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r from-neon-purple to-neon-green h-2 rounded-full transition-all duration-1000 ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
                  style={{ width: `${87 + intensity * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Power Status Indicator */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-md border border-neon-green/50 rounded-full px-3 py-2 shadow-lg">
            <div className={`w-3 h-3 rounded-full bg-neon-green ${!prefersReducedMotion ? 'animate-pulse' : ''}`}></div>
            <span className="text-neon-green text-sm font-bold font-mono">ONLINE</span>
            <Zap className="w-4 h-4 text-neon-green" />
          </div>
        </div>
      </div>
    </div>
  );
}