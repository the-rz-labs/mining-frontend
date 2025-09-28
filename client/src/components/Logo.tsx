export default function Logo() {
  const BASE_URL = "https://coinmaining.game";
  const logoPath = "/images/Logo.png"; // relative path from base URL
  const logoUrl = `${BASE_URL}${logoPath}`;

  return (
    <div className="flex items-center space-x-3" data-testid="logo">
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img 
          src={logoUrl} 
          alt="Ranking Logo" 
          className="w-full h-full object-contain"
        />
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