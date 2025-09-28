import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MinerAnimation } from "@/components/MinerAnimation";
import { 
  Zap, 
  Pause, 
  Play, 
  Settings, 
  TrendingUp, 
  Clock, 
  Coins,
  Activity,
  Power,
  Cpu
} from "lucide-react";

// Import generated miner images
import mgcMinerRig from "@assets/generated_images/Animated_MGC_mining_rig_working_4f4350df.png";
import rzMinerRig from "@assets/generated_images/Animated_RZ_mining_rig_working_b16b79a8.png";

interface MinerData {
  id: string;
  token: 'MGC' | 'RZ';
  plan: string;
  status: 'active' | 'paused' | 'inactive';
  hashRate: number;
  efficiency: number;
  timeRemaining: string;
  tokensEarned: number;
  progress: number;
  temperature: number;
  powerConsumption: number;
}

const mockMinersData: MinerData[] = [
  {
    id: 'mgc-miner-1',
    token: 'MGC',
    plan: 'Premium MGC Plan',
    status: 'active',
    hashRate: 150.5,
    efficiency: 94.2,
    timeRemaining: '2h 15m',
    tokensEarned: 45.8,
    progress: 68,
    temperature: 72,
    powerConsumption: 850
  },
  {
    id: 'rz-miner-1', 
    token: 'RZ',
    plan: 'Standard RZ Plan',
    status: 'inactive',
    hashRate: 0,
    efficiency: 0,
    timeRemaining: '0h 0m',
    tokensEarned: 0,
    progress: 0,
    temperature: 25,
    powerConsumption: 0
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
          const hashRateVariation = (Math.random() - 0.5) * 5; // ±2.5 variation
          const newHashRate = Math.max(0, miner.hashRate + hashRateVariation);
          const progressIncrement = Math.random() * 0.5; // 0-0.5% per second
          const newProgress = Math.min(100, miner.progress + progressIncrement);
          const tokensIncrement = (newHashRate / 100) * 0.01; // Based on hash rate
          const newTokensEarned = miner.tokensEarned + tokensIncrement;
          
          // Calculate remaining time based on progress
          const progressPerMinute = 1; // Assume 1% per minute at normal rate
          const remainingProgress = 100 - newProgress;
          const remainingMinutes = Math.ceil(remainingProgress / progressPerMinute);
          const hours = Math.floor(remainingMinutes / 60);
          const minutes = remainingMinutes % 60;
          const newTimeRemaining = `${hours}h ${minutes}m`;
          
          // Temperature fluctuation based on activity
          const tempVariation = (Math.random() - 0.5) * 2;
          const newTemperature = Math.max(25, Math.min(85, miner.temperature + tempVariation));
          
          // Efficiency based on temperature (optimal around 65-75°C)
          const optimalTemp = 70;
          const tempDiff = Math.abs(newTemperature - optimalTemp);
          const baseEfficiency = 95;
          const newEfficiency = Math.max(85, baseEfficiency - (tempDiff * 0.5));
          
          return {
            ...miner,
            hashRate: Math.round(newHashRate * 10) / 10,
            progress: Math.round(newProgress * 10) / 10,
            tokensEarned: Math.round(newTokensEarned * 100) / 100,
            timeRemaining: newTimeRemaining,
            temperature: Math.round(newTemperature),
            efficiency: Math.round(newEfficiency * 10) / 10
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

  const getMinerImage = (token: 'MGC' | 'RZ', status: string) => {
    const BASE_URL = "https://coinmaining.game";

    if (token === 'MGC') {
      return `${BASE_URL}/images/1mgc.png`;
    }
    return `${BASE_URL}/images/1rz.png`;
  };

  const activeMiners = miners.filter(m => m.status === 'active');
  const inactiveMiners = miners.filter(m => m.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-mining-orange bg-clip-text text-transparent">
            Active Miners
          </h2>
          <p className="text-white/70">
            Monitor your mining operations in real-time
          </p>
        </div>
        <Badge className={`${
          activeMiners.length > 0 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
        } text-white border-none px-3 py-1`}>
          <Activity className="w-4 h-4 mr-1" />
          {activeMiners.length} Active
        </Badge>
      </div>

      {/* Active Miners Grid */}
      {activeMiners.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeMiners.map((miner) => (
            <Card 
              key={miner.id}
              className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 relative overflow-hidden"
              data-testid={`active-miner-${miner.token.toLowerCase()}`}
            >
              {/* Animated background effects */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                miner.token === 'MGC' 
                  ? 'from-neon-purple/10 to-purple-600/5' 
                  : 'from-mining-orange/10 to-orange-600/5'
              } transition-all duration-1000`}></div>
              
              {/* Pulsing effect for active miners */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 animate-pulse"></div>
              
              <CardHeader className="relative pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-white flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${
                      miner.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                    }`}></span>
                    {miner.token} Miner
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleMinerStatus(miner.id)}
                      className="text-white hover:bg-white/10"
                      data-testid={`button-toggle-${miner.token.toLowerCase()}-miner`}
                    >
                      {miner.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      data-testid={`button-settings-${miner.token.toLowerCase()}-miner`}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-white/70 text-sm">{miner.plan}</p>
              </CardHeader>

              <CardContent className="relative space-y-4">
                {/* Miner Visual */}
                <div className="relative flex justify-center">
                  <MinerAnimation
                    token={miner.token}
                    isActive={miner.status === 'active'}
                    earnings={miner.tokensEarned}
                  >
                    <div className={`relative rounded-lg overflow-hidden ${
                      miner.status === 'active' ? 'animate-pulse-glow' : 'opacity-60'
                    }`}>
                      <img 
                        src={getMinerImage(miner.token, miner.status)}
                        alt={`${miner.token} Mining Rig`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      
                      {/* Status overlay */}
                      {miner.status === 'active' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg">
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="flex items-center justify-between text-white text-sm">
                              <span className="flex items-center">
                                <Power className="w-4 h-4 mr-1 text-green-400" />
                                MINING
                              </span>
                              <span className="flex items-center">
                                <Cpu className="w-4 h-4 mr-1" />
                                {miner.temperature}°C
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </MinerAnimation>
                </div>

                {/* Mining Stats */}
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Session Progress</span>
                      <span className="text-white font-medium text-sm">{miner.progress}%</span>
                    </div>
                    <Progress 
                      value={miner.progress} 
                      className={`h-2 bg-white/10 ${
                        miner.token === 'MGC' ? '[&>div]:bg-gradient-to-r [&>div]:from-neon-purple [&>div]:to-purple-500' : '[&>div]:bg-gradient-to-r [&>div]:from-mining-orange [&>div]:to-orange-500'
                      }`}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-white/70 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hash Rate
                      </div>
                      <p className="text-white font-medium text-sm">{miner.hashRate} MH/s</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-white/70 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Remaining
                      </div>
                      <p className="text-white font-medium text-sm">{miner.timeRemaining}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-white/70 text-xs">
                        <Coins className="w-3 h-3 mr-1" />
                        Earned
                      </div>
                      <p className="text-white font-medium text-sm">{miner.tokensEarned} {miner.token}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-white/70 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Efficiency
                      </div>
                      <p className="text-white font-medium text-sm">{miner.efficiency}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* No Active Miners State */
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center">
              <Cpu className="w-8 h-8 text-white/50" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">No Active Miners</h3>
              <p className="text-white/60">
                Start a mining plan to see your rigs in action
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 text-white border-none"
              data-testid="button-start-mining"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Mining
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Inactive Miners Preview */}
      {inactiveMiners.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white/80">Available Miners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveMiners.map((miner) => (
              <Card 
                key={miner.id}
                className="border border-white/5 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm hover:border-white/10 transition-all duration-300 opacity-60 hover:opacity-80"
                data-testid={`inactive-miner-${miner.token.toLowerCase()}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={getMinerImage(miner.token, miner.status)}
                          alt={`${miner.token} Mining Rig`}
                          className="w-full h-full object-cover opacity-50"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{miner.token} Miner</h4>
                        <p className="text-white/50 text-sm">Ready to start</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleMinerStatus(miner.id)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                      data-testid={`button-start-${miner.token.toLowerCase()}-miner`}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}