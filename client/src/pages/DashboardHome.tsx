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
  transactions: { value: 505, change: 35 },
  bets: { value: 1252, change: -155 },
  wins: { value: 745, change: null },
  losses: { value: 507, change: null },
  hashRate: "2.45 TH/s",
  hashRateChange: 12.5,
  power: "1,420 W",
  temperature: "72°C",
  uptime: "99.8%",
  mgcBalance: "1,234.56",
  rzBalance: "8,901.23",
  minerStatus: "Active"
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

// Main profit display
function ProfitDisplay() {
  return (
    <Card className="border border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
      <CardContent className="p-8 relative">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
            <DollarSign className="w-12 h-12 text-blue-400" />
          </div>
          <div>
            <p className="text-blue-300 text-sm font-medium tracking-wider">TOTAL PROFIT</p>
            <h1 className="text-5xl font-bold text-white mb-2">{miningStats.totalProfit.toFixed(2)}</h1>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{miningStats.transactions.value}</p>
              <p className="text-white/60 text-xs uppercase">METHODS</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{miningStats.wins.value}</p>
              <p className="text-white/60 text-xs uppercase">WINNINGS</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{miningStats.losses.value}</p>
              <p className="text-white/60 text-xs uppercase">LOSSES</p>
            </div>
          </div>
          
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">
            PLACE BET
          </Button>
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
          <ProfitDisplay />
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase">RATE</p>
                    <p className="text-lg font-bold text-white">{miningStats.transactions.value}</p>
                    <p className="text-xs text-white/40">Last month: +{miningStats.transactions.change}</p>
                  </div>
                  <div className="text-neon-purple">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-xs">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs uppercase">BETS</p>
                    <p className="text-lg font-bold text-white">{miningStats.bets.value}</p>
                    <p className="text-xs text-white/40">Down: {miningStats.bets.change}</p>
                  </div>
                  <div className="text-red-400">
                    <ArrowDownRight className="w-4 h-4" />
                    <span className="text-xs">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Balance */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white/80 text-sm">BALANCE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-white">${miningStats.totalProfit.toFixed(6)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="bg-blue-600/20 border-blue-600/50 text-blue-300 hover:bg-blue-600/30">
                    DEPOSIT
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white/80 hover:bg-white/20">
                    WITHDRAW
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mining Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                <p className="text-white/60 text-xs uppercase">MONTHLY</p>
                <p className="text-xl font-bold text-white">$142</p>
                <p className="text-xs text-white/40">CURRENT WEEK</p>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-4 text-center">
                <Cpu className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                <p className="text-white/60 text-xs uppercase">ACTIVITY</p>
                <p className="text-xl font-bold text-white">507 hours</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="bg-neon-purple h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-mining-orange mx-auto mb-2" />
                <p className="text-white/60 text-xs uppercase">ACTIVITY</p>
                <p className="text-xl font-bold text-white">45 hours</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="bg-mining-orange h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
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
          
          {/* Token Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-neon-purple/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-neon-purple to-purple-600 rounded-full"></div>
                    <span>MGC Balance</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="text-2xl font-bold text-white" data-testid="balance-mgc">
                    {miningStats.mgcBalance}
                  </span>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-white/60">Mining rate: +12.3 MGC/day</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-mining-orange/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-mining-orange to-orange-600 rounded-full"></div>
                    <span>RZ Balance</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span className="text-2xl font-bold text-white" data-testid="balance-rz">
                    {miningStats.rzBalance}
                  </span>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-white/60">Staking reward: +5.2% APY</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}