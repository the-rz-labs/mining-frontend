import { useState } from "react";
import { 
  Trophy, 
  Star, 
  Zap,
  Award,
  Crown,
  Lock,
  Unlock,
  Gift,
  Flame,
  Gem,
  Coins,
  Timer,
  Sparkles,
  Medal,
  Shield,
  Sword,
  Rocket,
  Diamond,
  Gamepad2,
  TrendingUp,
  User,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Achievement badges data (same as before but organized for achievements page)
const achievementBadges = {
  first_mine: { 
    label: "Mining Pioneer", 
    description: "Complete your first mining session", 
    icon: Zap, 
    color: "from-blue-500 to-cyan-500",
    unlocked: true,
    rarity: "common",
    requirement: "Mine for 1 hour"
  },
  mining_streak_7: { 
    label: "Consistent Miner", 
    description: "Mine for 7 consecutive days", 
    icon: Flame, 
    color: "from-orange-500 to-red-500",
    unlocked: true,
    rarity: "uncommon", 
    requirement: "7-day streak"
  },
  mining_streak_30: { 
    label: "Mining Legend", 
    description: "Achieve 30-day mining streak", 
    icon: Medal, 
    color: "from-purple-500 to-pink-500",
    unlocked: false,
    rarity: "rare",
    requirement: "30-day streak"
  },
  referral_master: { 
    label: "Community Builder", 
    description: "Invite 5 friends to start mining", 
    icon: User, 
    color: "from-green-500 to-emerald-500",
    unlocked: true,
    rarity: "uncommon",
    requirement: "5 referrals"
  },
  treasure_hunter: { 
    label: "Treasure Hunter", 
    description: "Claim 25 daily bonuses", 
    icon: Gem, 
    color: "from-yellow-500 to-orange-500",
    unlocked: false,
    rarity: "epic",
    requirement: "25 daily claims"
  },
  mining_marathon: { 
    label: "Mining Marathon", 
    description: "Mine continuously for 24 hours", 
    icon: Timer, 
    color: "from-purple-600 to-indigo-600",
    unlocked: false,
    rarity: "epic",
    requirement: "24h continuous"
  },
  speed_demon: { 
    label: "Lightning Miner", 
    description: "Achieve highest mining efficiency", 
    icon: Rocket, 
    color: "from-cyan-500 to-blue-500",
    unlocked: false,
    rarity: "rare", 
    requirement: "95%+ efficiency"
  },
  diamond_hands: { 
    label: "Diamond Hands", 
    description: "Hold mined tokens for 100+ days", 
    icon: Diamond, 
    color: "from-cyan-400 to-blue-600",
    unlocked: false,
    rarity: "legendary",
    requirement: "Hold 100 days"
  },
  big_earner: { 
    label: "Big Earner", 
    description: "Earn 1000+ tokens from mining", 
    icon: Coins, 
    color: "from-yellow-600 to-amber-600",
    unlocked: false,
    rarity: "rare",
    requirement: "1000+ tokens"
  },
  social_butterfly: { 
    label: "Social Butterfly", 
    description: "Get 20 miners from referrals", 
    icon: Crown, 
    color: "from-pink-500 to-rose-500",
    unlocked: false,
    rarity: "epic",
    requirement: "20 referrals"
  },
  ultimate_miner: { 
    label: "Ultimate Miner", 
    description: "Master all mining techniques", 
    icon: Star, 
    color: "from-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
    unlocked: false,
    rarity: "legendary",
    requirement: "Complete all challenges"
  },
  weekend_warrior: { 
    label: "Weekend Warrior", 
    description: "Double rewards every weekend", 
    icon: Sword, 
    color: "from-green-600 to-teal-600",
    unlocked: false,
    rarity: "uncommon",
    requirement: "4 weekend bonuses"
  }
};

type RarityFilter = 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

function AchievementBadge({ badgeKey, badge, isUnlocked }: { 
  badgeKey: string; 
  badge: typeof achievementBadges[keyof typeof achievementBadges]; 
  isUnlocked: boolean 
}) {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    uncommon: 'from-green-500 to-emerald-600',
    rare: 'from-blue-500 to-purple-600',
    epic: 'from-purple-600 to-pink-600',
    legendary: 'from-yellow-500 to-orange-600'
  };

  const rarityBorder = {
    common: 'border-gray-500/50',
    uncommon: 'border-green-500/50',
    rare: 'border-blue-500/50',
    epic: 'border-purple-500/50',
    legendary: 'border-yellow-500/50'
  };
  
  return (
    <div className={`relative group ${isUnlocked ? 'animate-pulse-glow' : ''}`} data-testid={`badge-${badgeKey}`}>
      <div className={`
        relative overflow-hidden rounded-xl border-2 transition-all duration-500 hover:scale-110 hover:rotate-3 p-5 text-center space-y-3
        ${isUnlocked 
          ? `${rarityBorder[badge.rarity as keyof typeof rarityBorder]} bg-gradient-to-br from-white/15 to-white/5 shadow-xl backdrop-blur-lg` 
          : 'border-white/10 bg-white/5 grayscale opacity-60 hover:opacity-80'
        }
      `}>
        {/* Rarity background effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} ${isUnlocked ? 'opacity-20' : 'opacity-5'} transition-opacity duration-500`}></div>
        
        {/* Animated particles for unlocked badges */}
        {isUnlocked && (
          <>
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-3 left-3 w-1 h-1 bg-neon-green rounded-full animate-pulse"></div>
          </>
        )}
        
        {/* Badge icon */}
        <div className={`relative w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} ${isUnlocked ? 'opacity-100 shadow-lg' : 'opacity-40'} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
          <badge.icon className="w-8 h-8 text-white" />
          {isUnlocked ? (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center">
              <Unlock className="w-3 h-3 text-black" />
            </div>
          ) : (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
              <Lock className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        {/* Badge info */}
        <div className="relative space-y-2">
          <h4 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
            {badge.label}
          </h4>
          <p className={`text-xs ${isUnlocked ? 'text-white/80' : 'text-white/40'}`}>
            {badge.description}
          </p>
          
          {/* Show requirement for locked badges */}
          {!isUnlocked && (
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 mt-2">
              <p className="text-xs text-mining-orange font-medium">
                Goal: {badge.requirement}
              </p>
            </div>
          )}
          
          <Badge className={`bg-gradient-to-r ${rarityColors[badge.rarity as keyof typeof rarityColors]} text-white border-none text-xs font-bold px-2 py-1`}>
            {badge.rarity.toUpperCase()}
          </Badge>
        </div>
        
        {/* Unlock animation overlay */}
        {isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500"></div>
        )}
      </div>
    </div>
  );
}

export default function Achievements() {
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const unlockedAchievements = ['first_mine', 'mining_streak_7', 'referral_master'];
  
  const filteredAchievements = Object.entries(achievementBadges).filter(([key, badge]) => {
    if (rarityFilter === 'all') return true;
    return badge.rarity === rarityFilter;
  });

  const totalAchievements = Object.keys(achievementBadges).length;
  const progressPercentage = (unlockedAchievements.length / totalAchievements) * 100;

  const rarityStats = {
    common: Object.values(achievementBadges).filter(b => b.rarity === 'common').length,
    uncommon: Object.values(achievementBadges).filter(b => b.rarity === 'uncommon').length,
    rare: Object.values(achievementBadges).filter(b => b.rarity === 'rare').length,
    epic: Object.values(achievementBadges).filter(b => b.rarity === 'epic').length,
    legendary: Object.values(achievementBadges).filter(b => b.rarity === 'legendary').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent">
            Achievement Gallery
          </h1>
          <p className="text-white/70 text-lg mt-2">
            Showcase your mining mastery and collect rare achievements
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-neon-green to-emerald-600 text-white border-none px-4 py-2 text-lg font-bold">
          {unlockedAchievements.length}/{totalAchievements}
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 rounded-full bg-gradient-to-r from-mining-orange to-yellow-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span>Achievement Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Overall Progress</span>
            <span className="text-neon-green font-bold text-xl">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          
          {/* Rarity breakdown */}
          <div className="grid grid-cols-5 gap-4 mt-4">
            {Object.entries(rarityStats).map(([rarity, count]) => (
              <div key={rarity} className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-white/60 capitalize">{rarity}</p>
                <p className="text-lg font-bold text-white">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-white/60" />
        <span className="text-white/60 font-medium">Filter by rarity:</span>
        {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => (
          <Button
            key={rarity}
            variant={rarityFilter === rarity ? "default" : "ghost"}
            size="sm"
            onClick={() => setRarityFilter(rarity as RarityFilter)}
            className={`capitalize ${
              rarityFilter === rarity 
                ? 'bg-neon-purple text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {rarity}
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map(([key, badge]) => (
          <AchievementBadge 
            key={key} 
            badgeKey={key}
            badge={badge} 
            isUnlocked={unlockedAchievements.includes(key)} 
          />
        ))}
      </div>

      {/* Next Achievement Hint */}
      <Card className="border border-white/10 bg-gradient-to-r from-neon-purple/10 to-neon-green/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span>Next Achievement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Mining Legend</p>
              <p className="text-white/60 text-sm">Keep your mining streak going! You're 15 days away from unlocking this rare achievement.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}