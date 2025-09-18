import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";

interface ReferralSectionProps {
  onLearnMore?: () => void;
}

export default function ReferralSection({ onLearnMore }: ReferralSectionProps) {
  const steps = [
    "Share your unique referral link",
    "Friends join and start mining",
    "Both earn bonus rewards and increased hash rates"
  ];

  return (
    <section id="referral" className="py-20 bg-gradient-to-b from-background to-card/30" data-testid="referral-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-mining-orange" />
            <h2 className="text-4xl font-bold text-foreground font-mono">
              <span className="bg-gradient-to-r from-mining-orange to-neon-green bg-clip-text text-transparent">
                REFERRAL PROGRAM
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Invite friends to join our mining platform and earn bonus rewards together. 
            The more people you refer, the higher your mining efficiency becomes.
          </p>
        </div>

        {/* Referral Program Card - Centered */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-10 bg-gradient-to-br from-card/90 to-background/60 backdrop-blur-xl border-2 border-neon-green/40 relative overflow-hidden hover-elevate">
            {/* Enhanced Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-neon-green/15 via-mining-orange/10 to-neon-purple/15 rounded-xl blur-2xl opacity-60"></div>
            
            <div className="relative">
              <div className="text-center mb-10">
                <div className="inline-flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-8 h-8 text-neon-green" />
                  <h3 className="text-3xl font-bold text-foreground">
                    Earn Together, Mine Better
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Share the mining opportunity and unlock enhanced rewards for everyone
                </p>
              </div>

              {/* How It Works Steps */}
              <div className="space-y-6 mb-10">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-6 rounded-xl bg-gradient-to-r from-card/60 to-card/40 border border-border/40 hover-elevate group transition-all duration-300"
                    data-testid={`step-${index + 1}`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-neon-green via-mining-orange to-neon-purple text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-foreground font-semibold text-lg">{step}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reward Benefits */}
              <div className="bg-gradient-to-r from-neon-purple/10 via-mining-orange/10 to-neon-green/10 rounded-xl p-8 border border-neon-purple/30 mb-8">
                <h4 className="text-xl font-bold text-foreground mb-6 text-center">
                  Referral Rewards
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-neon-purple font-mono">5%</div>
                    <div className="text-sm text-muted-foreground font-medium">Commission</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-neon-green font-mono">+10%</div>
                    <div className="text-sm text-muted-foreground font-medium">Hash Rate Boost</div>
                  </div>
                  <div className="space-y-2 md:col-span-1 col-span-2">
                    <div className="text-3xl font-bold text-mining-orange font-mono">∞</div>
                    <div className="text-sm text-muted-foreground font-medium">Unlimited Referrals</div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-mining-orange via-neon-purple to-neon-green text-white font-bold py-4 text-lg hover:shadow-xl hover:shadow-neon-green/30 transition-all duration-500 hover:scale-105"
                data-testid="button-start-referring"
                onClick={() => {
                  console.log("Start referring clicked");
                  onLearnMore?.();
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                Start Referring Friends
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}