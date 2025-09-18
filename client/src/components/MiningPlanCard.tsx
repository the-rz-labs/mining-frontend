import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, Clock, TrendingUp } from "lucide-react";

export interface MiningPlan {
  id: string;
  name: string;
  token: "MGC" | "RZ";
  hashRate: string;
  minInvestment: number;
  dailyReward: string;
  image: string;
  popular?: boolean;
  features: string[];
  roiPercentage: number;
}

interface MiningPlanCardProps {
  plan: MiningPlan;
  onStartMining?: (plan: MiningPlan) => void;
}

export default function MiningPlanCard({ plan, onStartMining }: MiningPlanCardProps) {
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
      className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-500 hover:scale-105 h-[580px] w-full ${theme.bg} ${theme.border} ${isHovered ? `shadow-2xl ${theme.glow}` : 'shadow-lg'}`}
      data-testid={`mining-card-${plan.token.toLowerCase()}-${plan.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${theme.button} text-white font-semibold border-none`}>
            Most Popular
          </Badge>
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
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
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
              ${plan.minInvestment.toLocaleString()}
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

        {/* Features */}
        <div className="mb-6 flex-grow">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <TrendingUp className={`w-4 h-4 ${theme.primary} mr-2`} />
            Key Features
          </h4>
          <ul className="space-y-2">
            {plan.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${theme.button} mt-1.5 flex-shrink-0`}></div>
                <span className="text-sm text-muted-foreground leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
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