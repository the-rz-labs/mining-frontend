import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { 
  Play, 
  Activity,
  Clock,
  TrendingUp,
  Coins,
  Zap,
  StopCircle,
  Rocket,
  Sparkles,
  X,
  RefreshCw,
  Loader2
} from "lucide-react";

interface RestakeSignature {
  symbol: string;
  to: string;
  token: string;
  amount_scaled: string;
  nonce: number;
  deadline: number;
  signature: string;
  chain_id: number;
  verifying_contract: string;
  intent_id: number;
  expires_in_seconds: number;
}

const CLAIM_ABI = [
  {
    type: "function",
    name: "claim",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "signature", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
] as const;

interface MinerData {
  id: number;
  stakeId: number;
  name: string;
  token: string;
  status: boolean;
  statusReason?: string;
  autoPaused?: boolean;
  baseRate: number;
  effectiveRate: number;
  bonusMultiplier: number;
  bonusPercentage: number;
  bonusBreakdown: {
    referral_active_count: number;
    referral_bonus_bp: number;
    badge_bonus_bp: number;
    total_bonus_bp: number;
    cap_bp: number;
  };
  tokensEarned: number;
  workingTime: string;
  power: number;
  stakedAmount: number;
  earningPerSecond: number;
  planLevel: number;
  videoUrl?: string;
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
    stake_id: number;
    miner_id: number;
    miner_name: string;
    is_online: boolean;
    status_reason?: string;
    auto_paused?: boolean;
    plan_level: number;
    power: number;
    symbol: string;
    decimals: number;
    staked_amount: string;
    base_rate_percent: string;
    effective_rate_percent: string;
    bonus_multiplier: string;
    bonus_breakdown: {
      referral_active_count: number;
      referral_bonus_bp: number;
      badge_bonus_bp: number;
      total_bonus_bp: number;
      cap_bp: number;
    };
    earning_per_second: string;
    active_since: string;
    seconds_active: number;
    accrued_reward_until_now: string;
    video_url: string;
  }[];
}

interface ActiveEnergyBoost {
  id: number;
  definition: number;
  definition_name: string;
  definition_image: string;
  miner: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

interface ActiveRewardsResponse {
  energy_boosts: ActiveEnergyBoost[];
  miner_accesses: unknown[];
}

function formatTimeRemaining(endDate: string): string {
  const end = new Date(endDate);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Expired";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  }
  return `${diffMinutes}m`;
}

// Helper function to format time duration
function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
  
  return parts.join(' ');
}

// Convert API miner data to component format
function convertApiMinerToMinerData(apiMiner: ApiMinerResponse['miners'][0]): MinerData {
  // Calculate working time from seconds_active
  const workingTime = formatDuration(apiMiner.seconds_active);
  
  // Calculate effective rate correctly: base_rate + (total_bonus_bp / 100)
  // Example: 1% base + 1 bp = 1% + 0.01% = 1.01%
  const baseRate = parseFloat(apiMiner.base_rate_percent);
  const bonusBp = apiMiner.bonus_breakdown.total_bonus_bp;
  const bonusPercentage = bonusBp / 100; // 1 bp = 0.01%
  const effectiveRate = baseRate + bonusPercentage;
  
  return {
    id: apiMiner.miner_id,
    stakeId: apiMiner.stake_id,
    name: apiMiner.miner_name,
    token: apiMiner.symbol,
    status: apiMiner.is_online,
    statusReason: apiMiner.status_reason,
    autoPaused: apiMiner.auto_paused,
    baseRate: baseRate,
    effectiveRate: effectiveRate,
    bonusMultiplier: parseFloat(apiMiner.bonus_multiplier),
    bonusPercentage: bonusPercentage,
    bonusBreakdown: apiMiner.bonus_breakdown,
    tokensEarned: parseFloat(apiMiner.accrued_reward_until_now),
    workingTime,
    power: apiMiner.power,
    stakedAmount: parseFloat(apiMiner.staked_amount),
    earningPerSecond: parseFloat(apiMiner.earning_per_second),
    planLevel: apiMiner.plan_level,
    videoUrl: apiMiner.video_url
  };
}

