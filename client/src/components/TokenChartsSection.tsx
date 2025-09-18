import { BarChart3 } from "lucide-react";
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

      </div>
    </section>
  );
}