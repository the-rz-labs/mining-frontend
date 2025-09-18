import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Cpu, DollarSign, Zap } from "lucide-react";

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
      bgColor: "bg-purple-900/20",
      borderColor: "border-neon-purple/30"
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-neon-green",
      bgColor: "bg-green-900/20",
      borderColor: "border-neon-green/30"
    },
    {
      title: "Total Staked",
      value: `$${(stats.totalStaked / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-mining-orange",
      bgColor: "bg-orange-900/20",
      borderColor: "border-mining-orange/30"
    },
    {
      title: "Total Paid",
      value: `$${(stats.totalPaid / 1000000).toFixed(1)}M`,
      icon: Zap,
      color: "text-cyber-blue",
      bgColor: "bg-blue-900/20",
      borderColor: "border-cyber-blue/30"
    }
  ];

  return (
    <section id="stats" className="py-20 bg-background" data-testid="live-stats-section">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <Card
              key={stat.title}
              className={`relative overflow-hidden border-2 ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm hover-elevate group transition-all duration-300 hover:scale-105`}
              data-testid={`stat-card-${index}`}
            >
              {/* Animated Background Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-transparent opacity-0 group-hover:opacity-10 rounded-lg blur-xl transition-opacity duration-500`}></div>
              
              <div className="relative p-6">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-4 ${stat.bgColor} rounded-full animate-pulse`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <p className={`text-3xl font-bold ${stat.color} font-mono tracking-wider`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                </div>

                {/* Trend Indicator */}
                <div className="mt-4 flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${stat.color.replace('text-', 'bg-')} animate-pulse`}></div>
                  <span className="text-xs text-muted-foreground">
                    Updated now
                  </span>
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