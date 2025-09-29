import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Pause, 
  Play, 
  Coins,
  Activity,
  Clock,
  TrendingUp
} from "lucide-react";


interface MinerData {
  id: string;
  token: 'MGC' | 'RZ';
  plan: string;
  status: 'active' | 'paused' | 'inactive';
  rate: number; // Rate percentage like 1.1%
  tokensEarned: number;
  workingTime: string; // Time it's been working
}

const mockMinersData: MinerData[] = [
  {
    id: 'mgc-miner-1',
    token: 'MGC',
    plan: 'Premium MGC Plan',
    status: 'active',
    rate: 1.2,
    tokensEarned: 0.000124, // Low decimals for real-time visibility
    workingTime: '2h 15m'
  },
  {
    id: 'rz-miner-1', 
    token: 'RZ',
    plan: 'Standard RZ Plan',
    status: 'active',
    rate: 1.1,
    tokensEarned: 0.000089, // Low decimals for real-time visibility
    workingTime: '1h 42m'
  }
];

export function ActiveMiners() {
  const [miners, setMiners] = useState<MinerData[]>(mockMinersData);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time simulation for active miners with 1% monthly ratio for 50 tokens
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      setMiners(prev => prev.map(miner => {
        if (miner.status === 'active') {
          // 1% monthly ratio for 50 tokens = 0.5 tokens per month
          // Per second: 0.5 / (30 * 24 * 60 * 60) = 0.000000193 tokens per second
          // Scale by miner rate percentage
          const baseTokensPerSecond = 0.5 / (30 * 24 * 60 * 60);
          const tokensIncrement = baseTokensPerSecond * (miner.rate / 1.0); // Scale by rate
          const newTokensEarned = miner.tokensEarned + tokensIncrement;
          
          // Update working time (simplified simulation)
          const startTime = new Date();
          startTime.setHours(startTime.getHours() - 2); // Simulate 2 hours ago start
          const elapsedMs = new Date().getTime() - startTime.getTime();
          const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
          const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
          const newWorkingTime = `${hours}h ${minutes}m`;
          
          return {
            ...miner,
            tokensEarned: Math.round(newTokensEarned * 1000000) / 1000000, // Show 6 decimals for visibility
            workingTime: newWorkingTime
          };
        }
        return miner;
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const toggleMinerStatus = (minerId: string) => {
    setMiners(prev => prev.map(miner => {
      if (miner.id === minerId) {
        const newStatus = miner.status === 'active' ? 'paused' : 'active';
        return { ...miner, status: newStatus };
      }
      return miner;
    }));
  };

  const getMinerVideo = (token: 'MGC' | 'RZ') => {
    const BASE_URL = "https://coinmaining.game";

    if (token === 'MGC') {
      return `${BASE_URL}/miners_vid/1mgc-vido.mp4`;
    }
    return `${BASE_URL}/miners_vid/1rz-video.mp4`;
  };

  const activeMiners = miners.filter(m => m.status === 'active');
  const inactiveMiners = miners.filter(m => m.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent mb-2">
            Active Mining Operations
          </h2>
          <p className="text-white/70 text-lg">
            Real-time mining dashboard with live rewards
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-2 shadow-lg">
          <Activity className="w-4 h-4 text-neon-green animate-pulse" />
          <span className="text-white/80 font-medium">{activeMiners.length} Miners Online</span>
        </div>
      </div>

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
              
              <CardContent className="p-0 relative h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                  
                  {/* Video Section */}
                  <div className="relative h-full">
                    <div className="h-full relative overflow-hidden rounded-l-lg">
                      <video 
                        src={getMinerVideo(miner.token)}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                      
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
                            <div className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{miner.rate}% Rate</div>
                            <div className="text-sm text-white/80 font-medium">Active Mining</div>
                          </div>
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMinerStatus(miner.id)}
                            className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110"
                            data-testid={`button-toggle-${miner.token.toLowerCase()}-miner`}
                          >
                            {miner.status === 'active' ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="p-6 space-y-6 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-3 ${
                          miner.status === 'active' ? 'bg-neon-green animate-pulse shadow-lg shadow-neon-green/50' : 'bg-white/40'
                        }`}></span>
                        {miner.token} Mining Rig
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        miner.status === 'active' 
                          ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' 
                          : 'bg-white/10 text-white/60 border border-white/20'
                      }`}>
                        {miner.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                      </div>
                    </div>

                    {/* Mining Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-neon-green" />
                          <span className="text-white/80 font-medium">Working Time</span>
                        </div>
                        <span className="text-white font-bold text-lg">{miner.workingTime}</span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-neon-purple" />
                          <span className="text-white/80 font-medium">Mining Rate</span>
                        </div>
                        <span className="text-white font-bold text-lg">{miner.rate}%</span>
                      </div>

                      <div className={`relative overflow-hidden rounded-xl p-4 ${
                        miner.token === 'MGC' 
                          ? 'bg-gradient-to-br from-neon-purple/10 via-purple-500/5 to-neon-purple/10' 
                          : 'bg-gradient-to-br from-mining-orange/10 via-orange-500/5 to-mining-orange/10'
                      } backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500`}>
                        {/* Modern glow effect */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
                          miner.token === 'MGC' 
                            ? 'from-neon-purple/20 to-purple-400/20' 
                            : 'from-mining-orange/20 to-orange-400/20'
                        } opacity-50 blur-xl`}></div>
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Coins className={`w-7 h-7 ${
                              miner.token === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'
                            } drop-shadow-lg animate-pulse-glow`} />
                            <span className="text-white font-bold text-xl">Live Earnings</span>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-black ${
                              miner.token === 'MGC' 
                                ? 'bg-gradient-to-r from-neon-purple via-purple-300 to-purple-400 bg-clip-text text-transparent' 
                                : 'bg-gradient-to-r from-mining-orange via-orange-300 to-orange-400 bg-clip-text text-transparent'
                            } drop-shadow-lg animate-pulse-glow`}>
                              {miner.tokensEarned.toFixed(6)} {miner.token}
                            </div>
                            <div className="text-sm text-neon-green font-bold uppercase tracking-wider">+Realtime</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <Button
                          onClick={() => toggleMinerStatus(miner.id)}
                          className={`h-12 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                            miner.status === 'active'
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg shadow-red-500/30'
                              : 'bg-gradient-to-r from-neon-green to-green-500 hover:from-neon-green/80 hover:to-green-400 text-white shadow-lg shadow-neon-green/30'
                          }`}
                          data-testid={`button-stop-claim-${miner.token.toLowerCase()}`}
                        >
                          {miner.status === 'active' ? (
                            <>Stop & Claim</>
                          ) : (
                            <>Start Mining</>
                          )}
                        </Button>
                        
                        {miner.status === 'active' && (
                          <Button
                            className="h-12 bg-gradient-to-r from-neon-purple to-purple-500 hover:from-neon-purple/80 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/30 transition-all duration-300 hover:scale-[1.02]"
                            data-testid={`button-claim-${miner.token.toLowerCase()}`}
                          >
                            Claim Now
                          </Button>
                        )}
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
              <h3 className="text-2xl font-bold text-white mb-3">No Active Mining Operations</h3>
              <p className="text-white/70 text-lg">
                Start your mining rigs to begin earning rewards
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
              data-testid="button-start-mining"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Mining Operations
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}