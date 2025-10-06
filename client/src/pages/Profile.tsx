import { useState } from "react";
import { 
  Settings, 
  LogOut, 
  Zap,
  Flame,
  Coins,
  Rocket,
  Diamond,
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
import { AvatarSelection } from "@/components/AvatarSelection";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASE_URL = "https://coinmaining.game";

// Type definitions for API response
interface UserProfileResponse {
  user: {
    id: number;
    email: string;
    username: string;
    display_name: string | null;
    avatar: string;
  };
  wallet: {
    connected: boolean;
    provider: string;
    address: string;
  };
  stakes: any[];
  withdrawable_total: string;
  withdrawable_per_token: Record<string, any>;
  recent_transactions: any[];
  explainers: {
    referral: {
      active_referrals: number;
      per_active_bp: number;
    };
    badges: {
      total_badge_bonus_bp: number;
    };
  };
  badges: any[];
}

// Helper function to get avatar URL from avatar key
const getAvatarUrl = (avatarKey: string): string => {
  return `https://coinmaining.game/profiles/${avatarKey}.jpeg`;
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


export default function Profile() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showAvatarEdit, setShowAvatarEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    username: "",
    email: ""
  });

  // Fetch user profile from API
  const { data: profileData, isLoading } = useQuery<UserProfileResponse>({
    queryKey: ['/api/users/me'],
  });

  // Fetch miners data for mining power
  const { data: minersData } = useQuery<{ total_power: number; total_staked: string; active_miners: number }>({
    queryKey: ['/api/stakes/miners'],
  });

  // Fetch referral stats
  const { data: referralStats } = useQuery<{ total_referrals: number; active_referrals: number; last_invited_at: string }>({
    queryKey: ['/api/users/referral/stats'],
  });

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username: string; display_name: string; email: string; avatar_key?: string }) => {
      return await apiRequest('PATCH', '/api/users/me/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      setShowSettings(false);
      toast({
        title: "Profile Updated! ✨",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/sign-in");
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    // Extract avatar key from URL (e.g., "pr-1" from "https://coinmaining.game/profiles/pr-1.jpeg")
    const avatarKey = avatarUrl.split('/').pop()?.replace('.jpeg', '') || '';
    
    if (profileData) {
      updateProfileMutation.mutate({
        username: profileData.user.username,
        display_name: profileData.user.username,
        email: profileData.user.email,
        avatar_key: avatarKey
      });
      setShowAvatarEdit(false);
    }
  };

  const handleOpenSettings = () => {
    if (profileData) {
      setSettingsForm({
        username: profileData.user.username,
        email: profileData.user.email
      });
      setShowSettings(true);
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      username: settingsForm.username,
      display_name: settingsForm.username, // Use same value for display_name
      email: settingsForm.email
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white/60">Loading profile...</div>
        </div>
      </div>
    );
  }

  // Handle no data
  if (!profileData) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white/60">Unable to load profile data</div>
        </div>
      </div>
    );
  }

  const profile = profileData.user;
  const avatarUrl = getAvatarUrl(profile.avatar);
  const activeReferrals = profileData.explainers.referral.active_referrals;
  const bonusRate = activeReferrals * 0.01; // Each referral adds 0.01%
  const totalStakes = profileData.stakes.length;

  // Maximum values for stats
  const MAX_MINING_POWER = 1000;
  const MAX_ACTIVE_MINERS = 2;
  const MAX_REFERRALS = 50;
  const MAX_BONUS_RATE = 1.5;

  // Current values from API data
  const currentMiningPower = minersData?.total_power || 0;
  const currentActiveMiners = totalStakes;
  const currentReferrals = referralStats?.total_referrals || 0;
  const currentBonusRate = bonusRate;

  // Dynamic stats based on API data with calculated progress percentages
  const stats = [
    {
      title: "Mining Power",
      value: currentMiningPower.toLocaleString(),
      subtitle: "TH/s",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      progress: Math.min((currentMiningPower / MAX_MINING_POWER) * 100, 100)
    },
    {
      title: "Active Miners", 
      value: currentActiveMiners.toString(),
      subtitle: "All Online",
      icon: Activity,
      color: "from-purple-500 to-pink-500",
      progress: Math.min((currentActiveMiners / MAX_ACTIVE_MINERS) * 100, 100)
    },
    {
      title: "Referrals",
      value: currentReferrals.toString(),
      subtitle: "Growing",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      progress: Math.min((currentReferrals / MAX_REFERRALS) * 100, 100)
    },
    {
      title: "Bonus Rate",
      value: `${currentBonusRate.toFixed(2)}%`,
      subtitle: "Earnings Boost",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      progress: Math.min((currentBonusRate / MAX_BONUS_RATE) * 100, 100)
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 p-4 md:p-6">
      
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Avatar on left */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-20 h-20 md:w-32 md:h-32 border-2 md:border-4 border-white/20 shadow-2xl">
              <AvatarImage src={avatarUrl} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-xl md:text-3xl font-bold">
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button 
              size="icon"
              variant="ghost"
              className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 rounded-full"
              onClick={() => setShowAvatarEdit(!showAvatarEdit)}
              data-testid="button-edit-avatar"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </Button>
          </div>
          
          {/* Profile Info on right */}
          <div className="space-y-1 md:space-y-3 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-white truncate" data-testid="text-username">
              {profile.username}
            </h1>
            <p className="text-white/60 text-sm md:text-lg truncate">{profile.email}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 flex-1 md:flex-none text-sm md:text-base"
            onClick={handleOpenSettings}
            data-testid="button-settings"
          >
            <Settings className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 flex-1 md:flex-none text-sm md:text-base"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* GitHub-style Circular Badges */}
      <div className="space-y-4 md:space-y-6">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Achievements</h2>
          <p className="text-white/60 text-sm md:text-base">Earned {circularBadges.filter(b => b.earned).length} of {circularBadges.length} badges</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {circularBadges.map((badge) => (
            <div key={badge.id} className="relative group">
              {/* Circular Badge */}
              <div className={`
                w-16 h-16 md:w-20 md:h-20 rounded-full border-2 ${badge.borderColor} ${badge.bgColor}
                flex items-center justify-center cursor-pointer
                transition-all duration-300 hover:scale-110
                ${badge.earned ? 'opacity-100' : 'opacity-40 grayscale'}
              `}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
                  <badge.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-sm text-white text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg whitespace-nowrap border border-white/20">
                  {badge.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-white/60 text-xs md:text-sm">{stat.progress.toFixed(1)}%</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/60 text-xs md:text-sm">{stat.title}</p>
                  <p className="text-white/40 text-[10px] md:text-xs">{stat.subtitle}</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 md:h-2">
                  <div 
                    className={`h-1.5 md:h-2 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
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
              selectedAvatar={avatarUrl}
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

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900 border border-white/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Profile Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/80">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={settingsForm.username}
                  onChange={(e) => setSettingsForm({ ...settingsForm, username: e.target.value })}
                  className="bg-white/5 border-white/20 text-white focus:border-neon-purple"
                  placeholder="Enter username"
                  required
                  data-testid="input-username"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="bg-white/5 border-white/20 text-white focus:border-neon-purple"
                  placeholder="Enter email"
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                data-testid="button-cancel-settings"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1 bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 text-white"
                data-testid="button-save-settings"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}