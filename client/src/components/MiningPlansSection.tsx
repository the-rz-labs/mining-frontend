import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Cpu, Zap } from "lucide-react";
import MiningPlanCard, { type MiningPlan } from "./MiningPlanCard";
import mgcRig1 from "@assets/generated_images/Purple_neon_mining_rig_MGC_62391ec5.png";
import rzRig1 from "@assets/generated_images/Green_neon_mining_rig_RZ_7f27de2a.png";
import orangeRig from "@assets/generated_images/Orange_accent_mining_rig_54bcdb96.png";
import whiteRig from "@assets/generated_images/Premium_white_purple_mining_rig_e2f86744.png";

interface MiningPlansSectionProps {
  onStartMining?: (plan: MiningPlan) => void;
}

export default function MiningPlansSection({ onStartMining }: MiningPlansSectionProps) {
  const [activeTab, setActiveTab] = useState<"MGC" | "RZ">("MGC");

  // Auto-scroll effect between MGC and RZ plans
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => prev === "MGC" ? "RZ" : "MGC");
    }, 8000); // Switch every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // todo: remove mock functionality - replace with real mining plan data
  const mgcPlans: MiningPlan[] = [
    {
      id: "mgc-starter",
      name: "MGC Starter",
      token: "MGC",
      hashRate: "50 MH/s", 
      minInvestment: 1000,
      dailyReward: "12.5 MGC",
      image: mgcRig1,
      features: ["Basic mining setup", "Standard support", "Pool access"],
      roiPercentage: 15
    },
    {
      id: "mgc-pro",
      name: "MGC Pro",
      token: "MGC",
      hashRate: "150 MH/s",
      minInvestment: 5000,
      dailyReward: "45.2 MGC", 
      image: whiteRig,
      popular: true,
      features: ["Advanced GPU optimization", "24/7 monitoring", "Priority support"],
      roiPercentage: 18
    },
    {
      id: "mgc-elite",
      name: "MGC Elite",
      token: "MGC",
      hashRate: "300 MH/s",
      minInvestment: 12000,
      dailyReward: "95.8 MGC",
      image: mgcRig1,
      features: ["Enterprise hardware", "Dedicated support", "Custom pools"],
      roiPercentage: 22
    },
    {
      id: "mgc-ultimate",
      name: "MGC Ultimate",
      token: "MGC", 
      hashRate: "500 MH/s",
      minInvestment: 25000,
      dailyReward: "168.5 MGC",
      image: whiteRig,
      features: ["Max performance", "VIP support", "Exclusive features"],
      roiPercentage: 25
    },
    {
      id: "mgc-enterprise",
      name: "MGC Enterprise",
      token: "MGC",
      hashRate: "1000 MH/s",
      minInvestment: 50000,
      dailyReward: "350.0 MGC",
      image: mgcRig1,
      features: ["Industrial scale", "Dedicated manager", "Custom solutions"],
      roiPercentage: 28
    }
  ];

  const rzPlans: MiningPlan[] = [
    {
      id: "rz-basic",
      name: "RZ Basic",
      token: "RZ",
      hashRate: "75 MH/s",
      minInvestment: 2000,
      dailyReward: "18.3 RZ",
      image: rzRig1,
      features: ["Eco-friendly mining", "Green energy", "Basic analytics"],
      roiPercentage: 16
    },
    {
      id: "rz-advanced",
      name: "RZ Advanced", 
      token: "RZ",
      hashRate: "200 MH/s",
      minInvestment: 8000,
      dailyReward: "52.1 RZ",
      image: orangeRig,
      popular: true,
      features: ["Smart cooling", "Auto-optimization", "Real-time monitoring"],
      roiPercentage: 20
    },
    {
      id: "rz-professional",
      name: "RZ Professional",
      token: "RZ", 
      hashRate: "400 MH/s",
      minInvestment: 18000,
      dailyReward: "110.4 RZ",
      image: rzRig1,
      features: ["Professional grade", "Advanced analytics", "Priority pools"],
      roiPercentage: 24
    },
    {
      id: "rz-master",
      name: "RZ Master",
      token: "RZ",
      hashRate: "750 MH/s", 
      minInvestment: 35000,
      dailyReward: "215.8 RZ",
      image: orangeRig,
      features: ["Master tier performance", "Dedicated resources", "Premium support"],
      roiPercentage: 27
    },
    {
      id: "rz-titan",
      name: "RZ Titan",
      token: "RZ",
      hashRate: "1500 MH/s",
      minInvestment: 75000, 
      dailyReward: "450.0 RZ",
      image: rzRig1,
      features: ["Maximum power", "Custom hardware", "White-glove service"],
      roiPercentage: 30
    }
  ];

  const currentPlans = activeTab === "MGC" ? mgcPlans : rzPlans;
  const tabColors = {
    MGC: {
      active: "bg-gradient-to-r from-neon-purple to-purple-600 text-white",
      inactive: "text-neon-purple hover:bg-purple-900/20 border-neon-purple/30"
    },
    RZ: {
      active: "bg-gradient-to-r from-neon-green to-emerald-600 text-white", 
      inactive: "text-neon-green hover:bg-green-900/20 border-neon-green/30"
    }
  };

  return (
    <section id="plans" className="py-20 bg-gradient-to-b from-card/30 to-background" data-testid="mining-plans-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Cpu className="w-8 h-8 text-neon-purple" />
            <h2 className="text-4xl font-bold text-foreground font-mono">
              <span className="bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                MINING PLANS
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose from our professional mining plans designed for maximum profitability. 
            Each plan includes cutting-edge hardware and 24/7 monitoring.
          </p>

          {/* Tab Selector */}
          <div className="flex justify-center space-x-4 mb-12">
            {(["MGC", "RZ"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                size="lg"
                data-testid={`tab-${tab.toLowerCase()}`}
                onClick={() => {
                  console.log(`Switched to ${tab} plans`);
                  setActiveTab(tab);
                }}
                className={`px-8 py-4 text-lg font-semibold transition-all duration-500 transform hover:scale-105 ${
                  activeTab === tab 
                    ? tabColors[tab].active + " shadow-lg"
                    : `${tabColors[tab].inactive} border-2`
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab} Token Plans</span>
                  <Badge variant="secondary" className="ml-2">
                    {tab === "MGC" ? "5" : "5"} Plans
                  </Badge>
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Mining Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 max-w-7xl mx-auto transition-all duration-700 ease-in-out">
          {currentPlans.map((plan, index) => (
            <div
              key={plan.id}
              className="transform transition-all duration-700 ease-in-out opacity-0 translate-y-4 animate-fade-in"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <MiningPlanCard
                plan={plan}
                onStartMining={(plan) => {
                  console.log(`Starting mining for ${plan.name}`);
                  onStartMining?.(plan);
                }}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-neon-purple/10 via-mining-orange/10 to-neon-green/10 rounded-xl p-8 border border-neon-purple/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our enterprise team can design custom mining solutions for large-scale operations. 
              Get dedicated hardware, priority support, and tailored configurations.
            </p>
            <Button
              size="lg"
              data-testid="button-custom-solution"
              onClick={() => {
                console.log("Custom solution inquiry clicked");
              }}
              className="bg-gradient-to-r from-mining-orange to-neon-green text-white font-semibold px-8 py-4 hover:shadow-lg hover:shadow-mining-orange/25 transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Contact Enterprise Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}