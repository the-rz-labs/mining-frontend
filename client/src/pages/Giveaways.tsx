import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Gift, 
  Sparkles,
  Trophy,
  Star,
  Zap,
  Calendar,
  Target,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Flame,
  TrendingUp,
  Timer
} from "lucide-react";

interface EventTask {
  id: number;
  slug: string;
  title: string;
  description: string;
  kind: string;
  reward_type: string;
  image: string;
  status: 'completed' | 'in_progress' | 'pending' | 'locked';
  progress_percent: number;
}

interface EnergyTurbo {
  id: number;
  name: string;
  percent_boost: string;
  duration_seconds: number;
  image: string;
  is_active: boolean;
}

interface MinerAccess {
  id: number;
  name: string;
  image: string;
}

interface EventsDashboardResponse {
  tasks: EventTask[];
}

interface EventsCatalogResponse {
  tasks: EventTask[];
  energy_turbos: EnergyTurbo[];
  miner_accesses: MinerAccess[];
}

interface ActiveEnergyBoost {
  id: number;
  name: string;
  percent_boost: string;
  duration_seconds: number;
  image: string;
  is_active: boolean;
  quantity?: number;
}

interface ActiveRewardsResponse {
  energy_boosts: ActiveEnergyBoost[];
  miner_accesses: unknown[];
}

function getKindBadgeStyle(kind: string) {
  switch (kind.toLowerCase()) {
    case 'weekly':
      return 'bg-neon-purple/30 text-neon-purple border-neon-purple/50';
    case 'daily':
      return 'bg-neon-green/30 text-neon-green border-neon-green/50';
    case 'monthly':
      return 'bg-mining-orange/30 text-mining-orange border-mining-orange/50';
    default:
      return 'bg-white/20 text-white/80 border-white/30';
  }
}

function getStatusConfig(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return {
        color: 'bg-neon-green/20 text-neon-green border-neon-green/40',
        icon: CheckCircle2,
        label: 'Completed',
        glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]'
      };
    case 'in_progress':
      return {
        color: 'bg-neon-purple/20 text-neon-purple border-neon-purple/40',
        icon: Loader2,
        label: 'In Progress',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
      };
    case 'locked':
      return {
        color: 'bg-white/10 text-white/50 border-white/20',
        icon: Lock,
        label: 'Locked',
        glow: ''
      };
    default:
      return {
        color: 'bg-mining-orange/20 text-mining-orange border-mining-orange/40',
        icon: Target,
        label: 'Pending',
        glow: ''
      };
  }
}

function getKindIcon(kind: string) {
  switch (kind.toLowerCase()) {
    case 'weekly':
      return Calendar;
    case 'daily':
      return Clock;
    case 'monthly':
      return Trophy;
    default:
      return Star;
  }
}

function getRewardIcon(rewardType: string) {
  switch (rewardType.toLowerCase()) {
    case 'energy_turbo':
      return Zap;
    case 'bonus':
      return Gift;
    case 'tokens':
      return Award;
    default:
      return Sparkles;
  }
}

function formatRewardType(rewardType: string): string {
  return rewardType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
}

