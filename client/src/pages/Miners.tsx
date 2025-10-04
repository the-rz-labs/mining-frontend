import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, Zap, TrendingUp } from "lucide-react";
import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";

interface TokenDetail {
  id: number;
  symbol: string;
  name: string;
}

interface Plan {
  id: number;
  name: string;
  level: number;
  power: number;
  price: number;
  tokens: number[];
  token_details: TokenDetail[];
  image: string;
  monthly_reward_percent: string;
  video_url: string;
}

interface PlansResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Plan[];
}

const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const MGC_TOKEN_ADDRESS = "0xa5b2324c9d9EBa3Bf7A392bEf64F56cC3061D1a8";
const RZ_TOKEN_ADDRESS = "0x1B1052b305a30a9F4d77B53e0d09772a920c5A23";

export default function Miners() {
  const { address } = useAccount();

  // Fetch MGC balance
  const { data: mgcBalanceData } = useReadContract({
    address: MGC_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 56,
  });

  const { data: mgcDecimalsData } = useReadContract({
    address: MGC_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: 56,
  });

  // Fetch RZ balance
  const { data: rzBalanceData } = useReadContract({
    address: RZ_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: 56,
  });

  const { data: rzDecimalsData } = useReadContract({
    address: RZ_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: 56,
  });

  const mgcBalance = mgcBalanceData && mgcDecimalsData
    ? parseFloat(formatUnits(mgcBalanceData, mgcDecimalsData))
    : 0;

  const rzBalance = rzBalanceData && rzDecimalsData
    ? parseFloat(formatUnits(rzBalanceData, rzDecimalsData))
    : 0;

  // Fetch available plans
  const { data: plansData, isLoading } = useQuery<PlansResponse>({
    queryKey: ['/api/plans'],
  });

  const handleStartMiner = (planId: number, tokenSymbol: string) => {
    // TODO: Implement miner start logic
    console.log(`Starting plan ${planId} for ${tokenSymbol}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-transparent to-mining-orange/20 blur-3xl"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-purple via-white to-mining-orange bg-clip-text text-transparent mb-3">
            Launch Your Miners
          </h1>
          <p className="text-white/70 text-lg">
            Select a mining plan to start earning rewards. Your balance determines which miners you can deploy.
          </p>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-neon-purple/30 bg-gradient-to-br from-purple-900/20 to-slate-900/40 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">MGC Balance</p>
                <p className="text-3xl font-bold text-neon-purple">{mgcBalance.toFixed(1)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-neon-purple to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-mining-orange/30 bg-gradient-to-br from-orange-900/20 to-slate-900/40 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">RZ Balance</p>
                <p className="text-3xl font-bold text-mining-orange">{rzBalance.toFixed(1)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-mining-orange to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mining Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plansData?.results?.map((plan) => {
          const tokenSymbol = plan.token_details[0]?.symbol || '';
          const userBalance = tokenSymbol === 'MGC' ? mgcBalance : rzBalance;
          const canAfford = userBalance >= plan.price;
          const isMGC = tokenSymbol === 'MGC';

          return (
            <Card
              key={plan.id}
              className={`group relative overflow-hidden transition-all duration-300 ${
                canAfford
                  ? `border-2 ${isMGC ? 'border-neon-purple/50 hover:border-neon-purple' : 'border-mining-orange/50 hover:border-mining-orange'} bg-gradient-to-br ${isMGC ? 'from-purple-900/30' : 'from-orange-900/30'} to-slate-900/60 hover:scale-[1.02] shadow-lg ${isMGC ? 'hover:shadow-neon-purple/30' : 'hover:shadow-mining-orange/30'}`
                  : 'border border-white/10 bg-white/5 opacity-60 cursor-not-allowed'
              }`}
              data-testid={`card-plan-${plan.id}`}
            >
              {/* Background Glow Effect */}
              {canAfford && (
                <div className={`absolute inset-0 bg-gradient-to-br ${isMGC ? 'from-neon-purple/10' : 'from-mining-orange/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              )}

              <CardContent className="p-0 relative z-10">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className={`w-full h-full object-cover ${canAfford ? 'group-hover:scale-110' : ''} transition-transform duration-500`}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`${
                        isMGC
                          ? 'bg-neon-purple/90 text-white'
                          : 'bg-mining-orange/90 text-white'
                      } px-3 py-1 text-xs font-bold`}
                    >
                      {tokenSymbol}
                    </Badge>
                  </div>
                  {!canAfford && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-red-500/90 text-white px-4 py-2">
                        Insufficient Balance
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-4">
                  {/* Title and Level */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-white/60 text-sm">Level {plan.level}</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Power</span>
                      <span className="text-white font-semibold">{plan.power} TH/s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Price</span>
                      <span className={`font-bold ${isMGC ? 'text-neon-purple' : 'text-mining-orange'}`}>
                        {plan.price} {tokenSymbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Monthly Reward</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 font-semibold">{plan.monthly_reward_percent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleStartMiner(plan.id, tokenSymbol)}
                    disabled={!canAfford}
                    className={`w-full ${
                      canAfford
                        ? `${isMGC 
                            ? 'bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/80 hover:to-purple-500' 
                            : 'bg-gradient-to-r from-mining-orange to-orange-600 hover:from-mining-orange/80 hover:to-orange-500'
                          } text-white shadow-lg`
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    } font-semibold py-6 transition-all duration-300`}
                    data-testid={`button-start-plan-${plan.id}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {canAfford ? 'Deploy Miner' : 'Locked'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {!isLoading && (!plansData?.results || plansData.results.length === 0) && (
        <Card className="border border-white/10 bg-white/5">
          <CardContent className="p-12 text-center">
            <p className="text-white/60 text-lg">No mining plans available at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
