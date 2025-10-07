import { Card, CardContent } from "@/components/ui/card";
import { 
  Gift, 
  Sparkles,
  Trophy,
  Star,
  Zap
} from "lucide-react";

export default function Giveaways() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-purple rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-mining-orange rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-60 right-40 w-1.5 h-1.5 bg-neon-green rounded-full animate-float opacity-50"></div>
      </div>

      <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl max-w-3xl w-full relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-mining-orange/10"></div>
        
        <CardContent className="p-12 text-center relative">
          {/* Icon Animation */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green opacity-50 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-neon-purple/20 to-mining-orange/20 rounded-3xl flex items-center justify-center border-2 border-white/20 backdrop-blur-sm">
              <Gift className="w-16 h-16 text-neon-purple animate-pulse" />
            </div>
          </div>

          {/* Coming Soon Title */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-neon-purple via-purple-400 to-mining-orange bg-clip-text text-transparent animate-pulse">
            Coming Soon
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            🎁 Giveaways & Rewards
          </h2>
          
          <p className="text-white/70 text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
            We're preparing something amazing for our community! 
            Exciting giveaways, exclusive rewards, and special events are on the way.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-neon-purple/30">
              <Trophy className="w-5 h-5 text-neon-purple" />
              <span className="text-white text-sm font-medium">Exclusive Prizes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-mining-orange/30">
              <Star className="w-5 h-5 text-mining-orange" />
              <span className="text-white text-sm font-medium">Weekly Events</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-neon-green/30">
              <Zap className="w-5 h-5 text-neon-green" />
              <span className="text-white text-sm font-medium">Big Rewards</span>
            </div>
          </div>

          {/* Sparkle Divider */}
          <div className="flex items-center justify-center gap-3 my-8">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <p className="text-white/60 text-base">
            Stay tuned for updates. The best is yet to come! 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
