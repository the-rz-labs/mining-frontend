import { useEffect, useState } from "react";

interface MinerAnimationProps {
  token: 'MGC' | 'RZ';
  isActive: boolean;
  earnings: number;
  children: React.ReactNode;
}

export function MinerAnimation({ token, isActive, earnings, children }: MinerAnimationProps) {
  const [coinDrops, setCoinDrops] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [prevEarnings, setPrevEarnings] = useState(earnings);

  // Generate coin drops when earnings increase
  useEffect(() => {
    if (earnings > prevEarnings && isActive) {
      const newCoins = Array.from({ length: 3 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        x: Math.random() * 80 + 10, // 10-90% from left
        y: -10 // Start above the container
      }));
      
      setCoinDrops(prev => [...prev, ...newCoins]);
      
      // Remove coins after animation
      setTimeout(() => {
        setCoinDrops(prev => prev.filter(coin => !newCoins.find(newCoin => newCoin.id === coin.id)));
      }, 2000);
    }
    setPrevEarnings(earnings);
  }, [earnings, prevEarnings, isActive]);

  const tokenColor = token === 'MGC' ? 'from-neon-purple to-purple-400' : 'from-mining-orange to-orange-400';
  const glowColor = token === 'MGC' ? 'shadow-neon-purple/50' : 'shadow-mining-orange/50';

  return (
    <div className="relative overflow-hidden rounded-lg">
      {children}
      
      {isActive && (
        <>
          {/* Spinning Fan Overlays */}
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full animate-spin">
            <div className="absolute inset-1 border border-white/20 rounded-full">
              <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-white/40 transform -translate-x-1/2 -translate-y-1/2 origin-center"></div>
              <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-white/40 transform -translate-x-1/2 -translate-y-1/2 origin-center"></div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 w-6 h-6 border-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}>
            <div className="absolute inset-0.5 border border-white/15 rounded-full">
              <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white/30 transform -translate-x-1/2 -translate-y-1/2 origin-center"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-white/30 transform -translate-x-1/2 -translate-y-1/2 origin-center"></div>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 w-10 h-10 border-2 border-white/25 rounded-full animate-spin" style={{ animationDuration: '1.2s' }}>
            <div className="absolute inset-1 border border-white/20 rounded-full">
              <div className="absolute top-1/2 left-1/2 w-0.5 h-7 bg-white/35 transform -translate-x-1/2 -translate-y-1/2 origin-center"></div>
              <div className="absolute top-1/2 left-1/2 w-7 h-0.5 bg-white/35 transform -translate-x-1/2 -translate-y-1/2 origin-center"></div>
            </div>
          </div>

          {/* Pulsing Light Effects */}
          <div className={`absolute top-2 left-8 w-2 h-2 bg-gradient-to-r ${tokenColor} rounded-full animate-pulse`}></div>
          <div className={`absolute top-6 right-8 w-1.5 h-1.5 bg-gradient-to-r ${tokenColor} rounded-full animate-pulse`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute bottom-4 left-12 w-2.5 h-2.5 bg-gradient-to-r ${tokenColor} rounded-full animate-pulse`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-6 right-6 w-1 h-1 bg-gradient-to-r ${tokenColor} rounded-full animate-pulse`} style={{ animationDelay: '1.5s' }}></div>

          {/* LED Strip Effects */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tokenColor} opacity-60 animate-pulse`}></div>
          <div className={`absolute top-0 left-0 w-1 bottom-0 bg-gradient-to-b ${tokenColor} opacity-40 animate-pulse`} style={{ animationDelay: '0.3s' }}></div>
          <div className={`absolute top-0 right-0 w-1 bottom-0 bg-gradient-to-b ${tokenColor} opacity-40 animate-pulse`} style={{ animationDelay: '0.7s' }}></div>

          {/* Heat Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse opacity-30"></div>
          
          {/* Working Status Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${tokenColor} opacity-20 animate-pulse mix-blend-overlay`}></div>
        </>
      )}

      {/* Coin Drop Animation */}
      {coinDrops.map((coin) => (
        <div
          key={coin.id}
          className={`absolute w-6 h-6 bg-gradient-to-br ${tokenColor} rounded-full ${glowColor} shadow-lg animate-bounce z-10`}
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            animation: 'coinDrop 2s ease-in forwards'
          }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-white/50 to-transparent rounded-full"></div>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {token}
          </span>
        </div>
      ))}
    </div>
  );
}