import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, ArrowRight, Trophy, Star, Crown, Gamepad2, Shield, Rocket } from "lucide-react";

interface ReferralSectionProps {
  onLearnMore?: () => void;
}

export default function ReferralSection({ onLearnMore }: ReferralSectionProps) {
  const rankingBenefits = [
    { feature: "Level Promotions", icon: Trophy, color: "text-neon-purple", description: "Advance through tiers on Ranking platform" },
    { feature: "Exclusive Mining Plans", icon: Crown, color: "text-mining-orange", description: "Access VIP packages via Ranking status" },
    { feature: "Gaming Rewards", icon: Gamepad2, color: "text-neon-green", description: "Earn tokens through Ranking activities" }
  ];

  const boostRewards = [
    { value: "+15%", label: "Ranking Hash Boost", icon: Rocket, color: "text-neon-green" },
    { value: "∞", label: "Gaming Rewards", icon: Gamepad2, color: "text-mining-orange" },
    { value: "VIP", label: "Exclusive Access", icon: Crown, color: "text-neon-purple" }
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
            Unlock the full potential of our platform through Ranking platform progression and gaming activities. 
            Connect your account, climb the ranks, and access exclusive mining plans with enhanced rewards.
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
                  Connect to Ranking platform and engage in gaming activities to maximize your mining potential and unlock exclusive benefits.
                </p>
              </div>

              {/* Ranking Platform Connection - Centered */}
              <div className="max-w-2xl mx-auto mb-16">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                      <Gamepad2 className="w-6 h-6 text-neon-green" />
                      <h4 className="text-3xl font-bold text-foreground">Ranking Platform</h4>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                      Connect your account to unlock exclusive benefits
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {rankingBenefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-6 p-6 rounded-xl bg-card/40 border border-border/30 hover-elevate group/benefit transition-all duration-300"
                        data-testid={`ranking-${benefit.feature.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-card to-card/60 border border-border/50">
                          <benefit.icon className={`w-6 h-6 ${benefit.color} group-hover/benefit:scale-110 transition-transform duration-300`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold text-lg ${benefit.color}`}>{benefit.feature}</div>
                          <div className="text-muted-foreground">{benefit.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connection Status & Benefits */}
              <div className="bg-gradient-to-r from-neon-green/5 via-mining-orange/5 to-neon-purple/5 rounded-2xl p-8 border border-border/30 mb-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-neon-green/10 border border-neon-green/20">
                      <Gamepad2 className="w-6 h-6 text-neon-green" />
                    </div>
                    <h4 className="text-2xl font-bold text-foreground">
                      Ranking Platform Benefits
                    </h4>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Link your mining account to Ranking platform and unlock these exclusive rewards
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center group/feature p-6 rounded-xl bg-card/30 border border-border/30 hover-elevate transition-all duration-300" data-testid="feature-ranking-levels">
                    <Trophy className="w-12 h-12 mx-auto text-neon-purple mb-4 group-hover/feature:scale-110 transition-transform duration-300" />
                    <div className="font-bold text-foreground mb-2 text-lg">Level Promotions</div>
                    <div className="text-sm text-muted-foreground">Advance through Ranking tiers to unlock higher mining multipliers and exclusive access</div>
                  </div>
                  <div className="text-center group/feature p-6 rounded-xl bg-card/30 border border-border/30 hover-elevate transition-all duration-300" data-testid="feature-gaming-activities">
                    <Gamepad2 className="w-12 h-12 mx-auto text-mining-orange mb-4 group-hover/feature:scale-110 transition-transform duration-300" />
                    <div className="font-bold text-foreground mb-2 text-lg">Gaming Activities</div>
                    <div className="text-sm text-muted-foreground">Complete challenges and activities on Ranking to earn bonus mining tokens and rewards</div>
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
                  data-testid="button-connect-ranking"
                  onClick={() => {
                    console.log("Connect Ranking platform clicked");
                  }}
                >
                  <Gamepad2 className="w-5 h-5 mr-3" />
                  Connect Ranking Platform
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