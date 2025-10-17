import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Clock, Coins, StopCircle, AlertTriangle, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  tokensEarned: number;
  workingTime: string;
  power: number;
  stakedAmount: number;
  planLevel: number;
  activeSince: string;
  secondsActive: number;
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
  const workingTime = formatDuration(apiMiner.seconds_active);
  
  const baseRate = parseFloat(apiMiner.base_rate_percent);
  const bonusBp = apiMiner.bonus_breakdown.total_bonus_bp;
  const bonusPercentage = bonusBp / 100;
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
    tokensEarned: parseFloat(apiMiner.accrued_reward_until_now),
    workingTime,
    power: apiMiner.power,
    stakedAmount: parseFloat(apiMiner.staked_amount),
    planLevel: apiMiner.plan_level,
    activeSince: apiMiner.active_since,
    secondsActive: apiMiner.seconds_active
  };
}

export default function MiningHistory() {
  // Fetch miners data from API
  const { data: apiResponse, isLoading } = useQuery<ApiMinerResponse>({
    queryKey: ['/api/stakes/miners'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Get all offline miners for history
  const stoppedMiners = (apiResponse?.miners?.map(convertApiMinerToMinerData) || [])
    .filter(miner => !miner.status)
    .sort((a, b) => b.secondsActive - a.secondsActive); // Sort by most recently active

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent">
            Mining History
          </h1>
          <p className="text-white/60 mt-2">View all your stopped miners and their status</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <History className="w-5 h-5 text-neon-purple" />
          <span className="text-white font-medium">{stoppedMiners.length} Stopped Miners</span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <div className="text-white/60">Loading history...</div>
          </CardContent>
        </Card>
      ) : stoppedMiners.length === 0 ? (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <History className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Mining History</h3>
            <p className="text-white/60">You don't have any stopped miners yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {stoppedMiners.map((miner) => (
            <Card 
              key={miner.stakeId}
              className="border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-300"
              data-testid={`history-miner-${miner.stakeId}`}
            >
              <CardContent className="p-6">
                <div className="grid md:grid-cols-[1fr_auto] gap-6">
                  {/* Left: Miner Info */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{miner.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            miner.token === 'MGC' 
                              ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50' 
                              : 'bg-mining-orange/20 text-mining-orange border border-mining-orange/50'
                          }`}>
                            {miner.token}
                          </span>
                        </div>
                        
                        {/* Status Badge and Reason */}
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            {miner.autoPaused ? (
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50 text-sm font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                Auto Paused
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-sm font-medium">
                                <StopCircle className="w-3 h-3" />
                                Manually Stopped
                              </div>
                            )}
                          </div>
                          {miner.statusReason && (
                            <p className="text-sm text-orange-300/80 ml-1">
                              {miner.statusReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-neon-green/60" />
                          <span className="text-xs text-white/60">Working Time</span>
                        </div>
                        <p className="text-white font-semibold">{miner.workingTime}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Coins className="w-4 h-4 text-neon-purple/60" />
                          <span className="text-xs text-white/60">Staked Amount</span>
                        </div>
                        <p className="text-white font-semibold">{miner.stakedAmount.toFixed(2)} {miner.token}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Coins className="w-4 h-4 text-mining-orange/60" />
                          <span className="text-xs text-white/60">Total Earned</span>
                        </div>
                        <p className={`font-semibold ${
                          miner.token === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'
                        }`}>
                          {miner.tokensEarned.toFixed(8)} {miner.token}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/60">Mining Rate</span>
                        </div>
                        <p className="text-white font-semibold">{miner.effectiveRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Icon */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      miner.autoPaused 
                        ? 'bg-orange-500/10 border-2 border-orange-500/30' 
                        : 'bg-red-500/10 border-2 border-red-500/30'
                    }`}>
                      {miner.autoPaused ? (
                        <AlertTriangle className="w-10 h-10 text-orange-400" />
                      ) : (
                        <StopCircle className="w-10 h-10 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
