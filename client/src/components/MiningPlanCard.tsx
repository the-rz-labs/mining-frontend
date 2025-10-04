import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, Clock, Trophy } from "lucide-react";

export interface MiningPlan {
  id: string;
  name: string;
  token: "MGC" | "RZ";
  hashRate: string;
  minInvestment: number;
  dailyReward: string;
  image: string;
  popular?: boolean;
  roiPercentage: number;
}

interface MiningPlanCardProps {
  plan: MiningPlan;
  highlightTop?: boolean;
  highlightTopMGC?: boolean;
  onStartMining?: (plan: MiningPlan) => void;
}

export default function MiningPlanCard({ plan, highlightTop = false, highlightTopMGC = false, onStartMining }: MiningPlanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const themeColors = {
    MGC: {
      primary: "text-neon-purple",
      secondary: "text-purple-400",
      bg: "bg-gradient-to-br from-purple-900/20 to-violet-900/20",
      border: "border-neon-purple/30",
      glow: "shadow-neon-purple/20",
      button: "bg-gradient-to-r from-neon-purple to-purple-600"
    },
    RZ: {
      primary: "text-neon-green",
      secondary: "text-emerald-400", 
      bg: "bg-gradient-to-br from-green-900/20 to-emerald-900/20",
      border: "border-neon-green/30",
      glow: "shadow-neon-green/20",
      button: "bg-gradient-to-r from-neon-green to-emerald-600"
    }
  };

  const theme = themeColors[plan.token];

  return (
    <div
      className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-500 hover:scale-[1.02] h-[650px] w-full ${theme.bg} ${theme.border} ${
        highlightTop 
          ? `ring-2 ring-mining-orange/60 shadow-2xl shadow-mining-orange/20 md:scale-[1.02]` 
          : highlightTopMGC
          ? `ring-2 ring-neon-purple/60 shadow-2xl shadow-neon-purple/20 md:scale-[1.01]`
          : isHovered ? `shadow-2xl ${theme.glow}` : 'shadow-lg'
      }`}
      data-testid={`mining-card-${plan.token.toLowerCase()}-${plan.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top ROI / Popular Badge */}
      {(highlightTop || highlightTopMGC || plan.popular) && (
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {highlightTop && (
            <Badge className="bg-gradient-to-r from-mining-orange to-neon-green text-white font-bold border-none shadow-lg animate-pulse">
              <Trophy className="w-4 h-4 mr-1" />
              TOP ROI
            </Badge>
          )}
          {highlightTopMGC && !highlightTop && (
            <Badge className="bg-gradient-to-r from-neon-purple to-purple-600 text-white font-bold border-none shadow-lg animate-pulse">
              <Trophy className="w-4 h-4 mr-1" />
              TOP MGC
            </Badge>
          )}
          {plan.popular && !highlightTop && !highlightTopMGC && (
            <Badge className={`${theme.button} text-white font-semibold border-none`}>
              Most Popular
            </Badge>
          )}
        </div>
      )}

      {/* Glow Effect Background */}
      <div className={`absolute -inset-1 ${theme.button} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}></div>

      <div className="relative bg-card/80 backdrop-blur-sm p-6 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className={`text-2xl font-bold ${theme.primary} mb-2 font-mono`}>
            {plan.name}
          </h3>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge variant="outline" className={`${theme.primary} border-current`}>
              {plan.token} Token
            </Badge>
            <Badge variant="outline" className="text-mining-orange border-mining-orange">
              {plan.roiPercentage}% ROI
            </Badge>
          </div>
        </div>

        {/* Mining Rig Image */}
        <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-background to-card">
          <img
            src={plan.image}
            alt={`${plan.name} Mining Rig`}
            className="w-full h-55 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className={`w-5 h-5 ${theme.primary}`} />
              <span className="text-sm text-muted-foreground">Hash Rate</span>
            </div>
            <span className={`font-bold ${theme.primary} font-mono`}>
              {plan.hashRate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-5 h-5 ${theme.primary}`} />
              <span className="text-sm text-muted-foreground">Min Investment</span>
            </div>
            <span className="font-bold text-foreground">
              {plan.minInvestment.toLocaleString()} {plan.token}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className={`w-5 h-5 ${theme.primary}`} />
              <span className="text-sm text-muted-foreground">Daily Reward</span>
            </div>
            <span className={`font-bold ${theme.secondary}`}>
              {plan.dailyReward}
            </span>
          </div>
        </div>


        {/* CTA Button */}
        <div className="mt-auto">
          <Button
            className={`w-full ${theme.button} text-white font-semibold py-3 hover:shadow-lg hover:${theme.glow} transition-all duration-300`}
            data-testid={`button-start-mining-${plan.token.toLowerCase()}-${plan.id}`}
            onClick={() => {
              console.log(`Starting mining for ${plan.name} (${plan.token})`);
              onStartMining?.(plan);
            }}
          >
            Start Mining {plan.token}
          </Button>
        </div>
      </div>
    </div>
  );
}