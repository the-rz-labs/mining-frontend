import { useState } from "react";
import { 
  Settings, 
  LogOut, 
  Zap,
  Flame,
  Coins,
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
  Crown,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AvatarSelection, getRandomAvatar } from "@/components/AvatarSelection";

const BASE_URL = "https://coinmaining.game";

// Profile data
const mockMinerProfile = {
  id: "1",
  username: "CryptoMiner_Pro",
  email: "admin@gmail.com",
  miningPower: 2847.5,
  hashRate: "4.2 TH/s",
  totalMiners: 3,
  referralCount: 7,
  dailyEarnings: 142.3,
  weeklyEarnings: 987.4,
  totalEarnings: 14250.75,
  efficiency: 94.7
};

// Visual achievement badges
const visualBadges = [
  { 
    id: "pioneer",
    title: "Mining Pioneer", 
    icon: Zap, 
    gradient: "from-blue-400 via-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/50",
    description: "First mining session completed"
  },
  { 
    id: "flame",
    title: "Fire Streak", 
    icon: Flame, 
    gradient: "from-orange-400 via-red-500 to-pink-500",
    shadowColor: "shadow-orange-500/50",
    description: "7-day mining streak achieved"
  },
  { 
    id: "community",
    title: "Community Leader", 
    icon: Users, 
    gradient: "from-purple-400 via-pink-500 to-rose-500",
    shadowColor: "shadow-purple-500/50",
    description: "5+ referrals completed"
  },
  { 
    id: "diamond",
    title: "Diamond Hands", 
    icon: Diamond, 
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    shadowColor: "shadow-cyan-500/50",
    description: "Elite mining status"
  },
  { 
    id: "rocket",
    title: "Power Boost", 
    icon: Rocket, 
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    shadowColor: "shadow-yellow-500/50",
    description: "Maximum efficiency reached"
  },
  { 
    id: "crown",
    title: "Mining Royalty", 
    icon: Crown, 
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    shadowColor: "shadow-amber-500/50",
    description: "Top tier achievement"
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
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Modern Profile Header */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Left Section - Avatar & Info */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-white/20">
                <AvatarImage src={selectedAvatar || ""} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-xl font-bold">
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                size="icon"
                variant="ghost"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 rounded-full"
                onClick={() => setShowAvatarEdit(!showAvatarEdit)}
                data-testid="button-edit-avatar"
              >
                <Camera className="w-3 h-3 text-white" />
              </Button>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-white" data-testid="text-username">
                  {profile.username}
                </h1>
                <Button size="icon" variant="ghost" className="w-6 h-6 text-white/60 hover:text-white hover:bg-white/10">
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-white/60 text-sm">{profile.email}</p>
            </div>
          </div>
          
          {/* Right Section - Actions */}
          <div className="flex gap-3 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Visual Badges Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {visualBadges.map((badge, index) => (
            <div key={badge.id} className="group relative">
              {/* Badge Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6 text-center hover:scale-105 transition-all duration-500 hover:border-white/20">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center ${badge.shadowColor} shadow-2xl group-hover:shadow-3xl transition-all duration-500`}>
                  <badge.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-white font-bold text-sm mb-2 relative">{badge.title}</h3>
                
                {/* Sparkle Effect */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                  {badge.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mining Power */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-mining-orange to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{profile.miningPower.toFixed(1)}</p>
              <p className="text-white/60 text-sm font-medium">Mining Power</p>
              <p className="text-mining-orange text-xs font-medium mt-1">{profile.hashRate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Miners */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-neon-purple to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1" data-testid="text-total-miners">{profile.totalMiners}</p>
              <p className="text-white/60 text-sm font-medium">Active Miners</p>
              <p className="text-neon-purple text-xs font-medium mt-1">All Online</p>
            </div>
          </CardContent>
        </Card>

        {/* Referrals */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1" data-testid="text-referral-count">{profile.referralCount}</p>
              <p className="text-white/60 text-sm font-medium">Referrals</p>
              <p className="text-blue-400 text-xs font-medium mt-1">Network Growing</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Earnings */}
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{profile.dailyEarnings}</p>
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