import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Copy, 
  TrendingUp,
  Percent,
  Link2,
  Twitter,
  Send,
  MessageCircle
} from "lucide-react";
import { SiWhatsapp, SiFacebook, SiTelegram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ReferralResponse {
  code: string;
  url: string;
  created_at: string;
}

// Mock referral data
const referralStats = {
  totalReferrals: 5,
  activeReferrals: 3,
  bonusRate: 0.05 // 5 * 0.01%
};

const referralList = [
  {
    id: "1",
    username: "Just Larry",
    joinDate: "03.10.2023",
    status: "Active",
    avatar: "",
    bonusContribution: 0.01
  },
  {
    id: "2", 
    username: "Space Monday",
    joinDate: "30.09.2023",
    status: "Active", 
    avatar: "",
    bonusContribution: 0.01
  },
  {
    id: "3",
    username: "Elen Flash",
    joinDate: "05.11.2021",
    status: "Inactive",
    avatar: "",
    bonusContribution: 0
  },
  {
    id: "4",
    username: "Sweet Botbert 21",
    joinDate: "03.10.2020",
    status: "Active",
    avatar: "",
    bonusContribution: 0.01
  },
  {
    id: "5",
    username: "John Boi :)",
    joinDate: "03.10.2019",
    status: "Active",
    avatar: "",
    bonusContribution: 0.01
  }
];

function ReferralRow({ referral }: { referral: typeof referralList[0] }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10 border-2 border-neon-purple/30">
          <AvatarImage src={referral.avatar} alt={referral.username} />
          <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white text-sm font-bold">
            {referral.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-medium">{referral.username}</p>
          <p className="text-white/60 text-sm">{referral.joinDate}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <p className="text-white/60 text-sm mb-1">Bonus Rate</p>
          <p className="text-neon-green font-bold">+{referral.bonusContribution}%</p>
        </div>
        <Badge 
          className={`${
            referral.status === 'Active' 
              ? 'bg-neon-green/20 text-neon-green border-neon-green/50' 
              : 'bg-white/10 text-white/60 border-white/20'
          }`}
          data-testid={`badge-status-${referral.id}`}
        >
          {referral.status}
        </Badge>
      </div>
    </div>
  );
}

export default function Referrals() {
  const { toast } = useToast();
  
  // Fetch referral data from API
  const { data: referralData, isLoading } = useQuery<ReferralResponse>({
    queryKey: ['/api/users/referral/my'],
  });

  const referralCode = referralData?.code || "";
  // Generate our own referral link using the current domain
  const referralLink = referralCode 
    ? `${window.location.origin}/sign-up?invite=${referralCode}`
    : "";
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copied!`,
      description: "Share this with your friends to earn rewards.",
    });
  };

  const shareMessage = `🚀 Join me on Ranking Mining Platform! Mine MGC & RZ tokens and earn passive income. Use my referral link to get started: ${referralLink}`;

  const socialShareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2]",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      testId: "button-share-twitter"
    },
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      color: "hover:bg-[#25D366]/20 hover:text-[#25D366]",
      url: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      testId: "button-share-whatsapp"
    },
    {
      name: "Telegram",
      icon: SiTelegram,
      color: "hover:bg-[#0088cc]/20 hover:text-[#0088cc]",
      url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('🚀 Join me on Ranking Mining Platform!')}`,
      testId: "button-share-telegram"
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      color: "hover:bg-[#1877F2]/20 hover:text-[#1877F2]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      testId: "button-share-facebook"
    }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white/60">Loading referral data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent">
          Referral Program
        </h1>
        <p className="text-white/70 text-lg">
          Invite friends and boost your mining rate by +0.01% per active referral
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Referral Link & Social Share */}
        <div className="lg:col-span-1 space-y-6">
          {/* Bonus Rate Card */}
          <Card className="border border-neon-green/30 bg-gradient-to-br from-neon-green/20 via-white/5 to-white/5 backdrop-blur-xl shadow-xl">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-neon-green/20 border-2 border-neon-green/50 flex items-center justify-center">
                  <Percent className="w-8 h-8 text-neon-green" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Your Referral Bonus</p>
                  <p className="text-5xl font-bold text-neon-green" data-testid="text-bonus-rate">
                    +{referralStats.bonusRate.toFixed(2)}%
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Applied to all mining operations
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Total Referrals:</span>
                    <span className="text-white font-semibold">{referralStats.totalReferrals}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-white/60">Active Referrals:</span>
                    <span className="text-neon-green font-semibold">{referralStats.activeReferrals}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Link Card */}
          <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Link2 className="w-5 h-5 text-neon-purple" />
                <span>Your Referral Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Referral Code */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Referral Code</label>
                <div className="flex space-x-2">
                  <Input 
                    value={referralCode}
                    readOnly
                    className="bg-white/5 border-white/20 text-white font-mono"
                    data-testid="input-referral-code"
                  />
                  <Button 
                    size="icon" 
                    onClick={() => copyToClipboard(referralCode, "Referral code")}
                    className="bg-neon-purple hover:bg-neon-purple/80"
                    data-testid="button-copy-code"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Referral Link */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Referral Link</label>
                <div className="flex space-x-2">
                  <Input 
                    value={referralLink}
                    readOnly
                    className="bg-white/5 border-white/20 text-white text-sm"
                    data-testid="input-referral-link"
                  />
                  <Button 
                    size="icon" 
                    onClick={() => copyToClipboard(referralLink, "Referral link")}
                    className="bg-neon-green hover:bg-neon-green/80"
                    data-testid="button-copy-link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Share Card */}
          <Card className="border border-white/10 bg-gradient-to-br from-neon-purple/10 to-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Send className="w-5 h-5 text-neon-purple" />
                <span>Share on Social Media</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {socialShareLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="outline"
                    className={`bg-white/5 border-white/20 text-white transition-all duration-300 ${social.color}`}
                    onClick={() => window.open(social.url, '_blank')}
                    data-testid={social.testId}
                  >
                    <social.icon className="w-4 h-4 mr-2" />
                    {social.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="border border-mining-orange/30 bg-gradient-to-br from-mining-orange/10 to-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="w-5 h-5 text-mining-orange" />
                <span>How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-neon-purple text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Share Your Link</p>
                  <p className="text-white/60 text-sm">Send your referral link to friends</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-neon-green text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">They Join & Mine</p>
                  <p className="text-white/60 text-sm">Your friend starts mining with their account</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-mining-orange/20 border border-mining-orange/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-mining-orange text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Earn +0.01% Bonus</p>
                  <p className="text-white/60 text-sm">Get permanent rate boost for each active referral</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Referrals List */}
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
                    <p className="text-sm">Start sharing your referral link to boost your mining rate!</p>
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
