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
          <h2 className="text-xl font-semibold text-white mb-1">
            Active Mining Operations
          </h2>
          <p className="text-slate-400">
            Real-time mining dashboard
          </p>
        </div>
      </div>

      {/* Active Miners Grid */}
      {activeMiners.length > 0 ? (
        <div className="space-y-6">
          {activeMiners.map((miner) => (
            <Card 
              key={miner.id}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-colors"
              data-testid={`active-miner-${miner.token.toLowerCase()}`}
            >
              <CardContent className="p-0">
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
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                            miner.token === 'MGC' 
                              ? 'bg-purple-600/90' 
                              : 'bg-orange-600/90'
                          } text-white text-sm font-medium`}>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            {miner.token} Mining
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4">
                          <div className="text-white">
                            <div className="text-lg font-semibold">{miner.rate}% Rate</div>
                            <div className="text-sm text-slate-300">Active Mining</div>
                          </div>
                        </div>
                        
                        <div className="absolute top-4 right-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMinerStatus(miner.id)}
                            className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
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
                      <h3 className="text-lg font-semibold text-white">{miner.token} Mining Rig</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        miner.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {miner.status === 'active' ? 'Active' : 'Paused'}
                      </div>
                    </div>

                    {/* Mining Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">Working Time</span>
                        </div>
                        <span className="text-white font-medium">{miner.workingTime}</span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">Mining Rate</span>
                        </div>
                        <span className="text-white font-medium">{miner.rate}%</span>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Coins className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">Earned Rewards</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{miner.tokensEarned} {miner.token}</div>
                          <div className="text-sm text-emerald-400">Live Earnings</div>
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
        <Card className="bg-slate-900/50 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center">
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">No Active Mining Operations</h3>
              <p className="text-slate-400">
                Start your mining rigs to begin earning rewards
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              data-testid="button-start-mining"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Mining
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}