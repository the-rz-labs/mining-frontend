import { useState, useEffect, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Combine all plans and identify top ROI
  const allPlans = [...mgcPlans, ...rzPlans];
  const topROI = Math.max(...allPlans.map(p => p.roiPercentage));

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const cardWidth = 380; // Approximate card width + gap
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScrollLeft) {
        // Reset to beginning
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentIndex(0);
      } else {
        // Scroll to next card
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        setCurrentIndex(prev => prev + 1);
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Manual scroll functions
  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const cardWidth = 380;
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const cardWidth = 380;
    scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
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

          {/* Scroll Controls */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              data-testid="scroll-left"
              className="rounded-full border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-neon-purple border-neon-purple/30">
                MGC Plans
              </Badge>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-neon-purple to-neon-green"></div>
              <Badge variant="outline" className="text-neon-green border-neon-green/30">
                RZ Plans
              </Badge>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              data-testid="scroll-right"
              className="rounded-full border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mining Plans Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 px-4 snap-x snap-mandatory scroll-smooth"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-testid="plans-carousel"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {allPlans.map((plan, index) => (
              <div
                key={plan.id}
                className="flex-shrink-0 snap-start min-w-[280px] sm:min-w-[320px] md:min-w-[360px] xl:min-w-[380px]"
              >
                <MiningPlanCard
                  plan={plan}
                  highlightTop={plan.roiPercentage === topROI}
                  onStartMining={(plan) => {
                    console.log(`Starting mining for ${plan.name}`);
                    onStartMining?.(plan);
                  }}
                />
              </div>
            ))}
          </div>
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