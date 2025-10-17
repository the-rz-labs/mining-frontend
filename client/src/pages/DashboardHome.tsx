import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveMiners } from "@/components/ActiveMiners";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { useQuery } from "@tanstack/react-query";
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

// Token addresses
const MGC_TOKEN_ADDRESS = '0xbb73BB2505AC4643d5C0a99c2A1F34B3DfD09D11';
const RZ_TOKEN_ADDRESS = '0x6BC5AbCc56874D7fACb90C2c3812cc19aAf9B204';

// ERC20 ABI for balanceOf function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;



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



interface ApiMinerResponse {
  total_power: number;
  total_staked: string;
  active_miners: number;
  earnings_summary: {
    symbol: string;
    total_accrued: string;
    total_withdrawn: string;
    pending: string;
  }[];
  miners: {
    miner_id: number;
    miner_name: string;
    is_online: boolean;
    plan_level: number;
    power: number;
    symbol: string;
    decimals: number;
    staked_amount: string;
    rate_percent: number;
    earning_per_second: string;
    active_since: string;
    seconds_active: number;
    accrued_reward_until_now: string;
  }[];
}

export default function DashboardHome() {
  const { address, isConnected } = useAccount();
  
  // Fetch MGC token decimals
  const { data: mgcDecimals } = useReadContract({
    address: MGC_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  // Fetch RZ token decimals
  const { data: rzDecimals } = useReadContract({
    address: RZ_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });
  
  // Fetch MGC token balance
  const { data: mgcBalance } = useReadContract({
    address: MGC_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Fetch RZ token balance
  const { data: rzBalance } = useReadContract({
    address: RZ_TOKEN_ADDRESS as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Fetch miners data for total earnings
  const { data: apiMinersResponse } = useQuery<ApiMinerResponse>({
    queryKey: ['/api/stakes/miners'],
    refetchInterval: 5000
  });

  // Get total earnings from earnings_summary
  const mgcEarnings = apiMinersResponse?.earnings_summary?.find(e => e.symbol.toUpperCase() === 'MGC');
  const rzEarnings = apiMinersResponse?.earnings_summary?.find(e => e.symbol.toUpperCase() === 'RZ');
  
  const totalEarnedMGC = mgcEarnings ? parseFloat(mgcEarnings.total_accrued) : 0;
  const totalEarnedRZ = rzEarnings ? parseFloat(rzEarnings.total_accrued) : 0;

  // Format token balances using actual decimals from contracts
  const formattedMGCBalance = mgcBalance && mgcDecimals !== undefined
    ? formatUnits(mgcBalance as bigint, Number(mgcDecimals)) 
    : '0.00';
  const formattedRZBalance = rzBalance && rzDecimals !== undefined
    ? formatUnits(rzBalance as bigint, Number(rzDecimals)) 
    : '0.00';

  // Format to 1 decimal place for display
  const displayMGCBalance = parseFloat(formattedMGCBalance).toFixed(1);
  const displayRZBalance = parseFloat(formattedRZBalance).toFixed(1);

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
        </div>


        {/* Summary Cards - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-slide-in-left">
          
          {/* MGC Balance */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-neon-purple/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-purple-600/5"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">MGC Wallet</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent" data-testid="balance-mgc">{displayMGCBalance}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RZ Balance */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-mining-orange/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mining-orange/10 to-orange-600/5"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-mining-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">RZ Wallet</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-mining-orange to-orange-400 bg-clip-text text-transparent" data-testid="balance-rz">{displayRZBalance}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Earnings Display */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-neon-green/20 relative overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-emerald-600/5"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-white/60 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-neon-green" />
                    Total Earned
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-neon-purple font-bold text-lg" data-testid="total-earned-mgc">{totalEarnedMGC.toFixed(4)}</span>
                      <span className="text-neon-purple/60 text-xs ml-1">MGC</span>
                    </div>
                    <div className="h-6 w-px bg-white/20"></div>
                    <div>
                      <span className="text-mining-orange font-bold text-lg" data-testid="total-earned-rz">{totalEarnedRZ.toFixed(4)}</span>
                      <span className="text-mining-orange/60 text-xs ml-1">RZ</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Miners Section - Full Width */}
        <div className="animate-slide-in-right">
          <ActiveMiners mgcBalance={displayMGCBalance} rzBalance={displayRZBalance} />
        </div>
        
      </div>
    </div>
  );
}