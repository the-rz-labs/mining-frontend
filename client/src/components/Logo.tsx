import logoImage from "@assets/Logo.3c792b77_1758189998712.png";

export default function Logo() {
  return (
    <div className="flex items-center space-x-3" data-testid="logo">
      <div className="relative">
        {/* Main logo container */}
        <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
          <img 
            src={logoImage} 
            alt="Ranking Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-br from-mining-orange via-neon-green to-mining-orange rounded-lg blur opacity-20 animate-pulse"></div>
      </div>
      
      {/* Brand text */}
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-mining-orange to-neon-green bg-clip-text text-transparent font-mono tracking-wider">
          RANKING
        </span>
        <span className="text-xs text-muted-foreground font-light tracking-widest">
          MINING PLATFORM
        </span>
      </div>
    </div>
  );
}