export function ActiveMiners({ mgcBalance, rzBalance }: { mgcBalance: string; rzBalance: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [selectedMinerId, setSelectedMinerId] = useState<number | null>(null);
  const [showRestakeDialog, setShowRestakeDialog] = useState(false);
  const [restakingMiner, setRestakingMiner] = useState<MinerData | null>(null);
  const [restakeSignature, setRestakeSignature] = useState<RestakeSignature | null>(null);
  const { toast } = useToast();
  const token = localStorage.getItem('auth_token');

  // Wagmi hooks for restake transaction
  const { 
    writeContract: writeRestakeContract, 
    data: restakeTxHash, 
    isPending: isRestakeContractPending,
    error: restakeWriteError,
    reset: resetRestakeContract
  } = useWriteContract();

  const { 
    isLoading: isRestakeTxConfirming, 
    isSuccess: isRestakeTxSuccess,
    error: restakeTxError 
  } = useWaitForTransactionReceipt({
    hash: restakeTxHash,
  });

  // Fetch available turbos
  const { data: activeRewards } = useQuery<ActiveRewardsResponse>({
    queryKey: ['/api/events/rewards/active'],
    queryFn: async () => {
      const response = await fetch('/api/events/rewards/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch active rewards');
      }
      return response.json();
    },
    enabled: !!token,
    refetchInterval: 30000
  });

  const availableTurbos = activeRewards?.energy_boosts?.filter(boost => boost.miner === null) || [];
  const activeTurbosForMiner = (minerId: number) => 
    activeRewards?.energy_boosts?.filter(boost => boost.miner === minerId) || [];

  // Mutation for activating a turbo
  const activateTurboMutation = useMutation({
    mutationFn: async ({ rewardId, minerId }: { rewardId: number; minerId: number }) => {
      const response = await fetch(`/api/events/rewards/${rewardId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ miner_id: minerId })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to activate turbo');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/rewards/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stakes/miners'] });
      toast({
        title: "Turbo Activated!",
        description: "Your miner is now supercharged with extra mining power.",
      });
      setShowBoostDialog(false);
      setSelectedMinerId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Activation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleBoostClick = (minerId: number) => {
    setSelectedMinerId(minerId);
    setShowBoostDialog(true);
  };

  const handleTurboSelect = (turboId: number) => {
    if (selectedMinerId) {
      activateTurboMutation.mutate({ rewardId: turboId, minerId: selectedMinerId });
    }
  };

  // Mutation for stopping a miner
  const stopMinerMutation = useMutation({
    mutationFn: async (stakeId: number) => {
      return await apiRequest('PATCH', `/api/stakes/stake/${stakeId}`, { is_active: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stakes/miners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      toast({
        title: "Miner Stopped Successfully!",
        description: "Your miner has been stopped and rewards are ready to claim.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Stop Miner",
        description: error?.message || "An error occurred while stopping the miner",
        variant: "destructive",
      });
    },
  });

  // Mutation for initiating restake
  const restakeMutation = useMutation({
    mutationFn: async ({ stakeId, symbol }: { stakeId: number; symbol: string }) => {
      const response = await apiRequest('POST', '/api/restake/initiate', { stake_id: stakeId, symbol });
      return response as { success: boolean; tx: RestakeSignature };
    },
    onSuccess: (data) => {
      if (data.success && data.tx) {
        setRestakeSignature(data.tx);
        executeRestakeContract(data.tx);
      } else {
        throw new Error("Invalid restake response");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Restake Failed",
        description: error.message || "Failed to initiate restake. Please try again.",
        variant: "destructive",
      });
      closeRestakeDialog();
    },
  });

  // Execute restake contract call
  const executeRestakeContract = (signature: RestakeSignature) => {
    try {
      if (!signature.signature || !signature.token || !signature.amount_scaled || !signature.deadline || !signature.verifying_contract) {
        throw new Error("Invalid signature data received");
      }
      
      const formattedSignature = signature.signature.startsWith('0x') 
        ? signature.signature 
        : `0x${signature.signature}`;
      
      writeRestakeContract({
        address: signature.verifying_contract as `0x${string}`,
        abi: CLAIM_ABI,
        functionName: "claim",
        args: [
          signature.token as `0x${string}`,
          BigInt(signature.amount_scaled),
          BigInt(signature.deadline),
          formattedSignature as `0x${string}`
        ],
        chainId: signature.chain_id,
      });
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to execute restake transaction.",
        variant: "destructive",
      });
      closeRestakeDialog();
    }
  };

  // Handle restake button click
  const handleRestakeClick = (miner: MinerData) => {
    setRestakingMiner(miner);
    setShowRestakeDialog(true);
    restakeMutation.mutate({ stakeId: miner.stakeId, symbol: miner.token });
  };

  // Close restake dialog and reset state
  const closeRestakeDialog = () => {
    setShowRestakeDialog(false);
    setRestakingMiner(null);
    setRestakeSignature(null);
    resetRestakeContract();
  };

  // Handle restake transaction success
  useEffect(() => {
    if (isRestakeTxSuccess && restakingMiner) {
      toast({
        title: "Restake Successful!",
        description: `Your ${restakingMiner.token} earnings have been restaked to your miner.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stakes/miners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      closeRestakeDialog();
    }
  }, [isRestakeTxSuccess, restakingMiner]);

  // Handle restake transaction errors
  useEffect(() => {
    if (restakeWriteError) {
      toast({
        title: "Transaction Rejected",
        description: "You rejected the transaction in your wallet.",
        variant: "destructive",
      });
      closeRestakeDialog();
    }
  }, [restakeWriteError]);

  useEffect(() => {
    if (restakeTxError) {
      toast({
        title: "Transaction Failed",
        description: "The transaction failed on the blockchain. Please try again.",
        variant: "destructive",
      });
      closeRestakeDialog();
    }
  }, [restakeTxError]);

  const isRestakeProcessing = restakeMutation.isPending || isRestakeContractPending || isRestakeTxConfirming;
  
  // Fetch miners data from API
  const { data: apiResponse, isLoading } = useQuery<ApiMinerResponse>({
    queryKey: ['/api/stakes/miners'],
    refetchInterval: 5000 // Refresh every 5 seconds for live updates
  });

  // Convert API data to component format (now includes video URLs from the miners API)
  // Filter to show only online miners on dashboard
  const activeMiners = (apiResponse?.miners?.map(convertApiMinerToMinerData) || [])
    .filter(miner => miner.status);

  // Update current time for display purposes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-white/60">Loading miners...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Active Miners Grid */}
      {activeMiners.length > 0 ? (
        <div className="space-y-6">
          {activeMiners.map((miner) => (
            <Card 
              key={miner.id}
              className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-neon-purple/20 relative overflow-hidden"
              data-testid={`active-miner-${miner.token.toLowerCase()}`}
            >
              {/* Animated background effects */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                miner.token === 'MGC' 
                  ? 'from-neon-purple/10 to-purple-600/5' 
                  : 'from-mining-orange/10 to-orange-600/5'
              } transition-all duration-1000`}></div>
              
              <CardContent className="p-0 relative">
                {/* Mobile Layout - Stacked */}
                <div className="lg:hidden">
                  {/* Video Section - Mobile */}
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {miner.videoUrl && (
                        <video 
                          src={miner.videoUrl}
                          autoPlay
                          loop
                          muted
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Status overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                        <div className="absolute top-4 left-4">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm ${
                            miner.status
                              ? miner.token === 'MGC' 
                                ? 'bg-neon-purple/80 border border-neon-purple/50' 
                                : 'bg-mining-orange/80 border border-mining-orange/50'
                              : 'bg-orange-500/80 border border-orange-500/50'
                          } text-white text-sm font-medium shadow-lg`}>
                            <div className={`w-2 h-2 rounded-full ${
                              miner.status ? 'bg-neon-green animate-pulse shadow-lg shadow-neon-green/50' : 'bg-orange-400'
                            }`}></div>
                            {miner.status ? `${miner.token} Mining` : 'Offline'}
                          </div>
                          {!miner.status && miner.statusReason && (
                            <div className="mt-2 text-xs text-orange-300 bg-black/60 px-2 py-1 rounded backdrop-blur-sm max-w-[200px]">
                              {miner.statusReason}
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute bottom-4 left-4">
                          <div className="text-white">
                            <div className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                              {miner.effectiveRate.toFixed(2)}% Rate
                              {miner.bonusBreakdown.total_bonus_bp > 0 && (
                                <span className="ml-2 text-xs text-neon-green">
                                  +{(miner.bonusBreakdown.total_bonus_bp / 100).toFixed(2)}%
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-white/80 font-medium">
                              {miner.status ? 'Active Mining' : miner.autoPaused ? 'Auto Paused' : 'Paused'}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* Stats Section - Mobile */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-3 ${
                          miner.status ? 'bg-neon-green animate-pulse shadow-lg shadow-neon-green/50' : 'bg-white/40'
                        }`}></span>
                        {miner.name}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          miner.status 
                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                        }`}>
                          {miner.status ? 'ONLINE' : 'OFFLINE'}
                        </div>
                        {!miner.status && miner.statusReason && (
                          <div className="text-xs text-orange-400/80 max-w-[200px] text-right">
                            {miner.statusReason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-neon-green" />
                          <span className="text-white/80 font-medium">Working Time</span>
                        </div>
                        <span className="text-white font-bold">{miner.workingTime}</span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-neon-purple" />
                          <span className="text-white/80 font-medium">Mining Rate</span>
                        </div>
                        <div className="text-right">
                          {miner.bonusBreakdown.total_bonus_bp > 0 ? (
                            <>
                              <div className="text-white font-bold">
                                {miner.effectiveRate.toFixed(2)}%
                                <span className="ml-1 text-xs text-neon-green">
                                  (+{(miner.bonusBreakdown.total_bonus_bp / 100).toFixed(2)}%)
                                </span>
                              </div>
                              <div className="text-xs text-white/50">Base: {miner.baseRate}%</div>
                              {(miner.bonusBreakdown.referral_bonus_bp > 0 || miner.bonusBreakdown.badge_bonus_bp > 0) && (
                                <div className="text-xs text-white/40 mt-0.5">
                                  {miner.bonusBreakdown.referral_bonus_bp > 0 && `Referral: +${(miner.bonusBreakdown.referral_bonus_bp / 100).toFixed(2)}%`}
                                  {miner.bonusBreakdown.referral_bonus_bp > 0 && miner.bonusBreakdown.badge_bonus_bp > 0 && ' • '}
                                  {miner.bonusBreakdown.badge_bonus_bp > 0 && `Badge: +${(miner.bonusBreakdown.badge_bonus_bp / 100).toFixed(2)}%`}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-white font-bold">{miner.baseRate}%</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Coins className="w-4 h-4 text-mining-orange" />
                          <span className="text-white/80 font-medium">Staked Amount</span>
                        </div>
                        <span className="text-white font-bold">{miner.stakedAmount.toFixed(2)} {miner.token}</span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Zap className="w-4 h-4 text-neon-green" />
                          <span className="text-white/80 font-medium">Hashrate</span>
                        </div>
                        <span className="text-white font-bold">{miner.power} TH/s</span>
                      </div>

                      <div className={`rounded-xl p-4 relative overflow-hidden ${
                        miner.token === 'MGC' 
                          ? 'bg-gradient-to-br from-purple-900/40 to-purple-600/20 border-2 border-neon-purple/50' 
                          : 'bg-gradient-to-br from-orange-900/40 to-orange-600/20 border-2 border-mining-orange/50'
                      } backdrop-blur-sm shadow-lg ${
                        miner.status ? 'animate-pulse-glow' : ''
                      }`}>
                        {/* Animated background particles for online miners */}
                        {miner.status && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className={`absolute w-2 h-2 rounded-full ${
                              miner.token === 'MGC' ? 'bg-neon-purple' : 'bg-mining-orange'
                            } opacity-60 animate-float`} style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
                            <div className={`absolute w-1 h-1 rounded-full ${
                              miner.token === 'MGC' ? 'bg-neon-purple' : 'bg-mining-orange'
                            } opacity-40 animate-float`} style={{ top: '60%', left: '80%', animationDelay: '1s' }}></div>
                            <div className={`absolute w-1.5 h-1.5 rounded-full ${
                              miner.token === 'MGC' ? 'bg-neon-purple' : 'bg-mining-orange'
                            } opacity-50 animate-float`} style={{ top: '40%', left: '90%', animationDelay: '2s' }}></div>
                          </div>
                        )}
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Coins className={`w-5 h-5 ${
                                miner.token === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'
                              } ${miner.status ? 'animate-pulse' : ''}`} />
                              <span className="text-white font-bold">Live Earnings</span>
                            </div>
                            {miner.status && miner.earningPerSecond > 0 && (
                              <div className="text-xs text-neon-green font-medium bg-neon-green/10 px-2 py-1 rounded-full border border-neon-green/30 animate-pulse">
                                +{(miner.earningPerSecond * 60).toFixed(8)}/min
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-2xl font-bold mb-1 ${
                              miner.token === 'MGC' 
                                ? 'text-neon-purple' 
                                : 'text-mining-orange'
                            } drop-shadow-[0_0_8px_currentColor]`}>
                              <AnimatedCounter 
                                value={miner.tokensEarned} 
                                decimals={8}
                                duration={800}
                                earningPerSecond={miner.status ? miner.earningPerSecond : 0}
                                isOnline={miner.status}
                              />
                            </div>
                            <div className="text-sm text-white/80 font-medium">{miner.token}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Active Turbo Indicator */}
                      {activeTurbosForMiner(miner.id).length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-mining-orange/20 to-mining-orange/5 border border-mining-orange/30">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Rocket className="w-4 h-4 text-mining-orange animate-pulse" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-mining-orange rounded-full animate-ping" />
                            </div>
                            <span className="text-xs font-medium text-mining-orange">Turbo Active</span>
                            <span className="text-xs text-white/50 ml-auto">
                              {formatTimeRemaining(activeTurbosForMiner(miner.id)[0].ends_at)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-3">
                        {availableTurbos.length > 0 && (
                          <Button
                            onClick={() => handleBoostClick(miner.id)}
                            className="flex-1 h-12 bg-gradient-to-r from-mining-orange to-amber-500 hover:from-mining-orange/90 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-mining-orange/30 transition-all duration-300"
                            data-testid={`button-boost-${miner.token.toLowerCase()}`}
                          >
                            <Rocket className="w-5 h-5 mr-2" />
                            Boost
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRestakeClick(miner)}
                          disabled={isRestakeProcessing}
                          className="flex-1 h-12 bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green/90 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-neon-green/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-restake-${miner.token.toLowerCase()}`}
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Restake
                        </Button>
                        <Button
                          onClick={() => stopMinerMutation.mutate(miner.stakeId)}
                          disabled={stopMinerMutation.isPending}
                          className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-stop-${miner.token.toLowerCase()}`}
                        >
                          {stopMinerMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Stopping...
                            </>
                          ) : (
                            <>
                              <StopCircle className="w-5 h-5 mr-2" />
                              Stop
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Side by Side */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-5 gap-0 min-h-[400px]">
                    
                    {/* Video Section - Desktop */}
                    <div className="col-span-3 relative">
                      <div className="h-full relative overflow-hidden rounded-l-lg">
                        {miner.videoUrl && (
                          <video 
                            src={miner.videoUrl}
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-cover"
                          />
                        )}
                        
                        {/* Status overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40">
                          <div className="absolute top-6 left-6">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                              miner.status
                                ? miner.token === 'MGC' 
                                  ? 'bg-neon-purple/80 border border-neon-purple/50' 
                                  : 'bg-mining-orange/80 border border-mining-orange/50'
                                : 'bg-orange-500/80 border border-orange-500/50'
                            } text-white font-medium shadow-lg`}>
                              <div className={`w-2 h-2 rounded-full ${
                                miner.status ? 'bg-neon-green animate-pulse shadow-lg shadow-neon-green/50' : 'bg-orange-400'
                              }`}></div>
                              {miner.status ? `${miner.token} Mining Active` : 'Offline'}
                            </div>
                            {!miner.status && miner.statusReason && (
                              <div className="mt-2 text-sm text-orange-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur-sm max-w-[250px]">
                                {miner.statusReason}
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute bottom-6 left-6">
                            <div className="text-white">
                              <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                {miner.effectiveRate.toFixed(2)}% Mining Rate
                                {miner.bonusBreakdown.total_bonus_bp > 0 && (
                                  <span className="ml-2 text-sm text-neon-green">
                                    +{(miner.bonusBreakdown.total_bonus_bp / 100).toFixed(2)}%
                                  </span>
                                )}
                              </div>
                              <div className="text-base text-white/80 font-medium">
                                {miner.status ? 'Live Performance' : miner.autoPaused ? 'Auto Paused' : 'Paused'}
                              </div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Stats Section - Desktop */}
                    <div className="col-span-2 p-6 space-y-6 flex flex-col justify-between bg-black/20">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-3 ${
                            miner.status ? 'bg-neon-green animate-pulse shadow-lg shadow-neon-green/50' : 'bg-white/40'
                          }`}></span>
                          {miner.name}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            miner.status 
                              ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                          }`}>
                            {miner.status ? 'ONLINE' : 'OFFLINE'}
                          </div>
                          {!miner.status && miner.statusReason && (
                            <div className="text-xs text-orange-400/80 max-w-[200px] text-right">
                              {miner.statusReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mining Stats - Desktop */}
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neon-green" />
                            <span className="text-white/80 font-medium">Working Time</span>
                          </div>
                          <span className="text-white font-bold">{miner.workingTime}</span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-neon-purple" />
                            <span className="text-white/80 font-medium">Mining Rate</span>
                          </div>
                          <div className="text-right">
                            {miner.bonusBreakdown.total_bonus_bp > 0 ? (
                              <>
                                <div className="text-white font-bold">
                                  {miner.effectiveRate.toFixed(2)}%
                                  <span className="ml-1 text-xs text-neon-green">
                                    (+{(miner.bonusBreakdown.total_bonus_bp / 100).toFixed(2)}%)
                                  </span>
                                </div>
                                <div className="text-xs text-white/50">Base: {miner.baseRate}%</div>
                                {(miner.bonusBreakdown.referral_bonus_bp > 0 || miner.bonusBreakdown.badge_bonus_bp > 0) && (
                                  <div className="text-xs text-white/40 mt-0.5">
                                    {miner.bonusBreakdown.referral_bonus_bp > 0 && `Referral: +${(miner.bonusBreakdown.referral_bonus_bp / 100).toFixed(2)}%`}
                                    {miner.bonusBreakdown.referral_bonus_bp > 0 && miner.bonusBreakdown.badge_bonus_bp > 0 && ' • '}
                                    {miner.bonusBreakdown.badge_bonus_bp > 0 && `Badge: +${(miner.bonusBreakdown.badge_bonus_bp / 100).toFixed(2)}%`}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-white font-bold">{miner.baseRate}%</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-mining-orange" />
                            <span className="text-white/80 font-medium">Staked Amount</span>
                          </div>
                          <span className="text-white font-bold">{miner.stakedAmount.toFixed(2)} {miner.token}</span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-neon-green" />
                            <span className="text-white/80 font-medium">Hashrate</span>
                          </div>
                          <span className="text-white font-bold">{miner.power} TH/s</span>
                        </div>

                        <div className={`rounded-lg p-4 relative overflow-hidden ${
                          miner.token === 'MGC' 
                            ? 'bg-gradient-to-br from-purple-900/40 to-purple-600/20 border-2 border-neon-purple/50' 
                            : 'bg-gradient-to-br from-orange-900/40 to-orange-600/20 border-2 border-mining-orange/50'
                        } backdrop-blur-sm shadow-lg ${
                          miner.status ? 'animate-pulse-glow' : ''
                        }`}>
                          {/* Animated background particles for online miners */}
                          {miner.status && (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <div className={`absolute w-2 h-2 rounded-full ${
                                miner.token === 'MGC' ? 'bg-neon-purple' : 'bg-mining-orange'
                              } opacity-60 animate-float`} style={{ top: '15%', left: '15%', animationDelay: '0s' }}></div>
                              <div className={`absolute w-1 h-1 rounded-full ${
                                miner.token === 'MGC' ? 'bg-neon-purple' : 'bg-mining-orange'
                              } opacity-40 animate-float`} style={{ top: '70%', left: '85%', animationDelay: '1.5s' }}></div>
                              <div className={`absolute w-1.5 h-1.5 rounded-full ${
                                miner.token === 'MGC' ? 'bg-neon-purple' : 'bg-mining-orange'
                              } opacity-50 animate-float`} style={{ top: '45%', left: '10%', animationDelay: '2.5s' }}></div>
                            </div>
                          )}
                          
                          <div className="text-center relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <Coins className={`w-5 h-5 ${
                                miner.token === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'
                              } ${miner.status ? 'animate-pulse' : ''}`} />
                              <span className="text-white font-bold">Live Earnings</span>
                            </div>
                            {miner.status && miner.earningPerSecond > 0 && (
                              <div className="text-xs text-neon-green font-medium bg-neon-green/10 px-2 py-1 rounded-full border border-neon-green/30 mb-2 inline-block animate-pulse">
                                +{(miner.earningPerSecond * 60).toFixed(8)}/min
                              </div>
                            )}
                            <div className={`text-2xl font-bold mb-1 ${
                              miner.token === 'MGC' 
                                ? 'text-neon-purple' 
                                : 'text-mining-orange'
                            } drop-shadow-[0_0_8px_currentColor]`}>
                              <AnimatedCounter 
                                value={miner.tokensEarned} 
                                decimals={8}
                                duration={800}
                                earningPerSecond={miner.status ? miner.earningPerSecond : 0}
                                isOnline={miner.status}
                              />
                            </div>
                            <div className="text-sm text-white/80 font-medium">{miner.token}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Active Turbo Indicator - Desktop */}
                      {activeTurbosForMiner(miner.id).length > 0 && (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-mining-orange/20 to-mining-orange/5 border border-mining-orange/30">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Rocket className="w-4 h-4 text-mining-orange animate-pulse" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-mining-orange rounded-full animate-ping" />
                            </div>
                            <span className="text-xs font-medium text-mining-orange">Turbo Active</span>
                            <span className="text-xs text-white/50 ml-auto">
                              {formatTimeRemaining(activeTurbosForMiner(miner.id)[0].ends_at)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons - Desktop */}
                      <div className="mt-6 flex gap-3">
                        {availableTurbos.length > 0 && (
                          <Button
                            onClick={() => handleBoostClick(miner.id)}
                            className="flex-1 h-12 bg-gradient-to-r from-mining-orange to-amber-500 hover:from-mining-orange/90 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-mining-orange/30 transition-all duration-300 hover:scale-[1.02]"
                            data-testid={`button-boost-desktop-${miner.token.toLowerCase()}`}
                          >
                            <Rocket className="w-5 h-5 mr-2" />
                            Boost
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRestakeClick(miner)}
                          disabled={isRestakeProcessing}
                          className="flex-1 h-12 bg-gradient-to-r from-neon-green to-emerald-500 hover:from-neon-green/90 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-neon-green/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-restake-desktop-${miner.token.toLowerCase()}`}
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Restake
                        </Button>
                        <Button
                          onClick={() => stopMinerMutation.mutate(miner.stakeId)}
                          disabled={stopMinerMutation.isPending}
                          className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-stop-desktop-${miner.token.toLowerCase()}`}
                        >
                          {stopMinerMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Stopping...
                            </>
                          ) : (
                            <>
                              <StopCircle className="w-5 h-5 mr-2" />
                              Stop
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* No Active Miners State */
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/5 animate-pulse"></div>
          <CardContent className="p-12 text-center space-y-6 relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neon-purple/20 to-mining-orange/20 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg">
              <Activity className="w-10 h-10 text-white/60 animate-pulse-glow" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">No Active Miners</h3>
              <p className="text-white/70 text-lg">
                Start your mining rigs to begin earning rewards
              </p>
            </div>
            <Link href="/app/miners">
              <Button 
                className="bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                data-testid="button-start-mining"
              >
                <Play className="w-5 h-5 mr-2" />
                Launch Mining Operations
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Beautiful Turbo Selection Dialog */}
      <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
        <DialogContent className="bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] border border-white/10 max-w-md p-0 overflow-hidden">
          {/* Header with glow effect */}
          <div className="relative p-6 pb-4">
            <div className="absolute inset-0 bg-gradient-to-b from-mining-orange/10 to-transparent" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mining-orange to-amber-500 flex items-center justify-center shadow-lg shadow-mining-orange/30">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">
                    Select Turbo Boost
                  </DialogTitle>
                  <p className="text-sm text-white/50">
                    Choose a boost to supercharge your miner
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Turbo Grid */}
          <div className="px-6 pb-6">
            {availableTurbos.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mining-orange/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-mining-orange/40" />
                </div>
                <p className="text-white/50 mb-1">No turbos available</p>
                <p className="text-white/30 text-sm">Complete challenges to earn boosts!</p>
              </div>
            ) : (
              <>
                {/* Grid of turbo cards */}
                <div className="grid grid-cols-3 gap-3">
                  {availableTurbos.map((turbo) => {
                    const count = availableTurbos.filter(t => t.definition === turbo.definition).length;
                    const isFirst = availableTurbos.findIndex(t => t.definition === turbo.definition) === availableTurbos.indexOf(turbo);
                    
                    if (!isFirst) return null;
                    
                    return (
                      <button
                        key={turbo.id}
                        onClick={() => handleTurboSelect(turbo.id)}
                        disabled={activateTurboMutation.isPending}
                        className="group relative rounded-xl overflow-visible transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid={`button-select-turbo-${turbo.id}`}
                      >
                        {/* Balance badge */}
                        <div className="absolute -top-2 -right-2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-mining-orange to-amber-500 shadow-lg shadow-mining-orange/40">
                          <span className="text-xs font-bold text-white">{count}x</span>
                        </div>
                        
                        <div className="relative bg-white/5 border border-white/10 group-hover:border-mining-orange/50 rounded-xl p-3 transition-all group-hover:bg-white/10">
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 rounded-xl bg-mining-orange/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Image */}
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-mining-orange/20 group-hover:border-mining-orange/50 transition-colors mb-2">
                            <img 
                              src={`https://api.coinmaining.game${turbo.definition_image}`}
                              alt={turbo.definition_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Name */}
                          <p className="text-xs font-medium text-white/80 group-hover:text-mining-orange text-center truncate transition-colors">
                            {turbo.definition_name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {activateTurboMutation.isPending && (
                  <div className="flex items-center justify-center py-4 gap-3 mt-4">
                    <div className="w-5 h-5 border-2 border-mining-orange border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/60">Activating boost...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Restake Processing Dialog */}
      <Dialog open={showRestakeDialog} onOpenChange={(open) => !isRestakeProcessing && !open && closeRestakeDialog()}>
        <DialogContent className="bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] border border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
                <RefreshCw className={`w-5 h-5 text-white ${isRestakeProcessing ? 'animate-spin' : ''}`} />
              </div>
              Restake {restakingMiner?.token}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Restaking your earnings back to your miner for compound returns
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {/* Status Steps */}
            <div className="space-y-3">
              {/* Step 1: Getting Signature */}
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                restakeMutation.isPending 
                  ? 'bg-neon-green/10 border border-neon-green/30' 
                  : restakeSignature 
                    ? 'bg-neon-green/5 border border-white/10' 
                    : 'bg-white/5 border border-white/10'
              }`}>
                {restakeMutation.isPending ? (
                  <Loader2 className="w-5 h-5 text-neon-green animate-spin" />
                ) : restakeSignature ? (
                  <div className="w-5 h-5 rounded-full bg-neon-green flex items-center justify-center">
                    <span className="text-white text-xs">1</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white/60 text-xs">1</span>
                  </div>
                )}
                <span className={restakeMutation.isPending ? 'text-neon-green' : restakeSignature ? 'text-white' : 'text-white/60'}>
                  Getting restake signature...
                </span>
              </div>

              {/* Step 2: Wallet Confirmation */}
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                isRestakeContractPending 
                  ? 'bg-neon-green/10 border border-neon-green/30' 
                  : restakeTxHash 
                    ? 'bg-neon-green/5 border border-white/10' 
                    : 'bg-white/5 border border-white/10'
              }`}>
                {isRestakeContractPending ? (
                  <Loader2 className="w-5 h-5 text-neon-green animate-spin" />
                ) : restakeTxHash ? (
                  <div className="w-5 h-5 rounded-full bg-neon-green flex items-center justify-center">
                    <span className="text-white text-xs">2</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white/60 text-xs">2</span>
                  </div>
                )}
                <span className={isRestakeContractPending ? 'text-neon-green' : restakeTxHash ? 'text-white' : 'text-white/60'}>
                  Confirm in wallet...
                </span>
              </div>

              {/* Step 3: Blockchain Confirmation */}
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                isRestakeTxConfirming 
                  ? 'bg-neon-green/10 border border-neon-green/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                {isRestakeTxConfirming ? (
                  <Loader2 className="w-5 h-5 text-neon-green animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white/60 text-xs">3</span>
                  </div>
                )}
                <span className={isRestakeTxConfirming ? 'text-neon-green' : 'text-white/60'}>
                  Confirming on blockchain...
                </span>
              </div>
            </div>

            {/* Cancel Button */}
            {!isRestakeProcessing && (
              <Button
                onClick={closeRestakeDialog}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
