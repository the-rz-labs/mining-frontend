import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Cpu } from "lucide-react";
import MiningPlanCard, { type MiningPlan } from "./MiningPlanCard";

interface MiningPlansSectionProps {
  onStartMining?: (plan: MiningPlan) => void;
}

interface ApiPlan {
  id: number;
  name: string;
  power: number;
  price: number;
  token_details: Array<{
    id: number;
    symbol: string;
    name: string;
  }>;
  image: string;
  monthly_reward_percent: string;
  video_url: string;
}

interface ApiResponse {
  count: number;
  results: ApiPlan[];
}

export default function MiningPlansSection({ onStartMining }: MiningPlansSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch mining plans from API
  const { data: apiResponse, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['/api/plans'],
    queryFn: async () => {
      const response = await fetch('http://api.coinmaining.game/api/plans/plans/');
      if (!response.ok) {
        throw new Error('Failed to fetch mining plans');
      }
      return response.json();
    }
  });

  // Transform API data to MiningPlan format
  const allPlans: MiningPlan[] = apiResponse?.results.map((plan) => {
    const token = plan.token_details[0]?.symbol as "MGC" | "RZ";
    const monthlyRewardPercent = parseFloat(plan.monthly_reward_percent);
    const dailyRewardAmount = (plan.price * monthlyRewardPercent / 100 / 30).toFixed(2);
    
    return {
      id: plan.id.toString(),
      name: plan.name,
      token: token,
      hashRate: `${plan.power} TH/s`,
      minInvestment: plan.price,
      dailyReward: `${dailyRewardAmount} ${token}`,
      image: plan.image,
      roiPercentage: monthlyRewardPercent
    };
  }) || [];

  // Separate MGC and RZ plans
  const mgcPlans = allPlans.filter(p => p.token === "MGC");
  const rzPlans = allPlans.filter(p => p.token === "RZ");

  // Find top ROI
  const topROI = allPlans.length > 0 ? Math.max(...allPlans.map(p => p.roiPercentage)) : 0;
  const topMGC = mgcPlans.length > 0 ? Math.max(...mgcPlans.map(p => p.roiPercentage)) : 0;

  // Get dynamic card width for responsive scrolling
  const getCardWidth = () => {
    if (!scrollRef.current) return 400;
    const firstCard = scrollRef.current.querySelector('[data-plan-index="0"]') as HTMLElement;
    if (!firstCard) return 400;
    const rect = firstCard.getBoundingClientRect();
    const gap = 24; // 6 in Tailwind = 24px gap
    return rect.width + gap;
  };

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || !scrollRef.current || allPlans.length === 0) return;

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

  // Loading state
  if (isLoading) {
    return (
      <section id="plans" className="py-20 bg-gradient-to-b from-card/30 to-background" data-testid="mining-plans-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading mining plans...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="plans" className="py-20 bg-gradient-to-b from-card/30 to-background" data-testid="mining-plans-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            <p>Failed to load mining plans. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

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
