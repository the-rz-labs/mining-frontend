import { useState } from "react";
import { 
  User, 
  Trophy, 
  Star, 
  Settings, 
  LogOut, 
  Zap,
  Award,
  Crown,
  Calendar,
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
  TrendingUp,
  Edit3,
  Camera,
  Activity,
  Wallet,
  Users
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
  rank: "Diamond Miner",
  totalMiners: 3 // Changed from totalMines to totalMiners
};

// Earned achievement badges only (unlocked ones)
const earnedBadges = [
  { 
    label: "Mining Pioneer", 
    icon: Zap, 
    color: "from-blue-500 to-cyan-500",
    rarity: "common"
  },
  { 
    label: "Consistent Miner", 
    icon: Flame, 
    color: "from-orange-500 to-red-500",
    rarity: "uncommon"
  },
  { 
    label: "Community Builder", 
    icon: Users, 
    color: "from-mining-orange to-orange-500",
    rarity: "uncommon",
    customImage: BASE_URL + "/images/5ref.png"
  }
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Hero Profile Section */}
      <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-mining-orange/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-neon-purple/30 to-transparent opacity-50 blur-3xl"></div>
        
        <CardContent className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Profile Info Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:flex-1">
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-gradient-to-r from-neon-purple to-mining-orange shadow-2xl">
                  <AvatarImage src={selectedAvatar || ""} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-mining-orange/30 text-white text-3xl font-bold">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Avatar Edit Button */}
                <Button 
                  size="icon"
                  variant="ghost"
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  onClick={() => setShowAvatarEdit(!showAvatarEdit)}
                  data-testid="button-edit-avatar"
                >
                  <Camera className="w-5 h-5 text-white" />
                </Button>
              </div>
              
              {/* User Details */}
              <div className="space-y-4 text-center sm:text-left flex-1">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-neon-purple via-purple-400 to-mining-orange bg-clip-text text-transparent" data-testid="text-username">
                      {profile.username}
                    </h1>
                    <Button size="icon" variant="ghost" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
                      <Edit3 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-white/70 text-lg mb-4">{profile.email}</p>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
                      <Crown className="w-4 h-4 mr-2" />
                      {profile.rank}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-mining-orange to-orange-600 text-white border-none px-4 py-2 text-sm font-medium hover:scale-105 transition-transform">
                      <Flame className="w-4 h-4 mr-2" />
                      {profile.miningStreak} day streak
                    </Badge>
                  </div>
                </div>
                
                {/* Earned Badges Display */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-neon-purple" />
                    Earned Badges
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    {earnedBadges.map((badge, index) => (
                      <div key={index} className="relative group">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg">
                          {badge.customImage ? (
                            <img 
                              src={badge.customImage} 
                              alt={badge.label} 
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          ) : (
                            <badge.icon className="w-8 h-8 text-white" />
                          )}
                          
                          {/* Unlock indicator */}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center">
                            <Unlock className="w-3 h-3 text-black" />
                          </div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <div className="bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                            {badge.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:items-end">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-mining-orange/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mining-orange to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{profile.totalMined.toFixed(1)}</p>
              <p className="text-white/60 text-sm font-medium">Total Mined</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-neon-purple/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neon-purple to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-total-miners">{profile.totalMiners}</p>
              <p className="text-white/60 text-sm font-medium">Total Miners</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-blue-500/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1" data-testid="text-referral-count">{profile.referralCount}</p>
              <p className="text-white/60 text-sm font-medium">Referrals</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-yellow-500/30 hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{earnedBadges.length}</p>
              <p className="text-white/60 text-sm font-medium">Badges Earned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Card */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-neon-purple to-purple-500">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">Earnings Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-medium">Total Earnings</span>
                <span className="text-3xl font-bold text-neon-purple">{profile.totalEarnings} MGC</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className="bg-gradient-to-r from-neon-purple to-purple-500 h-3 rounded-full transition-all duration-1000" style={{width: '68%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mining Time Card */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-mining-orange to-orange-500">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">Mining Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-medium">Active Mining Time</span>
                <span className="text-3xl font-bold text-mining-orange">{profile.miningTime}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div className="bg-gradient-to-r from-mining-orange to-orange-500 h-3 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
              </div>
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