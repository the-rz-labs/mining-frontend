import { useState } from "react";
import { 
  User, 
  Trophy, 
  Star, 
  Settings, 
  LogOut, 
  Zap,
  Crown,
  Flame,
  Coins,
  Timer,
  Sparkles,
  Medal,
  Rocket,
  Diamond,
  Edit3,
  Camera,
  Activity,
  Users,
  TrendingUp,
  Shield,
  Target,
  Award,
  ChevronRight,
  Gamepad2,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AvatarSelection, getRandomAvatar } from "@/components/AvatarSelection";

const BASE_URL = "https://coinmaining.game";

// Enhanced miner profile data
const mockMinerProfile = {
  id: "1",
  username: "CryptoMiner_Pro",
  email: "admin@gmail.com",
  level: 47,
  xp: 12840,
  xpToNext: 15000,
  miningPower: 2847.5,
  hashRate: "4.2 TH/s",
  efficiency: 94.7,
  rank: "Diamond Miner",
  miningStreak: 15,
  totalMiners: 3,
  referralCount: 7,
  dailyEarnings: 142.3,
  weeklyEarnings: 987.4,
  totalEarnings: 14250.75,
  joinDate: "2024-03-15",
  nextReward: "2h 34m",
  powerLevel: 8750
};

// Achievement badges (earned ones)
const earnedBadges = [
  { 
    id: "pioneer",
    label: "Mining Pioneer", 
    icon: Zap, 
    color: "from-blue-500 to-cyan-500",
    rarity: "common",
    points: 100
  },
  { 
    id: "consistent",
    label: "Consistent Miner", 
    icon: Flame, 
    color: "from-orange-500 to-red-500",
    rarity: "uncommon",
    points: 250
  },
  { 
    id: "builder",
    label: "Community Builder", 
    icon: Users, 
    color: "from-mining-orange to-orange-500",
    rarity: "rare",
    customImage: BASE_URL + "/images/5ref.png",
    points: 500
  },
  { 
    id: "legend",
    label: "Mining Legend", 
    icon: Crown, 
    color: "from-purple-500 to-pink-500",
    rarity: "epic",
    points: 1000
  }
];

// Recent activities
const recentActivities = [
  { type: "mining", icon: Zap, text: "Started MGC mining", time: "2 minutes ago", color: "text-neon-purple" },
  { type: "earning", icon: Coins, text: "Earned 45.2 MGC", time: "1 hour ago", color: "text-mining-orange" },
  { type: "achievement", icon: Trophy, text: "Unlocked Mining Legend", time: "3 hours ago", color: "text-yellow-400" },
  { type: "referral", icon: Users, text: "New referral joined", time: "5 hours ago", color: "text-blue-400" }
];

export default function Profile() {
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
  const levelProgress = (profile.xp / profile.xpToNext) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Main Hero Dashboard */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl shadow-2xl">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-mining-orange/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-neon-purple/30 to-transparent opacity-50 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-mining-orange/20 to-transparent opacity-30 blur-2xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-20 w-2 h-2 bg-neon-purple rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-mining-orange rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-32 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        
        <div className="relative p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-neon-purple via-mining-orange to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse transition duration-1000"></div>
                  <Avatar className="relative w-32 h-32 border-4 border-white/20 shadow-2xl">
                    <AvatarImage src={selectedAvatar || ""} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-neon-purple/50 to-mining-orange/50 text-white text-3xl font-bold">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Level badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full border-2 border-white shadow-lg">
                    LVL {profile.level}
                  </div>
                  
                  {/* Edit button */}
                  <Button 
                    size="icon"
                    variant="ghost"
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 rounded-full"
                    onClick={() => setShowAvatarEdit(!showAvatarEdit)}
                    data-testid="button-edit-avatar"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </Button>
                </div>
                
                {/* User Info */}
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-neon-purple via-white to-mining-orange bg-clip-text text-transparent" data-testid="text-username">
                        {profile.username}
                      </h1>
                      <Button size="icon" variant="ghost" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-white/70 text-lg mb-4">{profile.email}</p>
                    
                    {/* Level Progress */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Level {profile.level}</span>
                        <span className="text-white/60">{profile.xp.toLocaleString()} / {profile.xpToNext.toLocaleString()} XP</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-3 bg-gradient-to-r from-neon-purple via-purple-400 to-mining-orange rounded-full transition-all duration-1000 relative"
                          style={{width: `${levelProgress}%`}}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
                        <Crown className="w-4 h-4 mr-2" />
                        {profile.rank}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-mining-orange to-orange-600 text-white border-none px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
                        <Flame className="w-4 h-4 mr-2" />
                        {profile.miningStreak} day streak
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
                        <Activity className="w-4 h-4 mr-2" />
                        {profile.efficiency}% efficiency
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Achievement Showcase */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Trophy className="w-7 h-7 text-neon-purple" />
                    Elite Achievements
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                      {earnedBadges.reduce((sum, badge) => sum + badge.points, 0)} pts
                    </Badge>
                  </h3>
                  <Button variant="ghost" className="text-neon-purple hover:text-white hover:bg-white/10">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {earnedBadges.map((badge) => (
                    <div key={badge.id} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple/50 to-mining-orange/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                      <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300">
                        {badge.customImage ? (
                          <img 
                            src={badge.customImage} 
                            alt={badge.label} 
                            className="w-12 h-12 mx-auto mb-3 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-purple to-purple-500 rounded-xl flex items-center justify-center">
                            <badge.icon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <h4 className="text-white font-bold text-sm mb-1">{badge.label}</h4>
                        <Badge className={`bg-gradient-to-r ${badge.color} text-white border-none text-xs`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Stats & Actions */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 justify-start"
                  data-testid="button-settings"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 justify-start"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </div>
              
              {/* Power Level */}
              <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neon-purple to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden">
                      <Rocket className="w-10 h-10 text-white z-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">{profile.powerLevel.toLocaleString()}</p>
                      <p className="text-white/60 text-sm font-medium">Mining Power</p>
                    </div>
                    <div className="text-sm text-mining-orange font-medium">
                      Next reward in {profile.nextReward}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-purple" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center">
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{activity.text}</p>
                        <p className="text-white/50 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mining Power */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-mining-orange/30 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-mining-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center space-y-4 relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mining-orange to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{profile.miningPower.toFixed(1)}</p>
              <p className="text-white/60 text-sm font-medium">Mining Power</p>
              <p className="text-mining-orange text-xs font-medium mt-1">{profile.hashRate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Miners */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-neon-purple/30 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center space-y-4 relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neon-purple to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-total-miners">{profile.totalMiners}</p>
              <p className="text-white/60 text-sm font-medium">Active Miners</p>
              <p className="text-neon-purple text-xs font-medium mt-1">All Online</p>
            </div>
          </CardContent>
        </Card>

        {/* Referrals */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-blue-500/30 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center space-y-4 relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-referral-count">{profile.referralCount}</p>
              <p className="text-white/60 text-sm font-medium">Referrals</p>
              <p className="text-blue-400 text-xs font-medium mt-1">+2 this week</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Earnings */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-yellow-500/30 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 text-center space-y-4 relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{profile.dailyEarnings}</p>
              <p className="text-white/60 text-sm font-medium">Daily Earnings</p>
              <p className="text-yellow-400 text-xs font-medium mt-1">MGC + RZ</p>
            </div>
          </CardContent>
        </Card>
      </div>

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