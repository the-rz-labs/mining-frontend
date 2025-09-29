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
  totalMiners: 1,
  activeMiners: 1,
  hashRate: "2.45 TH/s",
  hashRateChange: 12.5,
  power: "1,420 W",
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



export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4 sm:p-6 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/20 to-neon-green/20 rounded-full blur-3xl animate-float opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/15 to-neon-purple/15 rounded-full blur-3xl animate-breathing opacity-50" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-neon-green/15 to-mining-orange/15 rounded-full blur-3xl animate-float opacity-40 hidden lg:block" style={{ animationDelay: "4s" }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="animate-slide-in-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent mb-2 sm:mb-3">Mining Dashboard</h1>
            <p className="text-white/70 text-sm sm:text-base lg:text-lg">Monitor your cryptocurrency mining operations</p>
          </div>
          <div className="flex items-center gap-4 animate-slide-in-right">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 sm:px-4 py-2 shadow-lg">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50"></div>
              <span className="text-xs sm:text-sm text-white/80 font-medium">1 Miner Active</span>
            </div>
          </div>
        </div>


        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Token Balance Cards */}
          <div className="lg:col-span-1 space-y-4 animate-slide-in-left">
            
            {/* MGC Balance */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-neon-purple/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-purple-600/5"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">MGC Token</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Wallet Balance</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent" data-testid="balance-mgc">{miningStats.mgcBalance}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">USD Value</span>
                    <span className="text-white font-bold">$2,468.90</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RZ Balance */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-mining-orange/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mining-orange/10 to-orange-600/5"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-mining-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">RZ Token</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/60">Wallet Balance</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-mining-orange to-orange-400 bg-clip-text text-transparent" data-testid="balance-rz">{miningStats.rzBalance}</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">USD Value</span>
                    <span className="text-white font-bold">$17,802.46</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Earnings Display */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-neon-green/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-emerald-600/5"></div>
              <CardContent className="p-6 relative">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-neon-green" />
                  Earnings Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-white/70 font-medium">Total Earned</span>
                    <span className="text-neon-green font-bold text-lg">$1,247.83</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-white/70 font-medium">Total Claimed</span>
                    <span className="text-blue-400 font-bold text-lg">$985.30</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-white/70 font-medium">Pending</span>
                    <span className="text-mining-orange font-bold text-lg">$262.53</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Miners Section */}
          <div className="lg:col-span-3 animate-slide-in-right">
            <ActiveMiners />
          </div>
        </div>
        
      </div>
    </div>
  );
}