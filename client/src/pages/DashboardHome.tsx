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

// User profile data
const userProfile = {
  username: "CryptoMiner",
  greeting: "Hey dude! How are you?",
  avatar: "/api/placeholder/64/64"
};

const hashRateData = [
  { time: "00:00", hashRate: 2.2, efficiency: 94 },
  { time: "04:00", hashRate: 2.3, efficiency: 96 },
  { time: "08:00", hashRate: 2.45, efficiency: 98 },
  { time: "12:00", hashRate: 2.5, efficiency: 97 },
  { time: "16:00", hashRate: 2.4, efficiency: 95 },
  { time: "20:00", hashRate: 2.35, efficiency: 96 },
];

const earningsData = [
  { day: "Mon", mgc: 45.2, rz: 123.5 },
  { day: "Tue", mgc: 52.1, rz: 135.2 },
  { day: "Wed", mgc: 48.7, rz: 128.9 },
  { day: "Thu", mgc: 55.3, rz: 142.1 },
  { day: "Fri", mgc: 51.8, rz: 138.7 },
  { day: "Sat", mgc: 49.2, rz: 131.4 },
  { day: "Sun", mgc: 53.6, rz: 145.8 },
];

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

// Welcome section component
function WelcomeSection() {
  return (
    <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-neon-purple/50">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-mining-orange/30 text-white text-xl font-bold">
                CM
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-purple rounded-full border-2 border-black"></div>
          </div>
          <div>
            <p className="text-white/60 text-sm">WELCOME</p>
            <h2 className="text-xl font-bold text-white">{userProfile.username}</h2>
            <p className="text-white/50 text-sm">{userProfile.greeting}</p>
          </div>
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <WelcomeSection />
          <EarningsDisplay />
          
          {/* Mining Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-white/10 bg-gradient-to-br from-neon-purple/20 to-purple-600/10 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase font-medium">Hash Rate</p>
                    <p className="text-lg font-bold text-white">{miningStats.hashRate}</p>
                    <p className="text-xs text-neon-purple">+{miningStats.hashRateChange}% this hour</p>
                  </div>
                  <div className="text-neon-purple">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-gradient-to-br from-mining-orange/20 to-orange-600/10 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase font-medium">Uptime</p>
                    <p className="text-lg font-bold text-white">{miningStats.uptime}</p>
                    <p className="text-xs text-mining-orange">System healthy</p>
                  </div>
                  <div className="text-mining-orange">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Mining Performance */}
          <Card className="border border-white/10 bg-gradient-to-br from-neon-green/20 to-emerald-600/10 backdrop-blur-xl shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg font-bold flex items-center">
                <Cpu className="w-5 h-5 mr-2 text-neon-green" />
                Mining Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{miningStats.temperature}</p>
                  <p className="text-neon-green text-sm font-medium">Optimal Temperature</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Power Usage</span>
                    <span className="text-white font-medium">{miningStats.power}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Status</span>
                    <span className="text-neon-green font-medium">{miningStats.minerStatus}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mining Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-white/10 bg-gradient-to-br from-neon-purple/20 to-purple-600/10 backdrop-blur-xl shadow-lg hover:shadow-neon-purple/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-purple-300 text-sm font-medium uppercase tracking-wider">Monthly Earnings</p>
                <p className="text-3xl font-bold text-white mt-2">${miningStats.weeklyEarnings * 4}</p>
                <p className="text-neon-purple text-sm font-medium mt-1">+15% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-gradient-to-br from-mining-orange/20 to-orange-600/10 backdrop-blur-xl shadow-lg hover:shadow-mining-orange/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-mining-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <p className="text-orange-300 text-sm font-medium uppercase tracking-wider">Mining Hours</p>
                <p className="text-3xl font-bold text-white mt-2">507</p>
                <div className="w-full bg-white/20 rounded-full h-3 mt-3">
                  <div className="bg-gradient-to-r from-mining-orange to-orange-500 h-3 rounded-full shadow-md" style={{width: '75%'}}></div>
                </div>
                <p className="text-mining-orange text-sm font-medium mt-2">75% efficiency</p>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-gradient-to-br from-neon-green/20 to-emerald-600/10 backdrop-blur-xl shadow-lg hover:shadow-neon-green/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-green-300 text-sm font-medium uppercase tracking-wider">System Status</p>
                <p className="text-3xl font-bold text-white mt-2">{miningStats.uptime}</p>
                <div className="w-full bg-white/20 rounded-full h-3 mt-3">
                  <div className="bg-gradient-to-r from-neon-green to-emerald-500 h-3 rounded-full shadow-md" style={{width: '99%'}}></div>
                </div>
                <p className="text-neon-green text-sm font-medium mt-2">Excellent health</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Active Miners Section */}
          <ActiveMiners />
          
          {/* Chart */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Activity className="w-5 h-5 text-neon-purple" />
                <span>Mining Performance</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                24-hour mining activity and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hashRateData}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-white/60" />
                    <YAxis axisLine={false} tickLine={false} className="text-white/60" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="hashRate"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#areaGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Wallet Balances Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent mb-2">
                Wallet Balance
              </h2>
              <p className="text-white/80 text-lg">Your cryptocurrency holdings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* MGC Token Balance */}
              <Card className="border-2 border-neon-purple/30 bg-gradient-to-br from-neon-purple/20 to-purple-600/10 backdrop-blur-xl hover:border-neon-purple/60 transition-all duration-500 shadow-2xl hover:shadow-neon-purple/20 relative overflow-hidden">
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-purple-600/5 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neon-purple/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                <CardHeader className="relative pb-4">
                  <CardTitle className="flex items-center justify-between text-white">
                    <span className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold">MGC Token</span>
                        <p className="text-purple-300 text-sm font-medium">Premium Mining Coin</p>
                      </div>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-5xl font-black bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent animate-pulse-glow" data-testid="balance-mgc">
                        {miningStats.mgcBalance}
                      </span>
                      <p className="text-purple-300 text-lg font-medium mt-2">MGC</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">Daily Mining Rate</span>
                        <span className="text-neon-purple font-bold">+12.3 MGC</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-white/80">Value (USD)</span>
                        <span className="text-white font-bold">$2,468.90</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RZ Token Balance */}
              <Card className="border-2 border-mining-orange/30 bg-gradient-to-br from-mining-orange/20 to-orange-600/10 backdrop-blur-xl hover:border-mining-orange/60 transition-all duration-500 shadow-2xl hover:shadow-mining-orange/20 relative overflow-hidden">
                {/* Animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-mining-orange/10 to-orange-600/5 animate-pulse"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-mining-orange/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                <CardHeader className="relative pb-4">
                  <CardTitle className="flex items-center justify-between text-white">
                    <span className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-mining-orange to-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold">RZ Token</span>
                        <p className="text-orange-300 text-sm font-medium">Reward Zone Coin</p>
                      </div>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-5xl font-black bg-gradient-to-r from-mining-orange to-orange-400 bg-clip-text text-transparent animate-pulse-glow" data-testid="balance-rz">
                        {miningStats.rzBalance}
                      </span>
                      <p className="text-orange-300 text-lg font-medium mt-2">RZ</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/80">Staking APY</span>
                        <span className="text-mining-orange font-bold">+5.2%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-white/80">Value (USD)</span>
                        <span className="text-white font-bold">$17,802.46</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}