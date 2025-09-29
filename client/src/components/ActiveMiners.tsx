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
    tokensEarned: 45.8,
    workingTime: '2h 15m'
  },
  {
    id: 'rz-miner-1', 
    token: 'RZ',
    plan: 'Standard RZ Plan',
    status: 'active',
    rate: 1.1,
    tokensEarned: 23.4,
    workingTime: '1h 42m'
  }
];

export function ActiveMiners() {
  const [miners, setMiners] = useState<MinerData[]>(mockMinersData);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time simulation for active miners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      setMiners(prev => prev.map(miner => {
        if (miner.status === 'active') {
          // Simulate real-time updates
          const tokensIncrement = (miner.rate / 100) * 0.01; // Based on rate percentage
          const newTokensEarned = miner.tokensEarned + tokensIncrement;
          
          // Update working time
          const currentTimeMinutes = Math.floor((currentTime.getTime() - new Date().setHours(0, 0, 0, 0)) / 60000);
          const hours = Math.floor(currentTimeMinutes / 60) % 24;
          const minutes = currentTimeMinutes % 60;
          const newWorkingTime = `${hours}h ${minutes}m`;
          
          return {
            ...miner,
            tokensEarned: Math.round(newTokensEarned * 100) / 100,
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
      return `${BASE_URL}/miners_vid/1mgc-video.mp4`;
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
              
              <CardContent className="p-0 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  
                  {/* Video Section */}
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-l-lg">
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
                  <div className="p-6 space-y-6">
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

                      <div className={`flex items-center justify-between py-4 rounded-lg border-2 ${
                        miner.token === 'MGC' 
                          ? 'bg-gradient-to-r from-neon-purple/20 to-purple-600/20 border-neon-purple/50' 
                          : 'bg-gradient-to-r from-mining-orange/20 to-orange-600/20 border-mining-orange/50'
                      } shadow-lg`}>
                        <div className="flex items-center gap-3">
                          <Coins className={`w-6 h-6 ${
                            miner.token === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'
                          } animate-pulse-glow`} />
                          <span className="text-white font-semibold text-lg">Earned Rewards</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-black ${
                            miner.token === 'MGC' 
                              ? 'bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent' 
                              : 'bg-gradient-to-r from-mining-orange to-orange-400 bg-clip-text text-transparent'
                          } animate-pulse-glow`}>
                            {miner.tokensEarned} {miner.token}
                          </div>
                          <div className="text-sm text-neon-green font-bold">Live Earnings</div>
                        </div>
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