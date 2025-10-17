import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Loader2, Zap, TrendingUp } from "lucide-react";
import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

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

const MGC_TOKEN_ADDRESS = '0xbb73BB2505AC4643d5C0a99c2A1F34B3DfD09D11';
const RZ_TOKEN_ADDRESS = '0x6BC5AbCc56874D7fACb90C2c3812cc19aAf9B204';

export default function Miners() {
  const { address } = useAccount();
  const { toast } = useToast();
  
  // State for investment dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");

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

  // Deploy miner mutation
  const deployMinerMutation = useMutation({
    mutationFn: async ({ miner, amount, token }: { miner: number; amount: string; token: number }) => {
      return await apiRequest('POST', '/api/stakes/stake', { miner, amount, token });
    },
    onSuccess: () => {
      toast({
        title: "Miner Deployed Successfully!",
        description: "Your miner is now active and earning rewards.",
      });
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/stakes/miners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy miner. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartMiner = (plan: Plan) => {
    setSelectedPlan(plan);
    setInvestmentAmount(plan.price.toString()); // Set default to minimum investment
    setIsDialogOpen(true);
  };

  const handleDeployMiner = () => {
    if (!selectedPlan) return;

    const tokenId = selectedPlan.token_details[0]?.id;
    const tokenSymbol = selectedPlan.token_details[0]?.symbol || '';
    const userBalance = tokenSymbol === 'MGC' ? mgcBalance : rzBalance;
    const amount = parseFloat(investmentAmount);

    // Validation
    if (!tokenId) {
      toast({
        title: "Error",
        description: "Invalid token information",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(amount) || amount < selectedPlan.price) {
      toast({
        title: "Invalid Amount",
        description: `Minimum balance required is ${selectedPlan.price} ${tokenSymbol}`,
        variant: "destructive",
      });
      return;
    }

    if (amount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Your balance is ${userBalance.toFixed(2)} ${tokenSymbol}`,
        variant: "destructive",
      });
      return;
    }

    deployMinerMutation.mutate({
      miner: selectedPlan.id,
      amount: amount.toString(),
      token: tokenId,
    });

    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  // Separate plans by token
  const mgcPlans = plansData?.results?.filter(plan => plan.token_details[0]?.symbol === 'MGC') || [];
  const rzPlans = plansData?.results?.filter(plan => plan.token_details[0]?.symbol === 'RZ') || [];

  const renderPlanCard = (plan: Plan) => {
    const tokenSymbol = plan.token_details[0]?.symbol || '';
    const userBalance = tokenSymbol === 'MGC' ? mgcBalance : rzBalance;
    const canAfford = userBalance >= plan.price;
    const isMGC = tokenSymbol === 'MGC';
    
    // Determine if this is a premium/high-power miner (level 4+)
    const isPremium = plan.level >= 4;
    const isElite = plan.level >= 5;

    return (
      <Card
        key={plan.id}
        className={`group relative overflow-hidden transition-all duration-300 ${
          canAfford
            ? `${isElite ? 'border-[3px]' : isPremium ? 'border-[2.5px]' : 'border-2'} ${
                isMGC 
                  ? `border-neon-purple/${isElite ? '70' : isPremium ? '60' : '50'} hover:border-neon-purple ${isElite ? 'shadow-2xl shadow-neon-purple/40' : isPremium ? 'shadow-xl shadow-neon-purple/30' : 'shadow-lg shadow-neon-purple/20'}` 
                  : `border-mining-orange/${isElite ? '70' : isPremium ? '60' : '50'} hover:border-mining-orange ${isElite ? 'shadow-2xl shadow-mining-orange/40' : isPremium ? 'shadow-xl shadow-mining-orange/30' : 'shadow-lg shadow-mining-orange/20'}`
              } bg-gradient-to-br ${isMGC ? 'from-purple-900/30' : 'from-orange-900/30'} to-slate-900/60 hover:scale-[${isElite ? '1.03' : isPremium ? '1.025' : '1.02'}] ${
                isMGC 
                  ? isElite ? 'hover:shadow-neon-purple/50' : isPremium ? 'hover:shadow-neon-purple/40' : 'hover:shadow-neon-purple/30'
                  : isElite ? 'hover:shadow-mining-orange/50' : isPremium ? 'hover:shadow-mining-orange/40' : 'hover:shadow-mining-orange/30'
              }`
            : 'border border-white/10 bg-white/5 opacity-60 cursor-not-allowed'
        }`}
        data-testid={`card-plan-${plan.id}`}
      >
        {/* Enhanced Glow Effect for Premium Miners */}
        {canAfford && isElite && (
          <div className={`absolute inset-0 bg-gradient-to-br ${isMGC ? 'from-neon-purple/20 via-neon-purple/10' : 'from-mining-orange/20 via-mining-orange/10'} to-transparent animate-pulse`}></div>
        )}
        {/* Background Glow Effect */}
        {canAfford && !isElite && (
          <div className={`absolute inset-0 bg-gradient-to-br ${isMGC ? 'from-neon-purple/10' : 'from-mining-orange/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        )}

        <CardContent className="p-0 relative z-10">
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={plan.image}
              alt={plan.name}
              className={`w-full h-full object-cover ${canAfford ? 'group-hover:scale-110' : ''} transition-transform duration-500`}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge
                className={`${
                  isMGC
                    ? 'bg-neon-purple/90 text-white'
                    : 'bg-mining-orange/90 text-white'
                } px-3 py-1 text-xs font-bold`}
              >
                {tokenSymbol}
              </Badge>
              {isElite && canAfford && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-xs font-bold animate-pulse">
                  ⚡ ELITE
                </Badge>
              )}
              {isPremium && !isElite && canAfford && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold">
                  ★ PREMIUM
                </Badge>
              )}
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
                <span className="text-white/60 text-sm">Min Balance</span>
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
              onClick={() => handleStartMiner(plan)}
              disabled={!canAfford || deployMinerMutation.isPending}
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
              {deployMinerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {canAfford ? 'Deploy Miner' : 'Locked'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-10 px-2">
      {/* Header */}
      <div className="relative px-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="border border-neon-purple/30 bg-gradient-to-br from-purple-900/20 to-slate-900/40 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">MGC Balance</p>
                <p className="text-3xl font-bold text-neon-purple" data-testid="text-mgc-balance">{mgcBalance.toFixed(1)}</p>
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
                <p className="text-3xl font-bold text-mining-orange" data-testid="text-rz-balance">{rzBalance.toFixed(1)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-mining-orange to-orange-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token-Separated Mining Plans */}
      <Tabs defaultValue="mgc" className="w-full mt-12">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 bg-slate-900/80 border border-white/10 p-1.5 mb-2" data-testid="tabs-token-selector">
          <TabsTrigger 
            value="mgc" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-purple-600 data-[state=active]:text-white text-white/60 font-semibold transition-all duration-300"
            data-testid="tab-mgc"
          >
            <Zap className="w-4 h-4 mr-2" />
            MGC Miners ({mgcPlans.length})
          </TabsTrigger>
          <TabsTrigger 
            value="rz" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mining-orange data-[state=active]:to-orange-600 data-[state=active]:text-white text-white/60 font-semibold transition-all duration-300"
            data-testid="tab-rz"
          >
            <Zap className="w-4 h-4 mr-2" />
            RZ Miners ({rzPlans.length})
          </TabsTrigger>
        </TabsList>

        {/* MGC Miners Tab */}
        <TabsContent value="mgc" className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {mgcPlans.map((plan) => renderPlanCard(plan))}
          </div>
          {mgcPlans.length === 0 && (
            <Card className="border border-white/10 bg-white/5">
              <CardContent className="p-12 text-center">
                <p className="text-white/60 text-lg">No MGC mining plans available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* RZ Miners Tab */}
        <TabsContent value="rz" className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {rzPlans.map((plan) => renderPlanCard(plan))}
          </div>
          {rzPlans.length === 0 && (
            <Card className="border border-white/10 bg-white/5">
              <CardContent className="p-12 text-center">
                <p className="text-white/60 text-lg">No RZ mining plans available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Investment Amount Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent">
              Deploy {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Enter the amount you want to invest in this miner
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6 py-4">
              {/* Miner Info */}
              <div className="bg-white/5 rounded-lg p-4 space-y-2 border border-white/10">
                <div className="flex justify-between">
                  <span className="text-white/60">Token</span>
                  <span className="font-semibold text-white">{selectedPlan.token_details[0]?.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Min Balance</span>
                  <span className="font-semibold text-white">{selectedPlan.price} {selectedPlan.token_details[0]?.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Your Balance</span>
                  <span className={`font-semibold ${selectedPlan.token_details[0]?.symbol === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'}`}>
                    {(selectedPlan.token_details[0]?.symbol === 'MGC' ? mgcBalance : rzBalance).toFixed(2)} {selectedPlan.token_details[0]?.symbol}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="investment-amount" className="text-white">Investment Amount</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  placeholder={`Min: ${selectedPlan.price}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-neon-purple"
                  data-testid="input-investment-amount"
                  min={selectedPlan.price}
                  max={selectedPlan.token_details[0]?.symbol === 'MGC' ? mgcBalance : rzBalance}
                  step="0.01"
                />
                <p className="text-xs text-white/50">
                  You can invest between {selectedPlan.price} and {(selectedPlan.token_details[0]?.symbol === 'MGC' ? mgcBalance : rzBalance).toFixed(2)} {selectedPlan.token_details[0]?.symbol}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-cancel-deploy"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeployMiner}
              disabled={deployMinerMutation.isPending}
              className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/80 hover:to-purple-500 text-white"
              data-testid="button-confirm-deploy"
            >
              {deployMinerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Deploy Miner
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
