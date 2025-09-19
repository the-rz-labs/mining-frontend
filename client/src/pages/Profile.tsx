import { useState } from "react";
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
import { useLocation } from "wouter";

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
    label: "Mining Novice", 
    description: "Mined for 1 week", 
    icon: Zap, 
    color: "from-green-500 to-emerald-500",
    unlocked: true 
  },
  mining_month_1: { 
    label: "Mining Veteran", 
    description: "Mined for 1 month", 
    icon: Award, 
    color: "from-indigo-500 to-purple-500",
    unlocked: false 
  },
  mining_year_1: { 
    label: "Mining Master", 
    description: "Mined for 1 year", 
    icon: Target, 
    color: "from-orange-500 to-red-500",
    unlocked: false 
  }
};

function ProfileHeaderCard({ user }: { user: UserType }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/sign-in");
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-2 border-neon-purple/50 shadow-lg shadow-neon-purple/20">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-neon-purple/20 to-neon-green/20 text-white text-xl font-bold">
                {user.username?.slice(0, 2).toUpperCase() || 'CP'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent" data-testid="text-username">
                {user.username}
              </h2>
              <p className="text-white/60" data-testid="text-email">{user.email}</p>
              <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                Mining Active
              </Badge>
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
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-white" data-testid="text-referral-count">{user.referralCount}</p>
            <p className="text-white/60 text-sm">Referrals</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-neon-green">15</p>
            <p className="text-white/60 text-sm">Days Mining</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-mining-orange" data-testid="text-referral-code">{user.referralCode}</p>
            <p className="text-white/60 text-sm">Referral Code</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function WalletConnectCard({ user, onWalletUpdate }: { user: UserType; onWalletUpdate: (walletAddress: string | null) => void }) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Mock wallet connection - replace with real wallet integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockWalletAddress = "0x742d35Cc82AAA1234567890ABCDefabcde123456";
    onWalletUpdate(mockWalletAddress);
    
    toast({
      title: "Wallet Connected",
      description: "Your MetaMask wallet has been successfully connected.",
    });
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    onWalletUpdate(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Wallet className="w-5 h-5 text-neon-green" />
          <span>Wallet Connection</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Connect your crypto wallet for secure transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.walletAddress ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm text-white/80 font-medium">Connected Wallet</p>
                <p className="text-xs text-neon-green font-mono" data-testid="text-wallet-address">
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </p>
              </div>
              <Shield className="w-5 h-5 text-neon-green" />
            </div>
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleDisconnect}
              data-testid="button-disconnect-wallet"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 border-2 border-dashed border-white/20 rounded-lg text-center">
              <Wallet className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 text-sm">No wallet connected</p>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/80 hover:to-emerald-600/80"
              onClick={handleConnect}
              disabled={isConnecting}
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
        )}
      </CardContent>
    </Card>
  );
}

function RankConnectCard({ user, onRankUpdate }: { user: UserType; onRankUpdate: (rankAccountId: string | null) => void }) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Mock ranking platform connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRankId = "RANK_" + Math.random().toString(36).substring(2, 8).toUpperCase();
    onRankUpdate(mockRankId);
    
    toast({
      title: "Ranking Account Connected",
      description: "Your Ranking platform account has been successfully linked.",
    });
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    onRankUpdate(null);
    toast({
      title: "Ranking Account Disconnected",
      description: "Your Ranking platform account has been disconnected.",
    });
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <TrendingUp className="w-5 h-5 text-mining-orange" />
          <span>Ranking Platform</span>
        </CardTitle>
        <CardDescription className="text-white/60">
          Connect to the external Ranking platform for enhanced features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.rankAccountId ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-mining-orange/10 border border-mining-orange/30 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm text-white/80 font-medium">Connected Account</p>
                <p className="text-xs text-mining-orange font-mono" data-testid="text-rank-account">
                  {user.rankAccountId}
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-mining-orange" />
            </div>
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleDisconnect}
              data-testid="button-disconnect-rank"
            >
              Disconnect Account
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 border-2 border-dashed border-white/20 rounded-lg text-center">
              <TrendingUp className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 text-sm">No account connected</p>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-mining-orange to-orange-600 hover:from-mining-orange/80 hover:to-orange-600/80"
              onClick={handleConnect}
              disabled={isConnecting}
              data-testid="button-connect-rank"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BadgeItem({ badgeType, isUnlocked }: { badgeType: keyof typeof badgeConfig; isUnlocked: boolean }) {
  const config = badgeConfig[badgeType];
  
  return (
    <div className={`relative group ${isUnlocked ? 'animate-glow' : ''}`} data-testid={`badge-${badgeType}`}>
      <div className={`
        relative overflow-hidden rounded-lg border transition-all duration-500 hover:scale-105
        ${isUnlocked 
          ? 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-neon-purple/20' 
          : 'border-white/10 bg-white/5 grayscale opacity-60'
        }
      `}>
        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-10`}></div>
        
        <div className="relative p-4 text-center space-y-3">
          <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${config.color} ${isUnlocked ? 'opacity-100' : 'opacity-40'} flex items-center justify-center`}>
            <config.icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="space-y-1">
            <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
              {config.label}
            </h4>
            <p className={`text-xs ${isUnlocked ? 'text-white/70' : 'text-white/40'}`}>
              {config.description}
            </p>
          </div>
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

export default function Profile() {
  const [user, setUser] = useState<UserType>(mockUserData);
  const [badges] = useState<UserBadge[]>(mockBadges);
  
  const handleWalletUpdate = (walletAddress: string | null) => {
    setUser((prev: UserType) => ({ ...prev, walletAddress }));
  };
  
  const handleRankUpdate = (rankAccountId: string | null) => {
    setUser((prev: UserType) => ({ ...prev, rankAccountId }));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Profile Management
        </h1>
        <p className="text-white/60">
          Manage your account, connections, and achievements
        </p>
      </div>

      {/* Profile Header */}
      <ProfileHeaderCard user={user} />
      
      {/* Connections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WalletConnectCard user={user} onWalletUpdate={handleWalletUpdate} />
        <RankConnectCard user={user} onRankUpdate={handleRankUpdate} />
      </div>
      
      {/* Badges Section */}
      <BadgesGrid badges={badges} />
    </div>
  );
}