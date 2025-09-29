import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveMiners } from "@/components/ActiveMiners";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Cpu, 
  Thermometer, 
  Clock, 
  DollarSign,
  Activity,
  Wifi,
  Battery,
  User,
  Trophy,
  Coins,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

// Mock mining data
const miningStats = {
  totalProfit: 54.00,
  totalMiners: 2,
  activeMiners: 2,
  hashRate: "2.45 TH/s",
  hashRateChange: 12.5,
  power: "1,420 W",
  temperature: "72°C",
  uptime: "99.8%",
  mgcBalance: "1,234.56",
  rzBalance: "8,901.23",
  minerStatus: "Active",
  dailyEarnings: 142.50,
  weeklyEarnings: 985.30
};



function StatCard({ title, value, change, icon: Icon, suffix = "" }: {
  title: string;
  value: string;
  change?: number;
  icon: any;
  suffix?: string;
}) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-white/60 text-sm font-medium">{title}</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{value}</span>
              {suffix && <span className="text-white/40 text-sm">{suffix}</span>}
            </div>
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-neon-purple" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${change > 0 ? 'text-neon-purple' : 'text-red-500'}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-mining-orange/20 rounded-lg flex items-center justify-center border border-white/10">
            <Icon className="w-6 h-6 text-neon-purple" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusCard({ title, status, icon: Icon, color }: {
  title: string;
  status: string;
  icon: any;
  color: "green" | "orange" | "red";
}) {
  const colorClasses = {
    green: "text-neon-purple bg-neon-purple/20 border-neon-purple/50",
    orange: "text-mining-orange bg-mining-orange/20 border-mining-orange/50",
    red: "text-red-500 bg-red-500/20 border-red-500/50"
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${color === 'green' ? 'text-neon-purple' : color === 'orange' ? 'text-mining-orange' : 'text-red-500'}`} />
            <span className="text-white/80 font-medium">{title}</span>
          </div>
          <Badge className={`${colorClasses[color]} border`}>
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


// Mining earnings display
function EarningsDisplay() {
  return (
    <Card className="border border-white/10 bg-gradient-to-br from-neon-purple/20 to-mining-orange/20 backdrop-blur-xl shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-mining-orange/10 animate-pulse"></div>
      <CardContent className="p-8 relative">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-neon-purple/30 to-mining-orange/30 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
            <Coins className="w-12 h-12 text-white" />
          </div>
          <div>
            <p className="text-neon-green text-sm font-bold tracking-wider uppercase">Total Earnings</p>
            <h1 className="text-5xl font-black bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent mb-2 animate-pulse-glow">${miningStats.totalProfit.toFixed(2)}</h1>
            <p className="text-white/70 text-sm">From mining operations</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-white">{miningStats.totalMiners}</p>
              <p className="text-white/60 text-xs uppercase font-medium">Total Miners</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-neon-green">{miningStats.activeMiners}</p>
              <p className="text-white/60 text-xs uppercase font-medium">Active Now</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/80">Daily Earnings</span>
              <span className="text-neon-green font-bold">${miningStats.dailyEarnings}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/80">Weekly Earnings</span>
              <span className="text-mining-orange font-bold">${miningStats.weeklyEarnings}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      {/* Modern Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent animate-pulse-glow">
            Mining Dashboard
          </h1>
          <p className="text-2xl text-white/80 font-light">
            Real-time cryptocurrency mining operations
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Earnings Overview */}
        <div className="text-center">
          <EarningsDisplay />
        </div>

        {/* Wallet Balances */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent mb-4">
              Wallet Balance
            </h2>
            <p className="text-xl text-white/80">Your cryptocurrency holdings</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* MGC Token Balance */}
            <Card className="border-2 border-neon-purple/30 bg-gradient-to-br from-neon-purple/20 to-purple-600/10 backdrop-blur-xl hover:border-neon-purple/60 transition-all duration-500 shadow-2xl hover:shadow-neon-purple/20 relative overflow-hidden transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-purple-600/5 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-neon-purple/30 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              
              <CardHeader className="relative pb-6">
                <CardTitle className="flex items-center justify-center text-white">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-r from-neon-purple to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
                      <Coins className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold block">MGC Token</span>
                      <p className="text-purple-300 text-lg font-medium">Premium Mining Coin</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pb-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-6xl font-black bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent animate-pulse-glow" data-testid="balance-mgc">
                      {miningStats.mgcBalance}
                    </span>
                    <p className="text-purple-300 text-2xl font-bold mt-3">MGC</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">Daily Mining Rate</span>
                      <span className="text-neon-purple font-bold text-lg">+12.3 MGC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">Value (USD)</span>
                      <span className="text-white font-bold text-xl">$2,468.90</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RZ Token Balance */}
            <Card className="border-2 border-mining-orange/30 bg-gradient-to-br from-mining-orange/20 to-orange-600/10 backdrop-blur-xl hover:border-mining-orange/60 transition-all duration-500 shadow-2xl hover:shadow-mining-orange/20 relative overflow-hidden transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-mining-orange/10 to-orange-600/5 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-mining-orange/30 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              
              <CardHeader className="relative pb-6">
                <CardTitle className="flex items-center justify-center text-white">
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-r from-mining-orange to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
                      <Coins className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold block">RZ Token</span>
                      <p className="text-orange-300 text-lg font-medium">Reward Zone Coin</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pb-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-6xl font-black bg-gradient-to-r from-mining-orange to-orange-400 bg-clip-text text-transparent animate-pulse-glow" data-testid="balance-rz">
                      {miningStats.rzBalance}
                    </span>
                    <p className="text-orange-300 text-2xl font-bold mt-3">RZ</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">Staking APY</span>
                      <span className="text-mining-orange font-bold text-lg">+5.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">Value (USD)</span>
                      <span className="text-white font-bold text-xl">$17,802.46</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Miners Section */}
        <div className="space-y-8">
          <ActiveMiners />
        </div>
        
      </div>
    </div>
  );
}