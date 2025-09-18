import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Zap, TrendingUp, Shield, Gift } from "lucide-react";

interface ReferralSectionProps {
  onLearnMore?: () => void;
}

export default function ReferralSection({ onLearnMore }: ReferralSectionProps) {
  const benefits = [
    {
      icon: Zap,
      title: "Increased Hash Rate",
      description: "Boost your mining power with every successful referral",
      color: "text-neon-purple"
    },
    {
      icon: TrendingUp,
      title: "Higher Rewards",
      description: "Earn more tokens through enhanced mining efficiency",
      color: "text-neon-green"
    },
    {
      icon: Shield,
      title: "Network Growth",
      description: "Contribute to platform security and decentralization",
      color: "text-mining-orange"
    }
  ];

  const steps = [
    "Connect with fellow miners",
    "Share the mining opportunity",
    "Enjoy increased hash rates together"
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
                BOOST YOUR MINING
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Expand your mining network and increase your hash rate through our professional referral system. 
            Build stronger mining operations by connecting with other miners.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Gift className="w-6 h-6 text-neon-purple mr-3" />
                Mining Network Benefits
              </h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover-elevate group transition-all duration-300"
                    data-testid={`benefit-card-${index}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-${benefit.color.split('-')[1]}-900/20 to-${benefit.color.split('-')[1]}-800/20 border border-${benefit.color.split('-')[1]}-500/30`}>
                        <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-semibold ${benefit.color} mb-2`}>
                          {benefit.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - How It Works */}
          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-card/80 to-background/50 backdrop-blur-sm border-2 border-neon-green/30 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/10 to-mining-orange/10 rounded-lg blur-xl opacity-50"></div>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-neon-green" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Professional Referral Program
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Grow your mining network and maximize your hash rate potential
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4 mb-8">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 border border-border/30"
                      data-testid={`step-${index + 1}`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-mining-orange text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-foreground font-medium">{step}</span>
                    </div>
                  ))}
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-r from-neon-purple/10 to-neon-green/10 rounded-lg p-6 border border-neon-purple/20 mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 text-center">
                    Network Growth Impact
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-neon-purple font-mono">+15%</div>
                      <div className="text-xs text-muted-foreground">Hash Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neon-green font-mono">+25%</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-mining-orange font-mono">+30%</div>
                      <div className="text-xs text-muted-foreground">Rewards</div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-mining-orange to-neon-green text-white font-semibold py-3 hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300"
                  data-testid="button-learn-referral"
                  onClick={() => {
                    console.log("Learn more about referral program clicked");
                    onLearnMore?.();
                  }}
                >
                  Learn More About Network Growth
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}