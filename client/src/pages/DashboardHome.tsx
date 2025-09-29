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
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">Mining Dashboard</h1>
            <p className="text-slate-400">Monitor your cryptocurrency mining operations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">2 Miners Active</span>
            </div>
          </div>
        </div>

        {/* Earnings Overview */}
        <EarningsDisplay />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Wallet Balances */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* MGC Balance */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">MGC Token</h3>
                      <p className="text-sm text-slate-400">Premium Mining</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Balance</p>
                    <p className="text-xl font-semibold text-white" data-testid="balance-mgc">{miningStats.mgcBalance}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">USD Value</span>
                    <span className="text-white font-medium">$2,468.90</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Daily Rate</span>
                    <span className="text-emerald-400 font-medium">+12.3 MGC</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RZ Balance */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">RZ Token</h3>
                      <p className="text-sm text-slate-400">Reward Zone</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Balance</p>
                    <p className="text-xl font-semibold text-white" data-testid="balance-rz">{miningStats.rzBalance}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">USD Value</span>
                    <span className="text-white font-medium">$17,802.46</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Staking APY</span>
                    <span className="text-emerald-400 font-medium">+5.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-slate-800">
              <CardContent className="p-6">
                <h3 className="font-medium text-white mb-4">Mining Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hash Rate</span>
                    <span className="text-white font-medium">{miningStats.hashRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Uptime</span>
                    <span className="text-emerald-400 font-medium">{miningStats.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Power Usage</span>
                    <span className="text-white font-medium">{miningStats.power}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Active Miners */}
          <div className="xl:col-span-2">
            <ActiveMiners />
          </div>
        </div>
        
      </div>
    </div>
  );
}