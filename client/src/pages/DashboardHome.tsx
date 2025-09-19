import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  Battery
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

// Mock mining data
const miningStats = {
  hashRate: "2.45 TH/s",
  hashRateChange: 12.5,
  power: "1,420 W",
  efficiency: "0.58 J/GH",
  temperature: "72°C",
  uptime: "99.8%",
  totalEarnings: "$2,847.23",
  todayEarnings: "$12.45",
  mgcBalance: "1,234.56",
  rzBalance: "8,901.23",
  poolConnection: "Connected",
  minerStatus: "Active"
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
                  <TrendingUp className="w-4 h-4 text-neon-green" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${change > 0 ? 'text-neon-green' : 'text-red-500'}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-lg flex items-center justify-center border border-white/10">
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
    green: "text-neon-green bg-neon-green/20 border-neon-green/50",
    orange: "text-mining-orange bg-mining-orange/20 border-mining-orange/50",
    red: "text-red-500 bg-red-500/20 border-red-500/50"
  };

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${color === 'green' ? 'text-neon-green' : color === 'orange' ? 'text-mining-orange' : 'text-red-500'}`} />
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Mining Dashboard
        </h1>
        <p className="text-white/60">
          Monitor your mining operations and earnings in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Hash Rate"
          value={miningStats.hashRate}
          change={miningStats.hashRateChange}
          icon={Cpu}
          data-testid="card-hashrate"
        />
        <StatCard
          title="Power Usage"
          value={miningStats.power}
          icon={Zap}
          data-testid="card-power"
        />
        <StatCard
          title="Today's Earnings"
          value={miningStats.todayEarnings}
          icon={DollarSign}
          data-testid="card-earnings-today"
        />
        <StatCard
          title="Total Earnings"
          value={miningStats.totalEarnings}
          icon={TrendingUp}
          data-testid="card-earnings-total"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Miner Status"
          status={miningStats.minerStatus}
          icon={Activity}
          color="green"
          data-testid="status-miner"
        />
        <StatusCard
          title="Pool Connection"
          status={miningStats.poolConnection}
          icon={Wifi}
          color="green"
          data-testid="status-pool"
        />
        <StatusCard
          title="Temperature"
          status={miningStats.temperature}
          icon={Thermometer}
          color="orange"
          data-testid="status-temperature"
        />
        <StatusCard
          title="Uptime"
          status={miningStats.uptime}
          icon={Clock}
          color="green"
          data-testid="status-uptime"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hash Rate Chart */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Cpu className="w-5 h-5 text-neon-purple" />
              <span>Hash Rate Performance</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              24-hour hash rate and efficiency monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hashRateData}>
                  <defs>
                    <linearGradient id="hashRateGradient" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#hashRateGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Token Earnings Chart */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <DollarSign className="w-5 h-5 text-neon-green" />
              <span>Weekly Earnings</span>
            </CardTitle>
            <CardDescription className="text-white/60">
              MGC and RZ token earnings over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-white/60" />
                  <YAxis axisLine={false} tickLine={false} className="text-white/60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mgc" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    name="MGC"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rz" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="RZ"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-neon-purple/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-purple-600 rounded-full"></div>
                <span>MGC Balance</span>
              </span>
              <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                Mining
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white" data-testid="balance-mgc">
                  {miningStats.mgcBalance}
                </span>
                <span className="text-white/60">MGC</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-white/60">
                Mining rate: +12.3 MGC/day
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-neon-green/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-green-600 rounded-full"></div>
                <span>RZ Balance</span>
              </span>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
                Staking
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white" data-testid="balance-rz">
                  {miningStats.rzBalance}
                </span>
                <span className="text-white/60">RZ</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-sm text-white/60">
                Staking reward: +5.2% APY
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}