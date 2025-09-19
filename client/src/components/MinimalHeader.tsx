import { Settings } from "lucide-react";

export function MinimalHeader() {
  return (
    <header className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-green rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Ranking
          </h1>
        </div>
      </div>

      {/* Optional: User avatar/menu on the right can be added later */}
      <div></div>
    </header>
  );
}