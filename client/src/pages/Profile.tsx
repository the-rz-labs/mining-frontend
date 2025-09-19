import { useState, useEffect } from "react";
import { 
  User, 
  Trophy, 
  Star, 
  Settings, 
  LogOut, 
  Zap,
  Award,
  Crown,
  Target,
  Calendar,
  Lock,
  Unlock,
  Gift,
  Flame,
  Gem,
  Coins,
  Timer,
  ChevronRight,
  Sparkles,
  Medal,
  Shield,
  Sword,
  Rocket,
  Diamond,
  Gamepad2,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, UserBadge } from "@shared/schema";
import { useLocation } from "wouter";

// Mining profile data
const mockMinerProfile = {
  id: "1",
  username: "CryptoMiner_Pro",
  email: "admin@gmail.com",
  miningStreak: 15,
  totalMined: 2847.5,
  referralCount: 7,
  totalEarnings: 1420.75,
  miningTime: "240h 15m",
  rank: "Diamond Miner"
};

// Giveaway system data
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
    claimed: false
  },
  {
    id: "weekend-special",
    title: "Weekend Mining Boost",
    description: "2x mining rewards for weekend warriors",
    reward: "Double Mining Rate",
    timeLeft: 172800000, // 48 hours
    type: "special",
    icon: Rocket,
    gradient: "from-neon-green to-emerald-500",
    claimed: false
  },
  {
    id: "treasure-hunt",
    title: "Weekly Treasure Hunt",
    description: "Complete 3 challenges to unlock the treasure",
    reward: "Mystery Chest",
    timeLeft: 432000000, // 5 days
    type: "event",
    icon: Crown,
    gradient: "from-mining-orange to-yellow-500",
    claimed: false
  }
];

// Achievement badges focused on mining goals
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

// Helper function to format time remaining
function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  return `${hours}h ${minutes}m`;
}

