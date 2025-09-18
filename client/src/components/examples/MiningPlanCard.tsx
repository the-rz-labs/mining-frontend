import MiningPlanCard, { type MiningPlan } from '../MiningPlanCard';
import mgcRigImage from "@assets/generated_images/Purple_neon_mining_rig_MGC_62391ec5.png";
import rzRigImage from "@assets/generated_images/Green_neon_mining_rig_RZ_7f27de2a.png";

export default function MiningPlanCardExample() {
  //todo: remove mock functionality
  const mgcPlan: MiningPlan = {
    id: "mgc-pro",
    name: "MGC Pro Miner",
    token: "MGC",
    hashRate: "150 MH/s",
    minInvestment: 5000,
    dailyReward: "45.2 MGC",
    image: mgcRigImage,
    popular: true,
    features: [
      "Advanced GPU optimization",
      "24/7 monitoring system",
      "Auto-difficulty adjustment",
      "Priority pool access"
    ],
    roiPercentage: 18
  };

  const rzPlan: MiningPlan = {
    id: "rz-elite",
    name: "RZ Elite Miner", 
    token: "RZ",
    hashRate: "200 MH/s",
    minInvestment: 8000,
    dailyReward: "32.1 RZ",
    image: rzRigImage,
    features: [
      "Enterprise-grade hardware",
      "Smart cooling system",
      "Real-time analytics",
      "Premium support"
    ],
    roiPercentage: 22
  };

  return (
    <div className="p-8 bg-background grid grid-cols-1 lg:grid-cols-2 gap-8">
      <MiningPlanCard 
        plan={mgcPlan}
        onStartMining={(plan) => console.log("Starting mining for:", plan.name)}
      />
      <MiningPlanCard 
        plan={rzPlan}
        onStartMining={(plan) => console.log("Starting mining for:", plan.name)}
      />
    </div>
  );
}