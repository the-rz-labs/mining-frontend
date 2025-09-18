import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, ArrowRight, Gift, Zap, Infinity as InfinityIcon } from "lucide-react";

interface ReferralSectionProps {
  onLearnMore?: () => void;
}

export default function ReferralSection({ onLearnMore }: ReferralSectionProps) {
  const steps = [
    "Share your unique referral link",
    "Friends join and start mining",
    "Both earn bonus rewards and increased hash rates"
  ];

  const rewards = [
    { value: "5%", label: "Commission", icon: Gift, color: "text-neon-purple" },
    { value: "+10%", label: "Hash Rate Boost", icon: Zap, color: "text-neon-green" },
    { value: "∞", label: "Unlimited Referrals", icon: InfinityIcon, color: "text-mining-orange" }
  ];

  return (
    <section id="referral" className="py-24 bg-gradient-to-b from-background via-background to-card/20" data-testid="referral-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Improved Typography */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-4 mb-8">
            <div className="p-3 rounded-full bg-mining-orange/10 border border-mining-orange/20">
              <Users className="w-8 h-8 text-mining-orange" />
            </div>
            <h2 className="text-5xl font-bold text-foreground tracking-tight">
              <span className="bg-gradient-to-r from-mining-orange to-neon-green bg-clip-text text-transparent">
                Referral Program
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Invite friends to join our mining platform and earn bonus rewards together. 
            The more people you refer, the higher your mining efficiency becomes.
          </p>
        </div>

        {/* Referral Program Card - Modern & Clean */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-card/60 backdrop-blur-xl border border-border/50 relative overflow-hidden group">
            {/* Subtle accent glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-mining-orange/5 via-transparent to-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative">
              {/* Card Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-10 h-10 text-neon-green" />
                  <h3 className="text-3xl font-bold text-foreground tracking-tight">
                    Earn Together, Mine Better
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Share the mining opportunity and unlock enhanced rewards for everyone
                </p>
              </div>

              {/* How It Works Steps - Modern Design */}
              <div className="grid gap-4 mb-12">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-6 p-6 rounded-2xl bg-card/40 border border-border/30 hover-elevate group/step transition-all duration-300"
                    data-testid={`step-${index + 1}`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mining-orange text-background font-bold text-lg group-hover/step:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-foreground font-medium text-lg">{step}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover/step:text-mining-orange group-hover/step:translate-x-1 transition-all duration-300" />
                  </div>
                ))}
              </div>

              {/* Reward Benefits - Clean Grid */}
              <div className="bg-card/30 rounded-2xl p-8 border border-border/30 mb-10">
                <h4 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Referral Rewards
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {rewards.map((reward, index) => (
                    <div key={index} className="text-center group/reward">
                      <div className="mb-4">
                        <reward.icon className={`w-8 h-8 mx-auto ${reward.color} group-hover/reward:scale-110 transition-transform duration-300`} />
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

              {/* Modern CTA Button */}
              <Button
                size="lg"
                className="w-full bg-mining-orange text-background font-semibold py-6 text-lg rounded-xl hover:shadow-2xl hover:shadow-mining-orange/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-start-referring"
                onClick={() => {
                  console.log("Start referring clicked");
                  onLearnMore?.();
                }}
              >
                <Users className="w-5 h-5 mr-3" />
                Start Referring Friends
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}