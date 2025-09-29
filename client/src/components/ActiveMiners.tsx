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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-mining-orange to-neon-green bg-clip-text text-transparent">
            Active Mining Operations
          </h2>
          <p className="text-white/80 text-lg">
            Live mining dashboard with real-time rewards
          </p>
        </div>
        <Badge className={`${
          activeMiners.length > 0 
            ? 'bg-gradient-to-r from-neon-purple to-neon-green' 
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
        } text-white border-none px-4 py-2 text-sm font-bold shadow-lg animate-pulse-glow`}>
          <Activity className="w-5 h-5 mr-2" />
          {activeMiners.length} Miners Online
        </Badge>
      </div>

      {/* Active Miners Grid */}
      {activeMiners.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeMiners.map((miner) => (
            <Card 
              key={miner.id}
              className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/30 transition-all duration-500 relative overflow-hidden shadow-2xl hover:shadow-neon-purple/20"
              data-testid={`active-miner-${miner.token.toLowerCase()}`}
            >
              {/* Animated background effects */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                miner.token === 'MGC' 
                  ? 'from-neon-purple/20 to-purple-600/10' 
                  : 'from-mining-orange/20 to-orange-600/10'
              } transition-all duration-1000`}></div>
              
              {/* Pulsing effect for active miners */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-pulse"></div>
              
              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <span className={`w-4 h-4 rounded-full mr-3 ${
                      miner.status === 'active' ? 'bg-neon-green animate-pulse shadow-lg shadow-neon-green/50' : 'bg-gray-400'
                    }`}></span>
                    {miner.token} Mining Rig
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleMinerStatus(miner.id)}
                    className="text-white hover:bg-white/10 rounded-full p-3"
                    data-testid={`button-toggle-${miner.token.toLowerCase()}-miner`}
                  >
                    {miner.status === 'active' ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Miner Video */}
                <div className="relative flex justify-center">
                  <div className={`relative rounded-xl overflow-hidden ${
                    miner.status === 'active' ? 'animate-pulse-glow shadow-2xl' : 'opacity-60'
                  } border-2 border-white/20`}>
                    <video 
                      src={getMinerVideo(miner.token)}
                      autoPlay
                      loop
                      muted
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    
                    {/* Status overlay */}
                    {miner.status === 'active' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <span className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              miner.token === 'MGC' ? 'bg-neon-purple/80' : 'bg-mining-orange/80'
                            }`}>
                              <Activity className="w-4 h-4 mr-2 animate-pulse" />
                              MINING ACTIVE
                            </span>
                            <span className="flex items-center text-lg font-bold">
                              {miner.rate}% Rate
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Essential Mining Stats */}
                <div className="space-y-4">
                  {/* Working Time */}
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-neon-green" />
                      <span className="text-white/80 font-medium">Working Time</span>
                    </div>
                    <span className="text-white font-bold text-lg">{miner.workingTime}</span>
                  </div>

                  {/* Mining Rate */}
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-neon-purple" />
                      <span className="text-white/80 font-medium">Mining Rate</span>
                    </div>
                    <span className="text-white font-bold text-lg">{miner.rate}%</span>
                  </div>

                  {/* Earned Rewards - Bold and Prominent */}
                  <div className={`flex items-center justify-between rounded-lg p-4 border-2 ${
                    miner.token === 'MGC' 
                      ? 'bg-gradient-to-r from-neon-purple/20 to-purple-600/20 border-neon-purple/50' 
                      : 'bg-gradient-to-r from-mining-orange/20 to-orange-600/20 border-mining-orange/50'
                  } shadow-lg`}>
                    <div className="flex items-center space-x-3">
                      <Coins className={`w-6 h-6 ${
                        miner.token === 'MGC' ? 'text-neon-purple' : 'text-mining-orange'
                      }`} />
                      <span className="text-white font-medium text-lg">Earned Rewards</span>
                    </div>
                    <span className={`font-black text-2xl ${
                      miner.token === 'MGC' 
                        ? 'bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent' 
                        : 'bg-gradient-to-r from-mining-orange to-orange-400 bg-clip-text text-transparent'
                    } animate-pulse-glow`}>
                      {miner.tokensEarned} {miner.token}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* No Active Miners State */
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neon-purple/20 to-mining-orange/20 rounded-full flex items-center justify-center border-2 border-white/20">
              <Activity className="w-12 h-12 text-white/50" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">No Active Mining Operations</h3>
              <p className="text-white/70 text-lg">
                Start your mining rigs to begin earning rewards
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-neon-purple via-purple-600 to-neon-green hover:from-neon-purple/90 hover:via-purple-600/90 hover:to-neon-green/90 text-white border-none px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              data-testid="button-start-mining"
            >
              <Play className="w-6 h-6 mr-3" />
              Launch Mining Operations
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}