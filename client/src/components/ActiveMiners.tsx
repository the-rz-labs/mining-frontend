import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { 
  Play, 
  Activity,
  Clock,
  TrendingUp,
  Coins,
  Zap
} from "lucide-react";

interface MinerData {
  id: number;
  name: string;
  token: string;
  status: boolean;
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
  miners: {
    miner_id: number;
    miner_name: string;
    is_online: boolean;
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
    name: apiMiner.miner_name,
    token: apiMiner.symbol,
    status: apiMiner.is_online,
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
  
  // Fetch miners data from API
  const { data: apiResponse, isLoading } = useQuery<ApiMinerResponse>({
    queryKey: ['/api/stakes/miners'],
    refetchInterval: 5000 // Refresh every 5 seconds for live updates
  });

  // Convert API data to component format (now includes video URLs from the miners API)
  const activeMiners = apiResponse?.miners?.map(convertApiMinerToMinerData) || [];

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
                            miner.token === 'MGC' 
                              ? 'bg-neon-purple/80 border border-neon-purple/50' 
                              : 'bg-mining-orange/80 border border-mining-orange/50'
                          } text-white text-sm font-medium shadow-lg`}>
                            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50"></div>
                            {miner.token} Mining
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4">
                          <div className="text-white">
                            <div className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                              {miner.effectiveRate}% Rate
                              {miner.bonusMultiplier > 1 && (
                                <span className="ml-2 text-xs text-neon-green">
                                  +{miner.bonusPercentage.toFixed(2)}%
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-white/80 font-medium">Active Mining</div>
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
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        miner.status 
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      }`}>
                        {miner.status ? 'ONLINE' : 'OFFLINE'}
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
                          {miner.bonusMultiplier > 1 ? (
                            <>
                              <div className="text-white font-bold">
                                {miner.effectiveRate}%
                                <span className="ml-1 text-xs text-neon-green">
                                  (+{miner.bonusPercentage.toFixed(2)}%)
                                </span>
                              </div>
                              <div className="text-xs text-white/50">Base: {miner.baseRate}%</div>
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
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 gap-3 mt-4">
                        <Button
                          className="h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02]"
                          data-testid={`button-stop-claim-${miner.token.toLowerCase()}`}
                        >
                          Stop & Claim
                        </Button>
                        
                        <Button
                          className="h-12 bg-gradient-to-r from-neon-purple to-purple-500 hover:from-neon-purple/80 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/30 transition-all duration-300 hover:scale-[1.02]"
                          data-testid={`button-claim-${miner.token.toLowerCase()}`}
                        >
                          Claim Now
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
                              miner.token === 'MGC' 
                                ? 'bg-neon-purple/80 border border-neon-purple/50' 
                                : 'bg-mining-orange/80 border border-mining-orange/50'
                            } text-white font-medium shadow-lg`}>
                              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-lg shadow-neon-green/50"></div>
                              {miner.token} Mining Active
                            </div>
                          </div>
                          
                          <div className="absolute bottom-6 left-6">
                            <div className="text-white">
                              <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                {miner.effectiveRate}% Mining Rate
                                {miner.bonusMultiplier > 1 && (
                                  <span className="ml-2 text-sm text-neon-green">
                                    +{miner.bonusPercentage.toFixed(2)}%
                                  </span>
                                )}
                              </div>
                              <div className="text-white/80 font-medium">Live Performance</div>
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
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          miner.status 
                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                        }`}>
                          {miner.status ? 'ONLINE' : 'OFFLINE'}
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
                            {miner.bonusMultiplier > 1 ? (
                              <>
                                <div className="text-white font-bold">
                                  {miner.effectiveRate}%
                                  <span className="ml-1 text-xs text-neon-green">
                                    (+{miner.bonusPercentage.toFixed(2)}%)
                                  </span>
                                </div>
                                <div className="text-xs text-white/50">Base: {miner.baseRate}%</div>
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
                      
                      {/* Action Buttons - Desktop */}
                      <div className="space-y-3 mt-6">
                        <Button
                          className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-[1.02]"
                          data-testid={`button-stop-claim-${miner.token.toLowerCase()}`}
                        >
                          Stop & Claim
                        </Button>
                        
                        <Button
                          className="w-full h-12 bg-gradient-to-r from-neon-purple to-purple-500 hover:from-neon-purple/80 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/30 transition-all duration-300 hover:scale-[1.02]"
                          data-testid={`button-claim-${miner.token.toLowerCase()}`}
                        >
                          Claim Now
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

    </div>
  );
}