function MinerProfileHeader() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/sign-in");
  };

  const profile = mockMinerProfile;

  return (
    <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/20 hover:shadow-neon-purple/30 transition-all duration-500 hover:border-white/20 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-green/10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-neon-purple/20 to-transparent opacity-50 blur-3xl"></div>
      
      <CardHeader className="relative space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-gradient-to-r from-neon-purple to-neon-green shadow-lg shadow-neon-purple/30">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white text-2xl font-bold">
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Mining status badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-neon-green to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-white/20 shadow-lg animate-pulse">
                MINING
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent" data-testid="text-username">
                  {profile.username}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-3 py-1">
                    <Crown className="w-4 h-4 mr-1" />
                    {profile.rank}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-neon-green to-emerald-600 text-white border-none px-3 py-1">
                    <Flame className="w-4 h-4 mr-1" />
                    {profile.miningStreak} day streak
                  </Badge>
                </div>
              </div>
              
              {/* Mining Progress Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gradient-to-r from-neon-purple/20 to-purple-600/20 rounded-lg border border-purple-500/30">
                  <p className="text-xl font-bold text-neon-purple">{profile.totalEarnings}</p>
                  <p className="text-white/70 text-sm">Total Earnings (MGC)</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-mining-orange/20 to-orange-600/20 rounded-lg border border-orange-500/30">
                  <p className="text-xl font-bold text-mining-orange">{profile.miningTime}</p>
                  <p className="text-white/70 text-sm">Mining Time</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10" data-testid="button-settings">
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/60 hover:text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mining Stats Grid */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="space-y-2 p-4 bg-gradient-to-b from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-neon-green/30 transition-all duration-300 hover:scale-105">
            <Coins className="w-8 h-8 text-mining-orange mx-auto" />
            <p className="text-2xl font-bold text-white">{profile.totalMined.toFixed(1)}</p>
            <p className="text-white/60 text-sm">Total Mined</p>
          </div>
          <div className="space-y-2 p-4 bg-gradient-to-b from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-neon-purple/30 transition-all duration-300 hover:scale-105">
            <User className="w-8 h-8 text-neon-purple mx-auto" />
            <p className="text-2xl font-bold text-white" data-testid="text-referral-count">{profile.referralCount}</p>
            <p className="text-white/60 text-sm">Referrals</p>
          </div>
          <div className="space-y-2 p-4 bg-gradient-to-b from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-neon-green/30 transition-all duration-300 hover:scale-105">
            <Flame className="w-8 h-8 text-neon-green mx-auto" />
            <p className="text-2xl font-bold text-white">{profile.miningStreak}</p>
            <p className="text-white/60 text-sm">Day Streak</p>
          </div>
          <div className="space-y-2 p-4 bg-gradient-to-b from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-white/60 text-sm">Achievements</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function GiveawayCard({ giveaway }: { giveaway: typeof activeGiveaways[0] }) {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(giveaway.timeLeft);
  const [claimed, setClaimed] = useState(giveaway.claimed);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    toast({
      title: "Reward Claimed! 🎉",
      description: `You've claimed: ${giveaway.reward}`,
    });
  };

  const IconComponent = giveaway.icon;

  return (
    <Card className={`border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden group ${
      claimed ? 'opacity-60' : 'hover:border-white/30'
    }`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${giveaway.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${giveaway.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full bg-gradient-to-r ${giveaway.gradient} shadow-lg`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white font-bold">{giveaway.title}</CardTitle>
              <CardDescription className="text-white/70">{giveaway.description}</CardDescription>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${giveaway.gradient} text-white border-none font-medium`}>
            {giveaway.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Reward Display */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">{giveaway.reward}</p>
          <p className="text-white/60 text-sm">Reward</p>
        </div>
        
        {/* Timer */}
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-mining-orange" />
            <span className="text-white/80 font-medium">Time Remaining</span>
          </div>
          <span className="text-mining-orange font-bold text-lg">{formatTimeRemaining(timeLeft)}</span>
        </div>
        
        {/* Claim Button */}
        <Button 
          className={`w-full font-bold text-lg ${
            claimed 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : `bg-gradient-to-r ${giveaway.gradient} hover:scale-105 shadow-lg hover:shadow-xl`
          }`}
          onClick={handleClaim}
          disabled={claimed || timeLeft === 0}
          data-testid={`button-claim-${giveaway.id}`}
        >
          {claimed ? (
            <>
              <Award className="w-5 h-5 mr-2" />
              Claimed!
            </>
          ) : timeLeft === 0 ? (
            'Expired'
          ) : (
            <>
              <Gift className="w-5 h-5 mr-2" />
              Claim Reward
            </>
          )}
        </Button>
      </CardContent>
      
      {/* Claimed overlay */}
      {claimed && (
        <div className="absolute top-4 right-4">
          <Award className="w-8 h-8 text-yellow-400" />
        </div>
      )}
    </Card>
  );
}

function ActiveGiveaways() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Gift className="w-6 h-6 text-neon-green" />
          <span>Active Giveaways</span>
          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50 ml-2">
            {activeGiveaways.length} Live
          </Badge>
        </CardTitle>
        <CardDescription className="text-white/60">
          Don't miss out! Claim your rewards before they expire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {activeGiveaways.map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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

function AchievementsShowcase() {
  const unlockedAchievements = ['first_mine', 'mining_streak_7', 'referral_master'];
  const totalAchievements = Object.keys(achievementBadges).length;
  const progressPercentage = (unlockedAchievements.length / totalAchievements) * 100;

  return (
    <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 rounded-full bg-gradient-to-r from-mining-orange to-yellow-500">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Achievement Gallery</span>
          </CardTitle>
          <Badge className="bg-gradient-to-r from-neon-green to-emerald-600 text-white border-none px-4 py-2 text-lg font-bold">
            {unlockedAchievements.length}/{totalAchievements}
          </Badge>
        </div>
        <CardDescription className="text-white/70 text-lg">
          Showcase your mining mastery and collect rare achievements
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(achievementBadges).map(([key, badge]) => (
            <AchievementBadge 
              key={key} 
              badgeKey={key}
              badge={badge} 
              isUnlocked={unlockedAchievements.includes(key)} 
            />
          ))}
        </div>
        
        {/* Progress Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-xl backdrop-blur-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="w-6 h-6 text-neon-purple" />
              <span className="text-white font-bold text-lg">Achievement Progress</span>
            </div>
            <span className="text-neon-green font-bold text-xl">{progressPercentage.toFixed(0)}%</span>
          </div>
          
          <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-green via-emerald-500 to-neon-green rounded-full transition-all duration-1000 shadow-lg shadow-neon-green/50"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-pulse"></div>
          </div>
          
          <div className="flex justify-between text-sm text-white/60">
            <span>Keep mining to unlock more achievements!</span>
            <span>{totalAchievements - unlockedAchievements.length} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto relative">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-green rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-mining-orange rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-60 right-40 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-30"></div>
      </div>

      {/* Gaming Header */}
      <div className="relative space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent animate-gradient">
            Miner's Hub
          </h1>
          <p className="text-white/70 text-xl">
            Unlock achievements, claim rewards, and become a mining legend!
          </p>
        </div>
        
        {/* Gaming Stats Bar */}
        <div className="flex items-center justify-center space-x-8 text-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-neon-purple" />
            <span className="text-white/80 font-medium">Mining Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-white/80 font-medium">Rewards Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-mining-orange" />
            <span className="text-white/80 font-medium">Achievements Earned</span>
          </div>
        </div>
      </div>

      {/* Miner Profile Header */}
      <MinerProfileHeader />
      
      {/* Active Giveaways Section - Main Focus */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-green to-emerald-400 bg-clip-text text-transparent">
            🎁 Active Giveaways & Rewards
          </h2>
          <p className="text-white/70 text-lg">
            Don't miss out on these limited-time rewards!
          </p>
        </div>
        <ActiveGiveaways />
      </div>
      
      {/* Achievement Showcase */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-mining-orange to-yellow-400 bg-clip-text text-transparent">
            🏆 Achievement Gallery
          </h2>
          <p className="text-white/70 text-lg">
            Show off your mining mastery with rare collectible badges
          </p>
        </div>
        <AchievementsShowcase />
      </div>

      {/* Gaming Footer */}
      <div className="mt-12 p-6 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl text-center backdrop-blur-lg">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Rocket className="w-8 h-8 text-neon-green" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Keep Mining, Keep Winning!
          </h3>
          <Gem className="w-8 h-8 text-mining-orange" />
        </div>
        <p className="text-white/70 text-lg">
          The more you mine, the more rewards you unlock. Complete challenges and become a mining legend!
        </p>
        <div className="flex items-center justify-center space-x-6 mt-6">
          <Badge className="bg-gradient-to-r from-neon-purple to-pink-500 text-white border-none px-4 py-2 text-lg">
            <Star className="w-4 h-4 mr-2" />
            Epic Rewards
          </Badge>
          <Badge className="bg-gradient-to-r from-neon-green to-emerald-500 text-white border-none px-4 py-2 text-lg">
            <Diamond className="w-4 h-4 mr-2" />
            Rare Achievements
          </Badge>
          <Badge className="bg-gradient-to-r from-mining-orange to-yellow-500 text-white border-none px-4 py-2 text-lg">
            <Crown className="w-4 h-4 mr-2" />
            Legend Status
          </Badge>
        </div>
      </div>
    </div>
  );
}