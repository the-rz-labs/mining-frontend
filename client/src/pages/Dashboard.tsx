import { useState } from "react";
import { useLocation } from "wouter";
import { 
  User, 
  Wallet, 
  Shield, 
  Trophy, 
  Star, 
  Settings, 
  LogOut, 
  Plus,
  ExternalLink,
  Zap,
  TrendingUp,
  Award,
  Crown,
  Target,
  Calendar,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, UserBadge } from "@shared/schema";

// Mock data for now - will be replaced with API calls
const mockUserData: UserType = {
  id: "1",
  username: "CryptoMiner_Pro",
  email: "admin@gmail.com",
  passwordHash: "", // Not used in frontend
  referralCode: "ABC123",
  referredByUserId: null,
  walletAddress: null,
  rankAccountId: null,
  referralCount: 7,
  miningStartedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
};

const mockBadges: UserBadge[] = [
  { id: "1", userId: "1", type: "referrals_5", awardedAt: new Date() },
  { id: "2", userId: "1", type: "mining_week_1", awardedAt: new Date() }
];

const badgeConfig = {
  referrals_5: { 
    label: "Rookie Recruiter", 
    description: "Referred 5 users", 
    icon: User, 
    color: "from-blue-500 to-cyan-500",
    unlocked: true 
  },
  referrals_10: { 
    label: "Elite Recruiter", 
    description: "Referred 10 users", 
    icon: Star, 
    color: "from-purple-500 to-pink-500",
    unlocked: false 
  },
  referrals_25: { 
    label: "Master Recruiter", 
    description: "Referred 25 users", 
    icon: Crown, 
    color: "from-yellow-500 to-orange-500",
    unlocked: false 
  },
  referrals_50: { 
    label: "Legend Recruiter", 
    description: "Referred 50 users", 
    icon: Trophy, 
    color: "from-red-500 to-pink-500",
    unlocked: false 
  },
  mining_week_1: { 
    label: "Week Warrior", 
    description: "Mined for 1 week", 
    icon: Calendar, 
    color: "from-green-500 to-emerald-500",
    unlocked: true 
  },
  mining_month_1: { 
    label: "Month Master", 
    description: "Mined for 1 month", 
    icon: Target, 
    color: "from-purple-500 to-violet-500",
    unlocked: false 
  },
  mining_year_1: { 
    label: "Year Legend", 
    description: "Mined for 1 year", 
    icon: Award, 
    color: "from-orange-500 to-red-500",
    unlocked: false 
  }
};

