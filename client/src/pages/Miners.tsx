import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Zap, Play, Loader2 } from "lucide-react";
import { useReadContract, useAccount } from "wagmi";
import { formatUnits } from "viem";

interface MinerToken {
  symbol: string;
  name: string;
}

interface AvailableMiner {
  id: number;
  tokens: MinerToken[];
  name: string;
  staked_amount: string;
  power: number;
  is_online: boolean;
  created_at: string;
}

interface AvailableMinersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AvailableMiner[];
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

  // Fetch available miners
  const { data: minersData, isLoading } = useQuery<AvailableMinersResponse>({
    queryKey: ['/api/miners'],
  });

  const mgcMiners = minersData?.results?.filter(m => 
    m.tokens.some(t => t.symbol.toUpperCase() === 'MGC')
  ) || [];

  const rzMiners = minersData?.results?.filter(m => 
    m.tokens.some(t => t.symbol.toUpperCase() === 'RZ')
  ) || [];

  const handleStartMiner = (minerId: number, tokenSymbol: string) => {
    // TODO: Implement miner start logic
    console.log(`Starting miner ${minerId} for ${tokenSymbol}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-white to-mining-orange bg-clip-text text-transparent mb-2">
          Launch Miners
        </h1>
        <p className="text-white/60">
          Select a miner to start earning rewards. Choose based on your token balance and desired mining power.
        </p>
      </div>

      <Tabs defaultValue="mgc" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
          <TabsTrigger 
            value="mgc" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-purple-600 data-[state=active]:text-white"
            data-testid="tab-mgc-miners"
          >
            <Coins className="w-4 h-4 mr-2" />
            MGC Miners
          </TabsTrigger>
          <TabsTrigger 
            value="rz"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mining-orange data-[state=active]:to-orange-600 data-[state=active]:text-white"
            data-testid="tab-rz-miners"
          >
            <Coins className="w-4 h-4 mr-2" />
            RZ Miners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mgc" className="space-y-6 mt-6">
          <Card className="border border-neon-purple/30 bg-gradient-to-br from-purple-900/20 to-slate-900/40">
            <CardHeader>
              <CardTitle className="text-neon-purple flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Your MGC Balance
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-white">
                {mgcBalance.toFixed(1)} MGC
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {mgcMiners.length === 0 ? (
              <Card className="border border-white/10 bg-white/5">
                <CardContent className="p-8 text-center text-white/60">
                  No MGC miners available
                </CardContent>
              </Card>
            ) : (
              mgcMiners.map(miner => {
                const requiredBalance = parseFloat(miner.staked_amount) || 0;
                const canAfford = mgcBalance >= requiredBalance;
                
                return (
                  <Card 
                    key={miner.id} 
                    className={`border transition-all ${
                      canAfford 
                        ? 'border-neon-purple/50 bg-gradient-to-r from-purple-900/20 to-slate-900/40 hover:border-neon-purple' 
                        : 'border-white/10 bg-white/5 opacity-50'
                    }`}
                    data-testid={`card-miner-${miner.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-neon-purple/50">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{miner.name}</h3>
                            <p className="text-sm text-white/60 mb-2">Power: {miner.power} TH/s</p>
                            <p className="text-sm text-white/80">
                              Required: <span className="font-semibold text-neon-purple">{requiredBalance} MGC</span>
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStartMiner(miner.id, 'MGC')}
                          disabled={!canAfford}
                          className={`${
                            canAfford
                              ? 'bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/80 hover:to-purple-500'
                              : 'bg-gray-600 cursor-not-allowed'
                          } text-white px-6 py-6 text-base`}
                          data-testid={`button-start-miner-${miner.id}`}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {canAfford ? 'Start Mining' : 'Insufficient Balance'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="rz" className="space-y-6 mt-6">
          <Card className="border border-mining-orange/30 bg-gradient-to-br from-orange-900/20 to-slate-900/40">
            <CardHeader>
              <CardTitle className="text-mining-orange flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Your RZ Balance
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-white">
                {rzBalance.toFixed(1)} RZ
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {rzMiners.length === 0 ? (
              <Card className="border border-white/10 bg-white/5">
                <CardContent className="p-8 text-center text-white/60">
                  No RZ miners available
                </CardContent>
              </Card>
            ) : (
              rzMiners.map(miner => {
                const requiredBalance = parseFloat(miner.staked_amount) || 0;
                const canAfford = rzBalance >= requiredBalance;
                
                return (
                  <Card 
                    key={miner.id}
                    className={`border transition-all ${
                      canAfford 
                        ? 'border-mining-orange/50 bg-gradient-to-r from-orange-900/20 to-slate-900/40 hover:border-mining-orange' 
                        : 'border-white/10 bg-white/5 opacity-50'
                    }`}
                    data-testid={`card-miner-${miner.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-mining-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-mining-orange/50">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{miner.name}</h3>
                            <p className="text-sm text-white/60 mb-2">Power: {miner.power} TH/s</p>
                            <p className="text-sm text-white/80">
                              Required: <span className="font-semibold text-mining-orange">{requiredBalance} RZ</span>
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStartMiner(miner.id, 'RZ')}
                          disabled={!canAfford}
                          className={`${
                            canAfford
                              ? 'bg-gradient-to-r from-mining-orange to-orange-600 hover:from-mining-orange/80 hover:to-orange-500'
                              : 'bg-gray-600 cursor-not-allowed'
                          } text-white px-6 py-6 text-base`}
                          data-testid={`button-start-miner-${miner.id}`}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {canAfford ? 'Start Mining' : 'Insufficient Balance'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
