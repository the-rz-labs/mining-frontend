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
      
      {/* Brand text - compact for header */}
      <div className="flex flex-col justify-center -space-y-0.5">
        <span className="text-base font-bold bg-gradient-to-r from-mining-orange to-neon-green bg-clip-text text-transparent font-mono tracking-wider leading-tight">
          MINING
        </span>
        <span className="text-[10px] text-muted-foreground font-light tracking-widest leading-tight">
          RZ PLATFORM
        </span>
      </div>
    </div>
  );
}