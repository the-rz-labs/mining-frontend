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

  // Get dynamic card width for responsive scrolling
  const getCardWidth = () => {
    if (!scrollRef.current) return 400;
    const firstCard = scrollRef.current.querySelector('[data-plan-index="0"]') as HTMLElement;
    if (!firstCard) return 400;
    const rect = firstCard.getBoundingClientRect();
    const gap = 24; // 6 in Tailwind = 24px gap
    return rect.width + gap;
  };

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
  const topMGC = Math.max(...mgcPlans.map(p => p.roiPercentage));

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const cardWidth = getCardWidth();
      const totalPlans = allPlans.length;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScrollLeft - 50) {
        // At the end, reset to beginning immediately 
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentIndex(0);
      } else {
        // Scroll to next card
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        setCurrentIndex(prev => (prev + 1) % totalPlans);
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, allPlans.length]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Manual scroll functions
  const scrollLeft = () => {
    if (!scrollRef.current) return;
    const cardWidth = getCardWidth();
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const cardWidth = getCardWidth();
    const container = scrollRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    if (container.scrollLeft >= maxScrollLeft - 50) {
      // At the end, cycle back to beginning
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <section id="plans" className="py-32 bg-white" data-testid="mining-plans-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black text-center mb-8">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-none">
              A FRAGMENTED MARKET
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every game is different - different engines, devices, standards, and art styles. Moving miners and 
            assets between them is complex. Our platform solves this with infrastructure designed for interoperability. 
            Our technology handles translation, optimization, and delivery across engines, platforms, and formats - 
            ensuring miners perform consistently, look great, and fit seamlessly into any experience.
          </p>

        </div>

        {/* Simple Mining Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Featured plans only - simplified */}
          {[
            {
              name: "Starter",
              token: "MGC",
              hashRate: "50 MH/s",
              dailyReward: "12.5 MGC",
              features: ["Basic mining setup", "Standard support", "Pool access"]
            },
            {
              name: "Professional", 
              token: "RZ",
              hashRate: "200 MH/s",
              dailyReward: "52.1 RZ",
              features: ["Advanced optimization", "24/7 monitoring", "Priority support"],
              popular: true
            },
            {
              name: "Enterprise",
              token: "MGC", 
              hashRate: "1000 MH/s",
              dailyReward: "350.0 MGC",
              features: ["Industrial scale", "Dedicated manager", "Custom solutions"]
            }
          ].map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-gray-50 rounded-3xl p-8 border transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-purple-200 shadow-lg shadow-purple-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-black text-purple-600 mb-1">{plan.hashRate}</div>
                <div className="text-gray-600 mb-6">{plan.dailyReward} daily</div>
                
                <div className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => onStartMining?.({ 
                    id: plan.name.toLowerCase(),
                    name: plan.name,
                    token: plan.token,
                    hashRate: plan.hashRate,
                    dailyReward: plan.dailyReward,
                    features: plan.features,
                    minInvestment: 1000,
                    roiPercentage: 20,
                    image: mgcRig1
                  } as MiningPlan)}
                  className={`w-full rounded-xl py-3 font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Start Mining
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}