function ProfileHeaderCard({ user }: { user: UserType }) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-neon-purple/50 ring-4 ring-neon-purple/20">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.username} />
              <AvatarFallback className="bg-gradient-to-br from-neon-purple/20 to-neon-green/20 text-white font-bold text-lg">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-neon-green to-mining-orange rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                {user.username}
              </h2>
              <Badge 
                variant="outline" 
                className="border-neon-green/30 text-neon-green bg-neon-green/10 hover:bg-neon-green/20"
                data-testid="badge-status"
              >
                Active Miner
              </Badge>
            </div>
            <p className="text-white/60 mb-1" data-testid="text-email">{user.email}</p>
            <div className="flex items-center space-x-4 text-sm text-white/40">
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{user.referralCount} Referrals</span>
              </span>
              {user.miningStartedAt && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Mining since {user.miningStartedAt.toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/60 hover:text-white hover:bg-white/10"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function WalletConnectCard({ user, onWalletUpdate }: { user: UserType; onWalletUpdate: (walletAddress: string | null) => void }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // Mock wallet connection - will be replaced with actual integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockWalletAddress = "0x" + Math.random().toString(16).substring(2, 42).padEnd(40, '0');
      onWalletUpdate(mockWalletAddress);
      toast({
        title: "Wallet Connected!",
        description: "Your wallet has been successfully connected to your account."
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    onWalletUpdate(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from your account."
    });
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Wallet className="w-5 h-5 text-mining-orange" />
          <span>Wallet Connection</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Connect your wallet to start earning rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user.walletAddress ? (
          <div className="space-y-4">
            <div className="p-4 bg-neon-green/10 border border-neon-green/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="text-neon-green font-medium">Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnectWallet}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  data-testid="button-disconnect-wallet"
                >
                  Disconnect
                </Button>
              </div>
              <p className="text-white/80 mt-2 font-mono text-sm" data-testid="text-wallet-address">
                {user.walletAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
              <Wallet className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 mb-4">No wallet connected</p>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-mining-orange to-neon-purple hover:from-mining-orange/80 hover:to-neon-purple/80 text-white"
                data-testid="button-connect-wallet"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RankConnectCard({ user, onRankUpdate }: { user: UserType; onRankUpdate: (rankAccountId: string | null) => void }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectRank = async () => {
    setIsConnecting(true);
    try {
      // Mock rank connection - will be replaced with actual integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockRankId = "RANK_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      onRankUpdate(mockRankId);
      toast({
        title: "Rank Account Connected!",
        description: "Your ranking account has been successfully linked."
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect rank account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectRank = () => {
    onRankUpdate(null);
    toast({
      title: "Rank Account Disconnected",
      description: "Your rank account has been disconnected."
    });
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Shield className="w-5 h-5 text-neon-green" />
          <span>Ranking Account</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Link your ranking account for enhanced rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user.rankAccountId ? (
          <div className="space-y-4">
            <div className="p-4 bg-neon-green/10 border border-neon-green/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="text-neon-green font-medium">Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnectRank}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  data-testid="button-disconnect-rank"
                >
                  Disconnect
                </Button>
              </div>
              <p className="text-white/80 mt-2" data-testid="text-rank-account">
                Account ID: {user.rankAccountId}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
              <Shield className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 mb-4">No ranking account connected</p>
              <Button
                onClick={handleConnectRank}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-neon-green to-neon-purple hover:from-neon-green/80 hover:to-neon-purple/80 text-white"
                data-testid="button-connect-rank"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Rank Account
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BadgeItem({ badgeType, isUnlocked }: { badgeType: keyof typeof badgeConfig; isUnlocked: boolean }) {
  const config = badgeConfig[badgeType];
  const IconComponent = config.icon;

  return (
    <div 
      className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
        isUnlocked 
          ? 'bg-white/10 border-white/20 shadow-lg hover:shadow-xl' 
          : 'bg-white/5 border-white/10 opacity-50'
      }`}
      data-testid={`badge-${badgeType}`}
    >
      <div className="text-center space-y-3">
        <div className={`relative mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
          isUnlocked 
            ? `bg-gradient-to-r ${config.color} shadow-lg animate-pulse-glow` 
            : 'bg-white/10'
        }`}>
          <IconComponent className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-white/40'}`} />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white/60" />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
            {config.label}
          </h3>
          <p className={`text-xs ${isUnlocked ? 'text-white/60' : 'text-white/30'}`}>
            {config.description}
          </p>
        </div>
        
        {isUnlocked && (
          <div className="absolute top-2 right-2">
            <Unlock className="w-4 h-4 text-neon-green" />
          </div>
        )}
      </div>
    </div>
  );
}

function BadgesGrid({ badges }: { badges: UserBadge[] }) {
  const unlockedBadgeTypes = new Set(badges.map(badge => badge.type));

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Trophy className="w-5 h-5 text-mining-orange" />
          <span>Achievement Badges</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Unlock badges by reaching milestones and completing challenges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(Object.keys(badgeConfig) as Array<keyof typeof badgeConfig>).map((badgeType) => (
            <BadgeItem 
              key={badgeType} 
              badgeType={badgeType} 
              isUnlocked={unlockedBadgeTypes.has(badgeType)} 
            />
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 font-medium">Progress Overview</span>
            <span className="text-neon-green font-bold">{badges.length}/{Object.keys(badgeConfig).length}</span>
          </div>
          <Progress 
            value={(badges.length / Object.keys(badgeConfig).length) * 100} 
            className="h-2"
          />
          <p className="text-xs text-white/40 mt-2">
            Keep mining and referring friends to unlock more badges!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<UserType>(mockUserData);
  const [badges] = useState<UserBadge[]>(mockBadges);
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    navigate("/sign-in");
  };
  
  const handleWalletUpdate = (walletAddress: string | null) => {
    setUser((prev: UserType) => ({ ...prev, walletAddress }));
  };
  
  const handleRankUpdate = (rankAccountId: string | null) => {
    setUser((prev: UserType) => ({ ...prev, rankAccountId }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-neon-green/30 rounded-full blur-3xl animate-float opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl animate-breathing opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-neon-green/20 to-mining-orange/20 rounded-full blur-3xl animate-float opacity-50 hidden sm:block" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-50"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60 hidden md:block"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-neon-green rounded-full animate-float opacity-40 hidden lg:block" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-mining-orange rounded-full animate-float opacity-50 hidden md:block" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                Mining Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/60 hover:text-white hover:bg-white/10"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeaderCard user={user} />
          
          {/* Connection Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WalletConnectCard user={user} onWalletUpdate={handleWalletUpdate} />
            <RankConnectCard user={user} onRankUpdate={handleRankUpdate} />
          </div>
          
          {/* Badges Grid */}
          <BadgesGrid badges={badges} />
        </div>
      </main>
    </div>
  );
}