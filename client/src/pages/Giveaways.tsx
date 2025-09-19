import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Clock, 
  Trophy, 
  Star, 
  Zap,
  Coins,
  Target,
  Calendar,
  Award,
  Sparkles,
  Timer,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Giveaway data
const activeGiveaways = [
  {
    id: "daily-bonus",
    title: "Daily Mining Bonus",
    description: "Claim your daily reward for continuous mining",
    reward: "50 MGC + 25 RZ",
    timeLeft: 18000000, // 5 hours in milliseconds
    type: "daily",
    icon: Gift,
    gradient: "from-neon-purple to-pink-500",
    claimed: false,
    participants: 234,
    maxParticipants: 500
  },
  {
    id: "weekend-boost",
    title: "Weekend Boost",
    description: "Double your mining rewards this weekend",
    reward: "100% Mining Boost",
    timeLeft: 172800000, // 48 hours
    type: "weekend",
    icon: Zap,
    gradient: "from-mining-orange to-yellow-500",
    claimed: false,
    participants: 156,
    maxParticipants: 300
  },
  {
    id: "weekly-treasure",
    title: "Weekly Treasure Hunt",
    description: "Find hidden treasures while mining",
    reward: "500 MGC + Rare NFT",
    timeLeft: 432000000, // 120 hours
    type: "weekly",
    icon: Trophy,
    gradient: "from-neon-purple to-purple-500",
    claimed: true,
    participants: 89,
    maxParticipants: 100
  },
  {
    id: "mega-jackpot",
    title: "Mega Jackpot",
    description: "Ultimate prize for top miners",
    reward: "10,000 MGC + Premium NFT Collection",
    timeLeft: 1209600000, // 2 weeks
    type: "special",
    icon: Crown,
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    claimed: false,
    participants: 45,
    maxParticipants: 50
  }
];

const pastGiveaways = [
  {
    id: "flash-mining",
    title: "Flash Mining Event",
    description: "24-hour mining marathon",
    reward: "200 MGC",
    winner: "CryptoMiner_Pro",
    completedDate: "2024-01-15",
    participants: 412
  },
  {
    id: "holiday-special",
    title: "Holiday Special",
    description: "Festive mining celebration",
    reward: "Christmas NFT + 300 MGC",
    winner: "DiamondMiner99",
    completedDate: "2023-12-25",
    participants: 856
  }
];

