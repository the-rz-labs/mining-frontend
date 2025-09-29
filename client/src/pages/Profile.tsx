import { useState } from "react";
import { 
  Settings, 
  LogOut, 
  Zap,
  Flame,
  Coins,
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
  Star,
  CheckCircle,
  Lock,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AvatarSelection, getRandomAvatar } from "@/components/AvatarSelection";

const BASE_URL = "https://coinmaining.game";

// Profile data
const mockMinerProfile = {
  id: "1",
  username: "CryptoMiner_Pro",
  email: "admin@gmail.com",
  level: 47,
  currentXP: 12840,
  nextLevelXP: 15000,
  miningPower: 2847.5,
  totalMiners: 3,
  referralCount: 7,
  dailyEarnings: 142.3,
  completedChallenges: 12,
  totalChallenges: 20
};

// Gamified achievements with progress
const achievements = [
  { 
    id: "first_mine",
    title: "First Steps", 
    description: "Complete your first mining session",
    icon: Zap, 
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    borderColor: "border-blue-400/30",
    completed: true,
    progress: 100,
    xpReward: 100
  },
  { 
    id: "streak_7",
    title: "Week Warrior", 
    description: "Mine for 7 consecutive days",
    icon: Flame, 
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    borderColor: "border-orange-400/30",
    completed: true,
    progress: 100,
    xpReward: 250
  },
  { 
    id: "community",
    title: "Team Builder", 
    description: "Invite 5 friends to join",
    icon: Users, 
    color: "bg-gradient-to-br from-purple-500 to-pink-600",
    borderColor: "border-purple-400/30",
    completed: true,
    progress: 100,
    xpReward: 500
  },
  { 
    id: "power_house",
    title: "Power House", 
    description: "Reach 5000+ mining power",
    icon: Rocket, 
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    borderColor: "border-green-400/30",
    completed: false,
    progress: 57,
    xpReward: 750
  },
  { 
    id: "diamond_tier",
    title: "Diamond Elite", 
    description: "Achieve diamond status",
    icon: Diamond, 
    color: "bg-gradient-to-br from-cyan-500 to-blue-600",
    borderColor: "border-cyan-400/30",
    completed: false,
    progress: 23,
    xpReward: 1000
  },
  { 
    id: "master_miner",
    title: "Master Miner", 
    description: "Complete all mining challenges",
    icon: Crown, 
    color: "bg-gradient-to-br from-yellow-500 to-orange-600",
    borderColor: "border-yellow-400/30",
    completed: false,
    progress: 60,
    xpReward: 2000
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
  const levelProgress = (profile.currentXP / profile.nextLevelXP) * 100;
  const completedAchievements = achievements.filter(a => a.completed).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Clean Profile Header */}
      <Card className="border-0 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-white/20">
                  <AvatarImage src={selectedAvatar || ""} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <Button 
                  size="icon"
                  variant="ghost"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 rounded-full"
                  onClick={() => setShowAvatarEdit(!showAvatarEdit)}
                  data-testid="button-edit-avatar"
                >
                  <Camera className="w-3 h-3 text-white" />
                </Button>
              </div>
              
              <div>
                <h1 className="text-lg font-semibold text-white" data-testid="text-username">
                  {profile.username}
                </h1>
                <p className="text-white/60 text-sm">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
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
        </CardContent>
      </Card>

      {/* Level Progress Card */}
      <Card className="border-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Level {profile.level}</h2>
              <p className="text-white/60">{profile.currentXP.toLocaleString()} / {profile.nextLevelXP.toLocaleString()} XP</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-3 py-1">
              {Math.round(levelProgress)}% Complete
            </Badge>
          </div>
          <div className="w-full bg-white/10 rounded-full h-4 mb-2">
            <div 
              className="h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{width: `${levelProgress}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            {profile.nextLevelXP - profile.currentXP} XP to next level
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline" className="border-white/20 text-white/60">
                  {stat.progress}%
                </Badge>
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

      {/* Achievements Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
            <p className="text-white/60">{completedAchievements} of {achievements.length} completed</p>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-4 py-2">
            {Math.round((completedAchievements / achievements.length) * 100)}% Complete
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`border ${achievement.borderColor} bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group ${achievement.completed ? 'ring-2 ring-green-400/30' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl ${achievement.color} flex items-center justify-center group-hover:scale-110 transition-transform relative`}>
                    <achievement.icon className="w-7 h-7 text-white" />
                    {achievement.completed && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {!achievement.completed && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
                    <p className="text-white/60 text-sm">{achievement.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white/60">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 ${achievement.color} rounded-full transition-all duration-1000`}
                        style={{width: `${achievement.progress}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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