function TaskCard({ task }: { task: EventTask }) {
  const KindIcon = getKindIcon(task.kind);
  const RewardIcon = getRewardIcon(task.reward_type);
  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  return (
    <Card 
      className={`border border-white/10 bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1a]/90 backdrop-blur-xl shadow-2xl overflow-hidden group relative transition-all duration-500 hover:border-neon-purple/50 ${statusConfig.glow}`}
      data-testid={`card-task-${task.id}`}
    >
      <div className="relative h-72 overflow-hidden">
        <img 
          src={task.image} 
          alt={task.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCompleted ? 'opacity-80' : ''}`}
          data-testid={`img-task-${task.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent"></div>
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant="outline" className={`text-xs backdrop-blur-md ${getKindBadgeStyle(task.kind)}`} data-testid={`badge-task-kind-${task.id}`}>
            <KindIcon className="w-3 h-3 mr-1" />
            {task.kind.charAt(0).toUpperCase() + task.kind.slice(1)}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={`text-xs backdrop-blur-md ${statusConfig.color}`} data-testid={`badge-task-status-${task.id}`}>
            <StatusIcon className={`w-3 h-3 mr-1 ${isInProgress ? 'animate-spin' : ''}`} />
            {statusConfig.label}
          </Badge>
        </div>

        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-neon-green/20 backdrop-blur-sm flex items-center justify-center border-2 border-neon-green/50 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-neon-green" />
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="relative p-5 space-y-4">
        <div>
          <h3 className={`text-xl font-bold mb-2 transition-colors ${isCompleted ? 'text-neon-green' : 'text-white group-hover:text-neon-purple'}`} data-testid={`text-task-title-${task.id}`}>
            {task.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed" data-testid={`text-task-description-${task.id}`}>
            {task.description}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Progress</span>
            <span className={`font-bold ${isCompleted ? 'text-neon-green' : 'text-neon-purple'}`} data-testid={`text-progress-${task.id}`}>
              {Math.round(task.progress_percent)}%
            </span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                isCompleted 
                  ? 'bg-gradient-to-r from-neon-green to-neon-green/70' 
                  : 'bg-gradient-to-r from-neon-purple to-mining-orange'
              }`}
              style={{ width: `${task.progress_percent}%` }}
              data-testid={`progress-bar-${task.id}`}
            />
            {!isCompleted && task.progress_percent > 0 && (
              <div 
                className="absolute inset-y-0 left-0 bg-white/20 rounded-full animate-pulse"
                style={{ width: `${task.progress_percent}%` }}
              />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              isCompleted 
                ? 'bg-neon-green/10 border-neon-green/30' 
                : 'bg-neon-purple/10 border-neon-purple/30'
            }`}>
              <RewardIcon className={`w-4 h-4 ${isCompleted ? 'text-neon-green' : 'text-neon-purple'}`} />
              <span className={`text-xs font-medium ${isCompleted ? 'text-neon-green' : 'text-neon-purple'}`} data-testid={`text-reward-type-${task.id}`}>
                {formatRewardType(task.reward_type)}
              </span>
            </div>
          </div>
          
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-neon-green text-xs font-medium">
              <Gift className="w-4 h-4" />
              <span>Claimed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Target className="w-3.5 h-3.5" />
              <span>In Progress</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskSkeleton() {
  return (
    <Card className="border border-white/10 bg-[#1a1a2e]/90 backdrop-blur-xl overflow-hidden">
      <Skeleton className="h-72 w-full bg-white/5" />
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 bg-white/10" />
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-2/3 bg-white/10" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16 bg-white/10" />
            <Skeleton className="h-3 w-10 bg-white/10" />
          </div>
          <Skeleton className="h-2 w-full bg-white/10 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <Skeleton className="h-8 w-28 bg-white/10 rounded-lg" />
          <Skeleton className="h-4 w-20 bg-white/10" />
        </div>
      </CardContent>
    </Card>
  );
}

function PrizeCard({ turbo, balance }: { turbo: EnergyTurbo; balance: number }) {
  const boostValue = parseFloat(turbo.percent_boost);
  
  return (
    <Card 
      className="border border-white/10 bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1a]/90 backdrop-blur-xl shadow-2xl overflow-hidden group relative transition-all duration-500 hover:border-mining-orange/50 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]"
      data-testid={`card-prize-${turbo.id}`}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={`https://api.coinmaining.game${turbo.image}`}
          alt={turbo.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          data-testid={`img-prize-${turbo.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/40 to-transparent"></div>
        
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="text-xs backdrop-blur-md bg-mining-orange/30 text-mining-orange border-mining-orange/50" data-testid={`badge-prize-boost-${turbo.id}`}>
            <Zap className="w-3 h-3 mr-1" />
            +{boostValue}%
          </Badge>
        </div>

        <div className="absolute top-2 left-2">
          <Badge variant="outline" className={`text-xs backdrop-blur-md ${balance > 0 ? 'bg-neon-green/30 text-neon-green border-neon-green/50' : 'bg-white/20 text-white/60 border-white/30'}`} data-testid={`badge-prize-balance-${turbo.id}`}>
            <Gift className="w-3 h-3 mr-1" />
            {balance}x
          </Badge>
        </div>
      </div>
      
      <CardContent className="relative p-4">
        <h3 className="text-base font-bold text-white group-hover:text-mining-orange transition-colors mb-2" data-testid={`text-prize-name-${turbo.id}`}>
          {turbo.name}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
            <Timer className="w-3 h-3 text-white/60" />
            <span className="text-xs text-white/60" data-testid={`text-prize-duration-${turbo.id}`}>
              {formatDuration(turbo.duration_seconds)}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-mining-orange/10 border border-mining-orange/20">
            <TrendingUp className="w-3 h-3 text-mining-orange" />
            <span className="text-xs text-mining-orange font-medium">
              {boostValue}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrizeSkeleton() {
  return (
    <Card className="border border-white/10 bg-[#1a1a2e]/90 backdrop-blur-xl overflow-hidden">
      <Skeleton className="h-56 w-full bg-white/5" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-2/3 bg-white/10 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 bg-white/10 rounded-md" />
          <Skeleton className="h-5 w-12 bg-white/10 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Giveaways() {
  const token = localStorage.getItem('auth_token');
  
  const { data, isLoading, error } = useQuery<EventsDashboardResponse>({
    queryKey: ['/api/events/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/events/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    enabled: !!token,
    refetchInterval: 30000
  });

  const { data: catalogData, isLoading: catalogLoading } = useQuery<EventsCatalogResponse>({
    queryKey: ['/api/events/catalog'],
    queryFn: async () => {
      const response = await fetch('/api/events/catalog', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch catalog');
      }
      return response.json();
    },
    refetchInterval: 60000
  });

  const { data: activeRewardsData } = useQuery<ActiveRewardsResponse>({
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

  const getBalance = (turboId: number): number => {
    if (!activeRewardsData?.energy_boosts) return 0;
    const matching = activeRewardsData.energy_boosts.filter(boost => boost.id === turboId);
    return matching.length;
  };

  const completedCount = data?.tasks.filter(t => t.status === 'completed').length || 0;
  const inProgressCount = data?.tasks.filter(t => t.status === 'in_progress').length || 0;
  const totalCount = data?.tasks.length || 0;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-mining-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1a] to-[#1a1a2e]">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-neon-purple/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-mining-orange/20 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
          </div>
          
          <div className="relative px-6 py-8 md:px-10 md:py-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/20 border border-neon-purple/30 mb-4">
                  <Flame className="w-4 h-4 text-mining-orange animate-pulse" />
                  <span className="text-xs font-medium text-white/80">Limited Time Challenges</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" data-testid="text-page-title">
                  <span className="bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent">
                    Events & Challenges
                  </span>
                </h1>
                
                <p className="text-white/60 text-lg md:text-xl max-w-xl mb-6" data-testid="text-page-subtitle">
                  Complete challenges, unlock rewards, and supercharge your mining power
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-neon-green" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">{completedCount}</p>
                      <p className="text-xs text-white/50">Completed</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                      <p className="text-xs text-white/50">In Progress</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-mining-orange/20 border border-mining-orange/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-mining-orange" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">{totalCount}</p>
                      <p className="text-xs text-white/50">Total</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-purple/30 to-mining-orange/30 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-[#0f0f1a] flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative">
                      <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${completionRate * 2.83} 283`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#00ff88" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                          {completionRate}%
                        </span>
                        <span className="text-xs text-white/50 mt-1">Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-neon-green to-neon-green/50 flex items-center justify-center shadow-lg shadow-neon-green/30 animate-bounce" style={{ animationDuration: '2s' }}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mining-orange/30 to-mining-orange/10 flex items-center justify-center border border-mining-orange/20">
                <Zap className="w-6 h-6 text-mining-orange" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white" data-testid="text-prizes-title">
                  Energy Turbo Prizes
                </h2>
              </div>
            </div>
          </div>
          
          <p className="text-white/60 mb-6 max-w-2xl" data-testid="text-prizes-description">
            Boost your miners with Energy Turbos! Each one increases your mining output by a percentage for a limited duration.
          </p>

          {catalogLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="prizes-loading-skeleton">
              <PrizeSkeleton />
              <PrizeSkeleton />
              <PrizeSkeleton />
            </div>
          )}

          {catalogData && catalogData.energy_turbos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="prizes-grid">
              {catalogData.energy_turbos.map((turbo) => (
                <PrizeCard key={turbo.id} turbo={turbo} balance={getBalance(turbo.id)} />
              ))}
            </div>
          )}

          {catalogData && catalogData.energy_turbos.length === 0 && (
            <Card className="border border-white/10 bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1a]/90 backdrop-blur-xl" data-testid="no-prizes-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-mining-orange/20 to-mining-orange/10 rounded-2xl flex items-center justify-center border border-mining-orange/20">
                  <Gift className="w-8 h-8 text-mining-orange/60" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Prizes Available</h3>
                <p className="text-white/50">Check back later for new rewards!</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
              <Target className="w-6 h-6 text-neon-purple" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white" data-testid="text-challenges-title">
                Active Challenges
              </h2>
              <p className="text-white/50 text-sm">Complete these to earn your rewards</p>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="loading-skeleton">
              <TaskSkeleton />
              <TaskSkeleton />
              <TaskSkeleton />
            </div>
          )}

          {error && (
            <Card className="border border-red-500/30 bg-red-500/10 backdrop-blur-xl" data-testid="error-card">
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Failed to Load Challenges</h3>
                  <p className="text-white/60">Unable to fetch events. Please try again later.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {data && data.tasks.length === 0 && !isLoading && !error && (
            <Card className="border border-white/10 bg-gradient-to-br from-[#1a1a2e]/90 to-[#0f0f1a]/90 backdrop-blur-xl" data-testid="empty-state-card">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-neon-purple/30 to-mining-orange/30 rounded-3xl flex items-center justify-center border border-white/10 shadow-lg shadow-neon-purple/20">
                  <Sparkles className="w-12 h-12 text-neon-purple" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No Active Challenges</h3>
                <p className="text-white/60 max-w-md mx-auto text-lg">
                  Check back soon for new challenges and opportunities to earn rewards!
                </p>
              </CardContent>
            </Card>
          )}

          {data && data.tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="tasks-grid">
              {data.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
