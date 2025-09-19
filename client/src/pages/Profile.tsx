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
  TrendingUp,
  Edit3,
  Camera,
  BarChart3,
  Activity,
  Wallet,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, UserBadge } from "@shared/schema";
import { useLocation } from "wouter";
import { AvatarSelection, getRandomAvatar } from "@/components/AvatarSelection";

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
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(getRandomAvatar());
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/sign-in");
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setShowAvatarEdit(false);
    toast({
      title: "Avatar Updated! ✨",
      description: "Your NFT avatar has been updated successfully.",
    });
  };

  const profile = mockMinerProfile;

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header Card */}
      <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/20 hover:shadow-neon-purple/30 transition-all duration-500 hover:border-white/20 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-green/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-neon-purple/20 to-transparent opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-radial from-neon-green/15 to-transparent opacity-30 blur-2xl"></div>
        
        <CardHeader className="relative space-y-6 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            {/* Left Section - Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-neon-purple to-neon-green shadow-lg shadow-neon-purple/30 transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src={selectedAvatar || ""} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white text-2xl font-bold">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {/* Avatar Edit Button */}
                <Button 
                  size="icon"
                  variant="ghost"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                  onClick={() => setShowAvatarEdit(!showAvatarEdit)}
                  data-testid="button-edit-avatar"
                >
                  <Camera className="w-4 h-4 text-white" />
                </Button>
                {/* Mining status badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-neon-green to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>MINING</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 text-center sm:text-left">
                <div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent" data-testid="text-username">
                      {profile.username}
                    </h2>
                    <Button size="icon" variant="ghost" className="w-6 h-6 text-white/60 hover:text-white hover:bg-white/10">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-white/60 text-sm mt-1">{profile.email}</p>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-3 py-1 hover:scale-105 transition-transform">
                    <Crown className="w-4 h-4 mr-1" />
                    {profile.rank}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-neon-green to-emerald-600 text-white border-none px-3 py-1 hover:scale-105 transition-transform">
                    <Flame className="w-4 h-4 mr-1" />
                    {profile.miningStreak} day streak
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Right Section - Action Buttons */}
            <div className="flex justify-center lg:justify-end space-x-2">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Mining Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-mining-orange/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-mining-orange to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{profile.totalMined.toFixed(1)}</p>
              <p className="text-white/60 text-sm">Total Mined</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-neon-purple/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neon-purple to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white" data-testid="text-referral-count">{profile.referralCount}</p>
              <p className="text-white/60 text-sm">Referrals</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-neon-green/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neon-green to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{profile.miningStreak}</p>
              <p className="text-white/60 text-sm">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-yellow-500/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-white/60 text-sm">Achievements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Earnings Overview */}
      <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 rounded-full bg-gradient-to-r from-neon-green to-emerald-500">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span>Earnings Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total Earnings</span>
                <span className="text-2xl font-bold text-neon-green">{profile.totalEarnings} MGC</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-neon-green to-emerald-500 h-2 rounded-full" style={{width: '68%'}}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Mining Time</span>
                <span className="text-2xl font-bold text-mining-orange">{profile.miningTime}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-mining-orange to-orange-500 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Selection Modal */}
      {showAvatarEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <AvatarSelection 
              selectedAvatar={selectedAvatar}
              onAvatarSelect={handleAvatarSelect}
            />
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAvatarEdit(false)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
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
  const isExpired = timeLeft === 0;
  const isUrgent = timeLeft < 3600000; // Less than 1 hour

  return (
    <Card className={`border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group ${
      claimed ? 'opacity-70 scale-95' : 'hover:border-white/30'
    } ${isUrgent && !claimed && !isExpired ? 'animate-pulse-glow' : ''}`}>
      
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${giveaway.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${giveaway.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
      
      {/* Urgency indicator */}
      {isUrgent && !claimed && !isExpired && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          URGENT
        </div>
      )}
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-3 rounded-full bg-gradient-to-r ${giveaway.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-white font-bold text-lg">{giveaway.title}</CardTitle>
              <CardDescription className="text-white/70 text-sm">{giveaway.description}</CardDescription>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${giveaway.gradient} text-white border-none font-medium px-3 py-1 text-xs`}>
            {giveaway.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Enhanced Reward Display */}
        <div className={`p-4 bg-gradient-to-r ${giveaway.gradient} bg-opacity-10 border border-white/10 rounded-lg text-center hover:bg-opacity-20 transition-all duration-300`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-white/80 text-sm font-medium">REWARD</span>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl font-bold text-white mb-1">{giveaway.reward}</p>
          <div className="flex justify-center">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">
              Exclusive
            </Badge>
          </div>
        </div>
        
        {/* Enhanced Timer */}
        <div className={`p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 ${
          isUrgent ? 'border-red-500/50 bg-red-500/10' : ''
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Timer className={`w-5 h-5 ${isUrgent ? 'text-red-400' : 'text-mining-orange'}`} />
              <span className="text-white/80 font-medium text-sm">
                {isExpired ? 'Expired' : 'Time Left'}
              </span>
            </div>
            <div className="text-right">
              <span className={`font-bold text-lg ${
                isExpired ? 'text-red-400' : isUrgent ? 'text-red-400' : 'text-mining-orange'
              }`}>
                {isExpired ? 'EXPIRED' : formatTimeRemaining(timeLeft)}
              </span>
              {isUrgent && !isExpired && (
                <p className="text-red-400 text-xs animate-pulse">Hurry!</p>
              )}
            </div>
          </div>
          
          {/* Progress bar for time */}
          {!isExpired && (
            <div className="mt-2 w-full bg-white/10 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-1000 ${
                  isUrgent ? 'bg-red-500' : `bg-gradient-to-r ${giveaway.gradient}`
                }`}
                style={{ width: `${Math.max((timeLeft / giveaway.timeLeft) * 100, 5)}%` }}
              ></div>
            </div>
          )}
        </div>
        
        {/* Enhanced Claim Button */}
        <Button 
          className={`w-full font-bold text-lg relative overflow-hidden group/btn ${
            claimed 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : isExpired
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : `bg-gradient-to-r ${giveaway.gradient} hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300`
          }`}
          onClick={handleClaim}
          disabled={claimed || isExpired}
          data-testid={`button-claim-${giveaway.id}`}
        >
          {/* Button animation effect */}
          {!claimed && !isExpired && (
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
          )}
          
          <div className="relative flex items-center justify-center space-x-2">
            {claimed ? (
              <>
                <Award className="w-5 h-5" />
                <span>Claimed Successfully!</span>
              </>
            ) : isExpired ? (
              <>
                <Timer className="w-5 h-5" />
                <span>Expired</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>Claim Reward</span>
              </>
            )}
          </div>
        </Button>

        {/* Claim Instructions */}
        {!claimed && !isExpired && (
          <div className="text-center">
            <p className="text-white/50 text-xs">
              Click to claim your reward instantly
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Status Overlays */}
      {claimed && (
        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2 shadow-lg animate-bounce">
          <Award className="w-5 h-5 text-white" />
        </div>
      )}
      
      {isExpired && !claimed && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-white">
            <Timer className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <p className="font-bold text-lg text-red-400">EXPIRED</p>
            <p className="text-sm text-white/70">Better luck next time!</p>
          </div>
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
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = {
    all: 'All Achievements',
    mining: 'Mining Mastery',
    social: 'Community',
    time: 'Time-Based',
    special: 'Special Events'
  };

  const getAchievementsByCategory = (category: string) => {
    if (category === 'all') return Object.entries(achievementBadges);
    
    const categoryMap: { [key: string]: string[] } = {
      mining: ['first_mine', 'mining_marathon', 'speed_demon', 'big_earner', 'ultimate_miner'],
      social: ['referral_master', 'social_butterfly'],
      time: ['mining_streak_7', 'mining_streak_30', 'weekend_warrior', 'diamond_hands'],
      special: ['treasure_hunter']
    };
    
    return Object.entries(achievementBadges).filter(([key]) => 
      categoryMap[category]?.includes(key)
    );
  };

  const filteredAchievements = getAchievementsByCategory(selectedCategory);

  return (
    <div className="space-y-6">
      {/* Achievement Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neon-green to-emerald-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
            <p className="text-white/60 text-sm">Unlocked</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-mining-orange to-orange-600 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{totalAchievements - unlockedAchievements.length}</p>
            <p className="text-white/60 text-sm">Remaining</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neon-purple to-purple-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{progressPercentage.toFixed(0)}%</p>
            <p className="text-white/60 text-sm">Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Achievement Gallery */}
      <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-mining-orange/10 to-transparent opacity-60 blur-3xl"></div>
        
        <CardHeader className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-3 text-white mb-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-mining-orange to-yellow-500">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Achievement Gallery</span>
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Showcase your mining mastery and collect rare achievements
              </CardDescription>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(categories).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={`${
                    selectedCategory === key 
                      ? 'bg-gradient-to-r from-neon-purple to-purple-600 text-white border-none' 
                      : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                  } transition-all duration-300`}
                  data-testid={`filter-${key}`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          {/* Enhanced Progress Bar */}
          <div className="p-6 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-xl backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Gamepad2 className="w-6 h-6 text-neon-purple" />
                <span className="text-white font-bold text-lg">Overall Progress</span>
              </div>
              <div className="text-right">
                <span className="text-neon-green font-bold text-xl">{progressPercentage.toFixed(0)}%</span>
                <p className="text-white/60 text-sm">{unlockedAchievements.length} of {totalAchievements}</p>
              </div>
            </div>
            
            <div className="relative h-6 bg-white/10 rounded-full overflow-hidden mb-4">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-green via-emerald-500 to-neon-green rounded-full transition-all duration-1000 shadow-lg shadow-neon-green/50 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(progressPercentage, 15)}%` }}
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 animate-shimmer"></div>
            </div>
            
            <div className="flex justify-between text-sm text-white/60">
              <span>Keep mining to unlock more achievements!</span>
              <span>{totalAchievements - unlockedAchievements.length} remaining to unlock</span>
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <Card className="border border-mining-orange/30 bg-gradient-to-r from-mining-orange/10 to-orange-600/10 backdrop-blur-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-mining-orange/20 rounded-full">
                  <Target className="w-5 h-5 text-mining-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Next Achievement Goal</h4>
                  <p className="text-white/70 text-sm">Complete a 30-day mining streak to unlock "Mining Legend" achievement!</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-mining-orange/20 text-mining-orange border-mining-orange/50">
                    Rare
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
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
        
        {/* Gaming Stats Bar - Mobile Responsive */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
          <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
            <Zap className="w-5 h-5 text-neon-purple" />
            <span className="text-white/80 font-medium text-sm">Mining Active</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-white/80 font-medium text-sm">Rewards Available</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-full border border-white/10">
            <Trophy className="w-5 h-5 text-mining-orange" />
            <span className="text-white/80 font-medium text-sm">Achievements Earned</span>
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