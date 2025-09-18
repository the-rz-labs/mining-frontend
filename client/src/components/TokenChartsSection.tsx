import { BarChart3, TrendingUp } from "lucide-react";
import TokenChart from "./TokenChart";

interface TokenChartsSectionProps {}

export default function TokenChartsSection({}: TokenChartsSectionProps) {
  return (
    <section id="tokens" className="py-20 bg-background" data-testid="token-charts-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BarChart3 className="w-8 h-8 text-mining-orange" />
            <h2 className="text-4xl font-bold text-foreground font-mono">
              <span className="bg-gradient-to-r from-mining-orange via-neon-purple to-neon-green bg-clip-text text-transparent">
                TOKEN PERFORMANCE
              </span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Track real-time performance of MGC and RZ tokens with interactive charts, 
            market data, and comprehensive analytics to make informed mining decisions.
          </p>
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neon-purple"></div>
              <span className="text-sm text-muted-foreground">MGC Token</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-neon-green"></div>
              <span className="text-sm text-muted-foreground">RZ Token</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <TokenChart token="MGC" />
          <TokenChart token="RZ" />
        </div>

        {/* Market Overview */}
        <div className="bg-gradient-to-r from-card/50 to-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center space-x-3">
              <TrendingUp className="w-6 h-6 text-neon-green" />
              <span>Market Overview</span>
            </h3>
            <p className="text-muted-foreground">
              Real-time market insights and performance metrics for both mining tokens
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Total Market Cap",
                value: "$124.1M",
                change: "+8.45%",
                positive: true,
                color: "text-mining-orange"
              },
              {
                title: "24h Volume", 
                value: "$8.2M",
                change: "+12.3%",
                positive: true,
                color: "text-neon-green"
              },
              {
                title: "Active Pairs",
                value: "12",
                change: "+2",
                positive: true,
                color: "text-neon-purple"
              },
              {
                title: "Mining Reward",
                value: "$2.1M",
                change: "+5.7%", 
                positive: true,
                color: "text-cyber-blue"
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-card/30 border border-border/30 hover-elevate"
                data-testid={`market-stat-${index}`}
              >
                <div className={`text-2xl font-bold ${stat.color} font-mono mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {stat.title}
                </div>
                <div className={`text-xs font-medium ${stat.positive ? 'text-neon-green' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}