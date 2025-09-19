import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Share, 
  Copy, 
  DollarSign,
  TrendingUp,
  Gift,
  Calendar,
  Award,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock referral data matching the template
const referralStats = {
  totalReferrals: 5,
  activeReferrals: 3,
  totalEarnings: 175.84,
  thisMonth: 45.20
};

const referralList = [
  {
    id: "1",
    username: "Just Larry",
    joinDate: "03.10.2023",
    earnings: 17.84,
    status: "Active",
    avatar: "",
    level: 24
  },
  {
    id: "2", 
    username: "Space Monday",
    joinDate: "30.09.2023",
    earnings: 15.36,
    status: "Active", 
    avatar: "",
    level: 109
  },
  {
    id: "3",
    username: "Elen Flash",
    joinDate: "05.11.2021",
    earnings: 7.00,
    status: "Inactive",
    avatar: "",
    level: 9
  },
  {
    id: "4",
    username: "Sweet Botbert 21",
    joinDate: "03.10.2020",
    earnings: 4.10,
    status: "Active",
    avatar: "",
    level: 17
  },
  {
    id: "5",
    username: "John Boi :)",
    joinDate: "03.10.2019",
    earnings: 17.84,
    status: "Active",
    avatar: "",
    level: 24
  }
];

function ReferralStatsCard({ title, value, icon: Icon, color, suffix = "" }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  suffix?: string;
}) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/60 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">
              {value}{suffix}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReferralRow({ referral }: { referral: typeof referralList[0] }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10 border border-white/20">
          <AvatarImage src={referral.avatar} alt={referral.username} />
          <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white text-sm font-bold">
            {referral.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-medium">{referral.username}</p>
          <p className="text-white/60 text-sm">{referral.level}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <p className="text-white/60">Registration Date</p>
          <p className="text-white">{referral.joinDate}</p>
        </div>
        <div className="text-center">
          <p className="text-white/60">Referral Income</p>
          <p className="text-neon-green font-medium">${referral.earnings.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <Badge 
            className={`${
              referral.status === 'Active' 
                ? 'bg-neon-green/20 text-neon-green border-neon-green/50' 
                : 'bg-white/10 text-white/60 border-white/20'
            }`}
          >
            {referral.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function Referrals() {
  const [referralCode] = useState("CRYPTO2024MINE");
  const { toast } = useToast();
  
  const copyReferralLink = () => {
    const link = `https://ranking-mining.com/ref/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Referral link copied!",
      description: "Share this link with your friends to earn rewards.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Referral Program
        </h1>
        <p className="text-white/60">
          Invite friends and earn rewards for every successful referral
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReferralStatsCard
          title="Total Referrals"
          value={referralStats.totalReferrals}
          icon={Users}
          color="bg-neon-purple/20 text-neon-purple border-neon-purple/50"
          data-testid="stat-total-referrals"
        />
        <ReferralStatsCard
          title="Active Referrals"
          value={referralStats.activeReferrals}
          icon={TrendingUp}
          color="bg-neon-green/20 text-neon-green border-neon-green/50"
          data-testid="stat-active-referrals"
        />
        <ReferralStatsCard
          title="Total Earnings"
          value={referralStats.totalEarnings.toFixed(2)}
          icon={DollarSign}
          color="bg-mining-orange/20 text-mining-orange border-mining-orange/50"
          suffix=" MGC"
          data-testid="stat-total-earnings"
        />
        <ReferralStatsCard
          title="This Month"
          value={referralStats.thisMonth.toFixed(2)}
          icon={Calendar}
          color="bg-blue-500/20 text-blue-400 border-blue-500/50"
          suffix=" MGC"
          data-testid="stat-month-earnings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Link Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Share className="w-5 h-5 text-neon-green" />
                <span>Your Referral Link</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/70 text-sm">Referral Code</label>
                <div className="flex space-x-2">
                  <Input 
                    value={referralCode}
                    readOnly
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-referral-code"
                  />
                  <Button 
                    size="icon" 
                    onClick={copyReferralLink}
                    className="bg-neon-green hover:bg-neon-green/80"
                    data-testid="button-copy-code"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold"
                onClick={copyReferralLink}
                data-testid="button-share-link"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Share Referral Link
              </Button>
            </CardContent>
          </Card>

          {/* Referral Rewards */}
          <Card className="border border-white/10 bg-gradient-to-br from-mining-orange/10 to-yellow-500/10 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Gift className="w-5 h-5 text-mining-orange" />
                <span>Referral Rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80">Friend joins</span>
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
                    10 MGC
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80">First mining session</span>
                  <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                    25 MGC
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80">Monthly bonus (per active referral)</span>
                  <Badge className="bg-mining-orange/20 text-mining-orange border-mining-orange/50">
                    5 MGC
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referrals List */}
        <div className="lg:col-span-2">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5 text-neon-purple" />
                  <span>Your Referrals</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
                    {referralStats.activeReferrals} Active
                  </Badge>
                  <Badge className="bg-white/10 text-white/60 border-white/20">
                    {referralStats.totalReferrals} Total
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-white/5 rounded-lg text-white/60 text-sm font-medium">
                  <div className="col-span-4">REFERRALS</div>
                  <div className="col-span-2">STATUS</div>
                  <div className="col-span-3">REGISTRATION DATE</div>
                  <div className="col-span-3">REFERRAL INCOME</div>
                </div>
                
                {/* Referral List */}
                <div className="space-y-2">
                  {referralList.map((referral) => (
                    <ReferralRow key={referral.id} referral={referral} />
                  ))}
                </div>
                
                {referralList.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No referrals yet</p>
                    <p className="text-sm">Start sharing your referral link to earn rewards!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}