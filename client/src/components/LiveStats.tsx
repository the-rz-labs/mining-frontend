import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Cpu, DollarSign, Zap, TrendingUp, Activity } from "lucide-react";

interface LiveStatsProps {
  //todo: remove mock functionality - replace with real API data
}

export default function LiveStats({}: LiveStatsProps) {
  // todo: remove mock functionality - these should come from real API
  const [stats, setStats] = useState({
    onlineMiners: 8547,
    totalUsers: 24891,
    totalStaked: 12450000,
    totalPaid: 8920000
  });

  // todo: remove mock functionality - simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        onlineMiners: prev.onlineMiners + Math.floor(Math.random() * 10 - 5),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        totalStaked: prev.totalStaked + Math.floor(Math.random() * 1000),
        totalPaid: prev.totalPaid + Math.floor(Math.random() * 500)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      title: "Online Miners",
      value: stats.onlineMiners.toLocaleString(),
      icon: Cpu,
      color: "text-neon-purple",
      gradientFrom: "from-neon-purple/5",
      gradientVia: "via-neon-purple/3",
      borderFrom: "from-neon-purple/20",
      borderTo: "to-neon-purple/5",
      iconBg: "from-neon-purple/10",
      iconBgTo: "to-neon-purple/5",
      iconBorder: "border-neon-purple/20",
      bgColor: "bg-neon-purple/60",
      progressFrom: "from-neon-purple/60",
      progressTo: "to-neon-purple/20"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-neon-green",
      gradientFrom: "from-neon-green/5",
      gradientVia: "via-neon-green/3",
      borderFrom: "from-neon-green/20",
      borderTo: "to-neon-green/5",
      iconBg: "from-neon-green/10",
      iconBgTo: "to-neon-green/5",
      iconBorder: "border-neon-green/20",
      bgColor: "bg-neon-green/60",
      progressFrom: "from-neon-green/60",
      progressTo: "to-neon-green/20"
    },
    {
      title: "Total Staked",
      value: `$${(stats.totalStaked / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-mining-orange",
      gradientFrom: "from-mining-orange/5",
      gradientVia: "via-mining-orange/3",
      borderFrom: "from-mining-orange/20",
      borderTo: "to-mining-orange/5",
      iconBg: "from-mining-orange/10",
      iconBgTo: "to-mining-orange/5",
      iconBorder: "border-mining-orange/20",
      bgColor: "bg-mining-orange/60",
      progressFrom: "from-mining-orange/60",
      progressTo: "to-mining-orange/20"
    },
    {
      title: "Total Paid",
      value: `$${(stats.totalPaid / 1000000).toFixed(1)}M`,
      icon: Zap,
      color: "text-cyber-blue",
      gradientFrom: "from-cyber-blue/5",
      gradientVia: "via-cyber-blue/3",
      borderFrom: "from-cyber-blue/20",
      borderTo: "to-cyber-blue/5",
      iconBg: "from-cyber-blue/10",
      iconBgTo: "to-cyber-blue/5",
      iconBorder: "border-cyber-blue/20",
      bgColor: "bg-cyber-blue/60",
      progressFrom: "from-cyber-blue/60",
      progressTo: "to-cyber-blue/20"
    }
  ];

  return (
    <section id="stats" className="py-20 bg-gradient-to-b from-card/30 to-background" data-testid="live-stats-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-mono">
            <span className="bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              LIVE STATISTICS
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time platform performance metrics updated every second
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-sm text-neon-green font-medium">Live Data</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl border border-border/20 hover-elevate group transition-all duration-500 hover:border-opacity-40"
              data-testid={`stat-card-${index}`}
            >
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Dynamic gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientVia} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
              
              {/* Animated border glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.borderFrom} ${stat.borderTo} rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`}></div>
              
              <div className="relative p-8">
                {/* Header with icon and activity indicator */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${stat.iconBg} ${stat.iconBgTo} border ${stat.iconBorder} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-7 h-7 ${stat.color} drop-shadow-sm`} />
                    {/* Floating particle effect */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${stat.bgColor} rounded-full animate-ping`}></div>
                  </div>
                  
                  {/* Live activity indicator */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center space-x-1">
                      <Activity className={`w-3 h-3 ${stat.color} animate-pulse`} />
                      <span className="text-xs text-muted-foreground font-medium">LIVE</span>
                    </div>
                    {/* Pulse dots */}
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 ${stat.bgColor} rounded-full animate-pulse`}
                          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1.5s' }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Value with improved typography */}
                <div className="space-y-3 mb-6">
                  <p className={`text-4xl font-bold ${stat.color} font-mono tracking-tight leading-none drop-shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground/80 font-semibold uppercase tracking-wider">
                    {stat.title}
                  </p>
                </div>

                {/* Enhanced trend indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stat.bgColor} animate-pulse shadow-sm`}></div>
                    <span className="text-xs text-muted-foreground font-medium">
                      Just updated
                    </span>
                  </div>
                  
                  {/* Trending up indicator */}
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-3 h-3 ${stat.color} opacity-60`} />
                    <span className={`text-xs ${stat.color} font-bold`}>+{Math.floor(Math.random() * 10 + 1)}%</span>
                  </div>
                </div>

                {/* Subtle progress bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border/30 to-transparent">
                  <div className={`h-full bg-gradient-to-r ${stat.progressFrom} ${stat.progressTo} rounded-full animate-pulse`}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-6 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-sm text-foreground font-medium">Platform Status: Operational</span>
            </div>
            <div className="w-px h-4 bg-border/50"></div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-mining-orange" />
              <span className="text-sm text-muted-foreground">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}