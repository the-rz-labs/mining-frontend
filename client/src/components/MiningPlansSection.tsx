import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Cpu, Zap } from "lucide-react";
import MiningPlanCard, { type MiningPlan } from "./MiningPlanCard";

const BASE_URL = "https://coinmaining.game";

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
      name: "MGC Basic",
      token: "MGC",
      hashRate: "50 MH/s", 
      minInvestment: 1000,
      dailyReward: "12.5 MGC",
      image: `${BASE_URL}/images/1mgc.webp`,
      roiPercentage: 1
    },
    {
      id: "mgc-pro",
      name: "MGC Standard",
      token: "MGC",
      hashRate: "150 MH/s",
      minInvestment: 5000,
      dailyReward: "45.2 MGC", 
      image: `${BASE_URL}/images/2mgc.webp`,
      popular: true,
      roiPercentage: 1.1
    },
    {
      id: "mgc-elite",
      name: "MGC Advanced",
      token: "MGC",
      hashRate: "300 MH/s",
      minInvestment: 12000,
      dailyReward: "95.8 MGC",
      image: `${BASE_URL}/images/3mgc.webp`,
      roiPercentage: 1.2
    },
    {
      id: "mgc-ultimate",
      name: "MGC Expert",
      token: "MGC", 
      hashRate: "500 MH/s",
      minInvestment: 25000,
      dailyReward: "168.5 MGC",
      image: `${BASE_URL}/images/4mgc.webp`,
      roiPercentage: 1.3
    },
    {
      id: "mgc-enterprise",
      name: "MGC Titan",
      token: "MGC",
      hashRate: "1000 MH/s",
      minInvestment: 50000,
      dailyReward: "350.0 MGC",
      image: `${BASE_URL}/images/5mgc.webp`,
      roiPercentage: 1.4
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
      image: `${BASE_URL}/images/1rz.webp`,
      roiPercentage: 1
    },
    {
      id: "rz-advanced",
      name: "RZ Standard", 
      token: "RZ",
      hashRate: "200 MH/s",
      minInvestment: 8000,
      dailyReward: "52.1 RZ",
      image: `${BASE_URL}/images/2rz.webp`,
      popular: true,
      roiPercentage: 1.1
    },
    {
      id: "rz-professional",
      name: "RZ Advanced",
      token: "RZ", 
      hashRate: "400 MH/s",
      minInvestment: 18000,
      dailyReward: "110.4 RZ",
      image: `${BASE_URL}/images/3rz.webp`,
      roiPercentage: 1.2
    },
    {
      id: "rz-master",
      name: "RZ Expert",
      token: "RZ",
      hashRate: "750 MH/s", 
      minInvestment: 35000,
      dailyReward: "215.8 RZ",
      image: `${BASE_URL}/images/4rz.webp`,
      roiPercentage: 1.3
    },
    {
      id: "rz-titan",
      name: "RZ Titan",
      token: "RZ",
      hashRate: "1500 MH/s",
      minInvestment: 75000, 
      dailyReward: "450.0 RZ",
      image: `${BASE_URL}/images/5rz.webp`,
      roiPercentage: 1.4
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
              aria-label="Scroll left through mining plans"
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
              aria-label="Scroll right through mining plans"
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
            className="flex overflow-x-auto scrollbar-hide gap-6 py-6 px-12 snap-x snap-mandatory scroll-smooth"
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
                className="flex-shrink-0 snap-start w-[360px] sm:w-[380px] md:w-[390px] xl:w-[400px]"
                data-plan-index={index}
              >
                <MiningPlanCard
                  plan={plan}
                  highlightTop={plan.roiPercentage === topROI}
                  highlightTopMGC={plan.token === "MGC" && plan.roiPercentage === topMGC}
                  onStartMining={(plan) => {
                    console.log(`Starting mining for ${plan.name}`);
                    onStartMining?.(plan);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}