import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, ArrowRight, Gift, Trophy, Star, Crown, Gamepad2, Shield, Rocket } from "lucide-react";

interface ReferralSectionProps {
  onLearnMore?: () => void;
}

export default function ReferralSection({ onLearnMore }: ReferralSectionProps) {
  const referralSteps = [
    "Share your unique referral link",
    "Friends join and start mining",
    "Both earn bonus rewards and increased hash rates"
  ];

  const rankLevels = [
    { level: "Bronze", icon: Shield, color: "text-amber-600", requirement: "0-10 Referrals" },
    { level: "Silver", icon: Star, color: "text-gray-400", requirement: "11-25 Referrals" },
    { level: "Gold", icon: Trophy, color: "text-yellow-500", requirement: "26-50 Referrals" },
    { level: "Diamond", icon: Crown, color: "text-cyan-400", requirement: "51+ Referrals" }
  ];

  const boostRewards = [
    { value: "5%", label: "Referral Commission", icon: Gift, color: "text-neon-purple" },
    { value: "+15%", label: "Rank Hash Boost", icon: Rocket, color: "text-neon-green" },
    { value: "∞", label: "Gaming Rewards", icon: Gamepad2, color: "text-mining-orange" }
  ];

  return (
    <section id="referral" className="py-24 bg-gradient-to-b from-background via-background to-card/20" data-testid="referral-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Improved Typography */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-4 mb-8">
            <div className="p-3 rounded-full bg-neon-purple/10 border border-neon-purple/20">
              <Rocket className="w-8 h-8 text-neon-purple" />
            </div>
            <h2 className="text-5xl font-bold text-foreground tracking-tight">
              <span className="bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent">
                Boost Rewards
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of our platform through referrals, rank progression, and gaming activities. 
            Build your network, climb the ranks, and access exclusive mining plans with enhanced rewards.
          </p>
        </div>

        {/* Boost Rewards Card - Modern & Clean */}
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 bg-card/60 backdrop-blur-xl border border-border/50 relative overflow-hidden group">
            {/* Subtle accent glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-mining-orange/5 via-transparent to-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative">
              {/* Card Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-10 h-10 text-neon-green" />
                  <h3 className="text-4xl font-bold text-foreground tracking-tight">
                    Unlock Elite Mining Status
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Combine referrals, rank progression, and gaming activities to maximize your mining potential and unlock exclusive benefits.
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                
                {/* Left Column - Referral Program */}
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                      <Users className="w-6 h-6 text-mining-orange" />
                      <h4 className="text-2xl font-bold text-foreground">Referral Program</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {referralSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-xl bg-card/40 border border-border/30 hover-elevate group/step transition-all duration-300"
                        data-testid={`step-${index + 1}`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-mining-orange text-background font-bold text-sm group-hover/step:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-foreground font-medium">{step}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Rank System */}
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                      <Crown className="w-6 h-6 text-neon-purple" />
                      <h4 className="text-2xl font-bold text-foreground">Rank Levels</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {rankLevels.map((rank, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-xl bg-card/40 border border-border/30 hover-elevate group/rank transition-all duration-300"
                        data-testid={`rank-${rank.level.toLowerCase()}`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-card to-card/60 border border-border/50">
                          <rank.icon className={`w-5 h-5 ${rank.color} group-hover/rank:scale-110 transition-transform duration-300`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold ${rank.color}`}>{rank.level}</div>
                          <div className="text-sm text-muted-foreground">{rank.requirement}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exclusive Features Section */}
              <div className="bg-gradient-to-r from-neon-purple/5 via-mining-orange/5 to-neon-green/5 rounded-2xl p-8 border border-border/30 mb-12">
                <h4 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Exclusive Access & Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center group/feature p-4 rounded-xl hover-elevate transition-all duration-300" data-testid="feature-vip-plans">
                    <Shield className="w-10 h-10 mx-auto text-neon-purple mb-3 group-hover/feature:scale-110 transition-transform duration-300" />
                    <div className="font-bold text-foreground mb-2">VIP Mining Plans</div>
                    <div className="text-sm text-muted-foreground">Access to premium mining packages</div>
                  </div>
                  <div className="text-center group/feature p-4 rounded-xl hover-elevate transition-all duration-300" data-testid="feature-gaming">
                    <Gamepad2 className="w-10 h-10 mx-auto text-mining-orange mb-3 group-hover/feature:scale-110 transition-transform duration-300" />
                    <div className="font-bold text-foreground mb-2">Gaming Rewards</div>
                    <div className="text-sm text-muted-foreground">Earn tokens through platform activities</div>
                  </div>
                  <div className="text-center group/feature p-4 rounded-xl hover-elevate transition-all duration-300" data-testid="feature-priority-support">
                    <Star className="w-10 h-10 mx-auto text-neon-green mb-3 group-hover/feature:scale-110 transition-transform duration-300" />
                    <div className="font-bold text-foreground mb-2">Priority Support</div>
                    <div className="text-sm text-muted-foreground">24/7 dedicated assistance</div>
                  </div>
                  <div className="text-center group/feature p-4 rounded-xl hover-elevate transition-all duration-300" data-testid="feature-achievement-bonuses">
                    <Trophy className="w-10 h-10 mx-auto text-yellow-500 mb-3 group-hover/feature:scale-110 transition-transform duration-300" />
                    <div className="font-bold text-foreground mb-2">Achievement Bonuses</div>
                    <div className="text-sm text-muted-foreground">Extra rewards for milestones</div>
                  </div>
                </div>
              </div>

              {/* Boost Rewards Summary */}
              <div className="bg-card/30 rounded-2xl p-8 border border-border/30 mb-12">
                <h4 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Total Boost Potential
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {boostRewards.map((reward, index) => (
                    <div key={index} className="text-center group/reward" data-testid={`reward-${reward.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="mb-4">
                        <reward.icon className={`w-10 h-10 mx-auto ${reward.color} group-hover/reward:scale-110 transition-transform duration-300`} />
                      </div>
                      <div className={`text-4xl font-bold font-mono mb-2 ${reward.color}`}>
                        {reward.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {reward.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modern CTA Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-view-ranks"
                  onClick={() => {
                    console.log("View ranks clicked");
                  }}
                >
                  <Crown className="w-5 h-5 mr-3" />
                  View Rank System
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-neon-purple to-mining-orange text-background font-semibold"
                  data-testid="button-start-boosting"
                  onClick={() => {
                    console.log("Start boosting clicked");
                    onLearnMore?.();
                  }}
                >
                  <Rocket className="w-5 h-5 mr-3" />
                  Start Boosting Now
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}