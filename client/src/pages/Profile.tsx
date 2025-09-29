import { useState } from "react";
import { 
  Settings, 
  LogOut, 
  Zap,
  Flame,
  Coins,
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
  totalMiners: 3,
  referralCount: 7,
  dailyEarnings: 142.3
};

// Circular achievement badges (GitHub style)
const circularBadges = [
  { 
    id: "pioneer",
    title: "Mining Pioneer", 
    icon: Zap, 
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-400/50",
    earned: true
  },
  { 
    id: "streak",
    title: "Fire Streak", 
    icon: Flame, 
    color: "from-orange-400 to-red-600",
    bgColor: "bg-orange-500/20", 
    borderColor: "border-orange-400/50",
    earned: true
  },
  { 
    id: "community",
    title: "Team Builder", 
    icon: Users, 
    color: "from-purple-400 to-pink-600",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-400/50",
    earned: true
  },
  { 
    id: "rocket",
    title: "Power Boost", 
    icon: Rocket, 
    color: "from-green-400 to-emerald-600",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-400/50",
    earned: true
  },
  { 
    id: "diamond",
    title: "Diamond Elite", 
    icon: Diamond, 
    color: "from-cyan-400 to-blue-600",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-400/50",
    earned: false
  },
  { 
    id: "crown",
    title: "Master Miner", 
    icon: Crown, 
    color: "from-yellow-400 to-orange-600",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-400/50",
    earned: false
  },
  { 
    id: "shield",
    title: "Security Pro", 
    icon: Shield, 
    color: "from-indigo-400 to-purple-600",
    bgColor: "bg-indigo-500/20",
    borderColor: "border-indigo-400/50",
    earned: true
  },
  { 
    id: "target",
    title: "Goal Crusher", 
    icon: Target, 
    color: "from-pink-400 to-rose-600",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-400/50",
    earned: true
  }
];

// Stats data
const stats = [
  {
    title: "Mining Power",
    value: "2,847.5",
    subtitle: "TH/s",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    progress: 85
  },
  {
    title: "Active Miners", 
    value: "3",
    subtitle: "All Online",
    icon: Activity,
    color: "from-purple-500 to-pink-500",
    progress: 100
  },
  {
    title: "Referrals",
    value: "7",
    subtitle: "Growing",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    progress: 70
  },
  {
    title: "Daily Earnings",
    value: "142.3",
    subtitle: "MGC + RZ",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    progress: 92
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
    <div className="max-w-6xl mx-auto space-y-12 p-6">
      
      {/* Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Avatar on left */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
              <AvatarImage src={selectedAvatar || ""} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-3xl font-bold">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button 
              size="icon"
              variant="ghost"
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 rounded-full"
              onClick={() => setShowAvatarEdit(!showAvatarEdit)}
              data-testid="button-edit-avatar"
            >
              <Camera className="w-5 h-5 text-white" />
            </Button>
          </div>
          
          {/* Profile Info on right */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white" data-testid="text-username">
                {profile.username}
              </h1>
              <Button size="icon" variant="ghost" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10">
                <Edit3 className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-white/60 text-lg">{profile.email}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* GitHub-style Circular Badges */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Achievements</h2>
          <p className="text-white/60">Earned {circularBadges.filter(b => b.earned).length} of {circularBadges.length} badges</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {circularBadges.map((badge) => (
            <div key={badge.id} className="relative group">
              {/* Circular Badge */}
              <div className={`
                w-20 h-20 rounded-full border-2 ${badge.borderColor} ${badge.bgColor}
                flex items-center justify-center cursor-pointer
                transition-all duration-300 hover:scale-110
                ${badge.earned ? 'opacity-100' : 'opacity-40 grayscale'}
              `}>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                  {badge.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/60 text-sm">{stat.progress}%</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.title}</p>
                  <p className="text-white/40 text-xs">{stat.subtitle}</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                    style={{width: `${stat.progress}%`}}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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