// Helper function to format time remaining
function formatTimeRemaining(milliseconds: number): string {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

function GiveawayCard({ giveaway }: { giveaway: typeof activeGiveaways[0] }) {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(giveaway.timeLeft);
  const [claimed, setClaimed] = useState(giveaway.claimed);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    if (claimed || timeLeft <= 0) return;
    
    setClaimed(true);
    toast({
      title: "Reward Claimed! 🎉",
      description: `You've successfully claimed: ${giveaway.reward}`,
    });
  };

  const participationPercent = (giveaway.participants / giveaway.maxParticipants) * 100;
  
  return (
    <Card className={`border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden ${claimed ? 'opacity-75' : ''}`} data-testid={`giveaway-${giveaway.id}`}>
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${giveaway.gradient} opacity-10`}></div>
      <div className="absolute top-2 right-2">
        <Badge className={`bg-gradient-to-r ${giveaway.gradient} text-white border-none text-xs font-bold px-2 py-1`}>
          {giveaway.type.toUpperCase()}
        </Badge>
      </div>
      
      <CardHeader className="relative pb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${giveaway.gradient} flex items-center justify-center shadow-lg`}>
            <giveaway.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white text-lg font-bold">
              {giveaway.title}
            </CardTitle>
            <p className="text-white/60 text-sm">
              {giveaway.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Reward Display */}
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 text-sm mb-1">REWARD</p>
          <p className="text-xl font-bold text-white">{giveaway.reward}</p>
        </div>
        
        {/* Time Remaining */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-mining-orange" />
            <span className="text-white/80">Time Remaining</span>
          </div>
          <span className={`font-mono font-bold ${timeLeft <= 3600000 ? 'text-red-400' : 'text-neon-purple'}`}>
            {formatTimeRemaining(timeLeft)}
          </span>
        </div>
        
        {/* Participation Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/70">
            <span>Participants</span>
            <span>{giveaway.participants} / {giveaway.maxParticipants}</span>
          </div>
          <Progress value={participationPercent} className="h-2" />
        </div>
        
        {/* Claim Button */}
        <Button 
          onClick={handleClaim}
          disabled={claimed || timeLeft <= 0}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
            claimed 
              ? 'bg-gray-600 cursor-not-allowed'
              : timeLeft <= 0
              ? 'bg-gray-600 cursor-not-allowed'
              : `bg-gradient-to-r ${giveaway.gradient} hover:opacity-80 text-white shadow-lg hover:shadow-xl`
          }`}
          data-testid={`button-claim-${giveaway.id}`}
        >
          {claimed ? '✅ CLAIMED' : timeLeft <= 0 ? '⏰ EXPIRED' : '🎁 CLAIM REWARD'}
        </Button>
      </CardContent>
    </Card>
  );
}

function PastGiveawayCard({ giveaway }: { giveaway: typeof pastGiveaways[0] }) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-white font-bold">{giveaway.title}</h4>
            <p className="text-white/60 text-sm">{giveaway.description}</p>
            <p className="text-neon-purple text-sm font-medium mt-1">
              Winner: {giveaway.winner}
            </p>
          </div>
          <div className="text-right">
            <p className="text-mining-orange font-bold">{giveaway.reward}</p>
            <p className="text-white/50 text-xs">{giveaway.completedDate}</p>
            <p className="text-white/50 text-xs">{giveaway.participants} participants</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Giveaways() {
  const activeCount = activeGiveaways.filter(g => !g.claimed).length;
  const totalParticipants = activeGiveaways.reduce((sum, g) => sum + g.participants, 0);
  
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-purple rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-mining-orange rounded-full animate-pulse opacity-50"></div>
      </div>

      {/* Header */}
      <div className="relative text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-purple-400 to-mining-orange bg-clip-text text-transparent">
          🎁 Active Giveaways & Rewards
        </h1>
        <p className="text-white/70 text-xl">
          Participate in exclusive events and win amazing rewards!
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-8 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-purple">{activeCount}</p>
            <p className="text-white/60 text-sm">Active Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-mining-orange">{totalParticipants}</p>
            <p className="text-white/60 text-sm">Total Participants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-purple">5,000+</p>
            <p className="text-white/60 text-sm">MGC in Prizes</p>
          </div>
        </div>
      </div>

      {/* Active Giveaways */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Featured Events</h2>
          <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
            {activeCount} Active
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {activeGiveaways.map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      </div>

      {/* Past Giveaways */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-mining-orange" />
          <h2 className="text-2xl font-bold text-white">Recent Winners</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastGiveaways.map((giveaway) => (
            <PastGiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 p-8 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-2xl text-center backdrop-blur-lg">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Trophy className="w-10 h-10 text-mining-orange" />
          <h3 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent">
            More Events Coming Soon!
          </h3>
          <Star className="w-10 h-10 text-yellow-400" />
        </div>
        <p className="text-white/70 text-lg mb-6">
          Stay tuned for bigger prizes and more exciting challenges. The best rewards are yet to come!
        </p>
        <div className="flex items-center justify-center space-x-6">
          <Badge className="bg-gradient-to-r from-neon-purple to-pink-500 text-white border-none px-6 py-3 text-lg">
            <Gift className="w-5 h-5 mr-2" />
            Weekly Events
          </Badge>
          <Badge className="bg-gradient-to-r from-mining-orange to-orange-500 text-white border-none px-6 py-3 text-lg">
            <Crown className="w-5 h-5 mr-2" />
            VIP Rewards
          </Badge>
        </div>
      </div>
    </div>
  );
}