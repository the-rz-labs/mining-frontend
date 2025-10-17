import { useQuery } from "@tanstack/react-query";
import { 
  Trophy, 
  Lock,
  Sparkles,
  Star,
  Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface BadgeData {
  id: number;
  key: string;
  name: string;
  title: string;
  description: string;
  type: string;
  reward_rate_bp: number;
  image_url: string;
  rarity: string;
}

interface UserBadgeData {
  badge: BadgeData;
  is_active: boolean;
  awarded_at: string;
}

interface UserBadgesResponse {
  bonus_bp: number;
  badges: UserBadgeData[];
}

function BadgeCard({ badge, isUnlocked }: { badge: BadgeData; isUnlocked: boolean }) {
  const getRarityStyles = (rarity: string) => {
    switch (rarity.toUpperCase()) {
      case 'LEGENDARY':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          text: 'text-white',
          border: 'border-yellow-500/50',
          glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]'
        };
      case 'EPIC':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          text: 'text-white',
          border: 'border-purple-500/50',
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
        };
      case 'RARE':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          text: 'text-white',
          border: 'border-blue-500/50',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
        };
      case 'UNCOMMON':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          text: 'text-white',
          border: 'border-green-500/50',
          glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]'
        };
      default: // COMMON
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-400',
          text: 'text-white',
          border: 'border-gray-500/50',
          glow: ''
        };
    }
  };

  const rarityStyles = getRarityStyles(badge.rarity);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isUnlocked 
          ? 'border-neon-purple/40 bg-gradient-to-br from-white/10 to-neon-purple/5 shadow-lg' 
          : 'border-white/10 bg-white/5'
      }`}
      data-testid={`badge-${badge.key}`}
    >
      {/* Rarity Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className={`${rarityStyles.bg} ${rarityStyles.text} border-none text-xs font-bold px-2 py-1 ${rarityStyles.glow}`}>
          {badge.rarity}
        </Badge>
      </div>

      {/* Badge Content */}
      <div className="p-6 space-y-4">
        {/* Badge Image */}
        <div className="relative w-28 h-28 mx-auto">
          <div className={`w-full h-full rounded-2xl overflow-hidden ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
            <img 
              src={badge.image_url} 
              alt={badge.name}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Lock/Unlock Badge */}
          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
            isUnlocked ? 'bg-neon-green' : 'bg-gray-600'
          }`}>
            {isUnlocked ? (
              <Star className="w-5 h-5 text-black fill-black" />
            ) : (
              <Lock className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
        
        {/* Badge Info */}
        <div className="text-center space-y-2">
          <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
            {badge.title}
          </h3>
          <p className={`text-sm leading-relaxed ${isUnlocked ? 'text-white/70' : 'text-white/40'}`}>
            {badge.description}
          </p>
          
          {/* Reward Badge */}
          {isUnlocked && badge.reward_rate_bp > 0 && (
            <div className="pt-2">
              <Badge className="bg-gradient-to-r from-neon-green to-emerald-600 text-white border-none text-xs font-bold">
                +{(badge.reward_rate_bp / 100).toFixed(2)}% Bonus
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Achievements() {
  const { data: allBadges, isLoading: loadingAll } = useQuery<BadgeData[]>({
    queryKey: ['/api/badges'],
  });

  const { data: userBadges, isLoading: loadingUser } = useQuery<UserBadgesResponse>({
    queryKey: ['/api/badges/me'],
  });

  const isLoading = loadingAll || loadingUser;
  
  // Get list of unlocked badge keys
  const unlockedBadgeKeys = userBadges?.badges.map(ub => ub.badge.key) || [];
  const totalBadges = allBadges?.length || 0;
  const unlockedCount = unlockedBadgeKeys.length;
  const progressPercentage = totalBadges > 0 ? (unlockedCount / totalBadges) * 100 : 0;

  // Rarity order for sorting
  const rarityOrder: Record<string, number> = {
    'COMMON': 1,
    'UNCOMMON': 2,
    'RARE': 3,
    'EPIC': 4,
    'LEGENDARY': 5
  };

  // Sort badges: unlocked first, then locked badges by rarity (common to legendary)
  const sortedBadges = allBadges ? [...allBadges].sort((a, b) => {
    const aUnlocked = unlockedBadgeKeys.includes(a.key);
    const bUnlocked = unlockedBadgeKeys.includes(b.key);
    
    // If both unlocked or both locked, sort by rarity
    if (aUnlocked === bUnlocked) {
      const aRarity = rarityOrder[a.rarity.toUpperCase()] || 0;
      const bRarity = rarityOrder[b.rarity.toUpperCase()] || 0;
      return aRarity - bRarity;
    }
    
    // Unlocked badges come first
    return aUnlocked ? -1 : 1;
  }) : [];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Achievements
          </h1>
          {!isLoading && (
            <Badge className="bg-gradient-to-r from-neon-purple to-purple-600 text-white border-none px-6 py-2 text-lg font-bold">
              {unlockedCount}/{totalBadges}
            </Badge>
          )}
        </div>
        <p className="text-white/60 text-lg">
          Unlock badges and earn bonus rewards
        </p>
      </div>

      {/* Progress Overview */}
      {isLoading ? (
        <Skeleton className="h-48 bg-white/5" />
      ) : (
        <Card className="border-2 border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-white text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-r from-neon-purple to-purple-600">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span>Achievement Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium text-lg">Overall Completion</span>
              <span className="text-neon-green font-bold text-2xl">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            
            {/* Bonus Rate */}
            {userBadges && userBadges.bonus_bp > 0 && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neon-green/20 to-emerald-600/20 border border-neon-green/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-neon-green/20">
                    <Sparkles className="w-5 h-5 text-neon-green" />
                  </div>
                  <span className="text-white font-medium">Total Achievement Bonus</span>
                </div>
                <span className="text-neon-green font-bold text-xl">+{(userBadges.bonus_bp / 100).toFixed(2)}%</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Achievement Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedBadges.map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              isUnlocked={unlockedBadgeKeys.includes(badge.key)} 
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!allBadges || allBadges.length === 0) && (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-neon-purple" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Achievements Yet</h3>
            <p className="text-white/60">
              Start mining to unlock your first achievement
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
