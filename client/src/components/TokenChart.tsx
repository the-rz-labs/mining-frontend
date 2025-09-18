import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign } from "lucide-react";

type TimeRange = "1H" | "1D" | "1W" | "1M" | "1Y";
type TokenType = "MGC" | "RZ";

interface TokenChartProps {
  token: TokenType;
}

export default function TokenChart({ token }: TokenChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1D");
  
  // todo: remove mock functionality - replace with real chart data
  const mockData = {
    MGC: {
      currentPrice: 0.847,
      change24h: 12.34,
      volume: "2.4M",
      marketCap: "45.2M",
      high24h: 0.892,
      low24h: 0.765
    },
    RZ: {
      currentPrice: 1.234,
      change24h: -3.21,
      volume: "5.8M", 
      marketCap: "78.9M",
      high24h: 1.287,
      low24h: 1.198
    }
  };

  const timeRanges: TimeRange[] = ["1H", "1D", "1W", "1M", "1Y"];
  
  const tokenColors = {
    MGC: {
      primary: "text-neon-purple",
      bg: "bg-purple-900/20",
      border: "border-neon-purple/30",
      button: "bg-neon-purple hover:bg-neon-purple/80"
    },
    RZ: {
      primary: "text-neon-green", 
      bg: "bg-green-900/20",
      border: "border-neon-green/30",
      button: "bg-neon-green hover:bg-neon-green/80"
    }
  };

  const colors = tokenColors[token];
  const data = mockData[token];
  const isPositive = data.change24h > 0;

  // todo: remove mock functionality - generate mock chart points
  const generateMockChartPoints = () => {
    const points = [];
    const basePrice = data.currentPrice;
    const volatility = basePrice * 0.1;
    
    for (let i = 0; i < 50; i++) {
      const variation = (Math.random() - 0.5) * volatility;
      const price = basePrice + variation;
      points.push({
        x: i * 8, // 8px spacing
        y: 60 + (variation / volatility) * 30 // Center around 60px with ±30px range
      });
    }
    return points;
  };

  const chartPoints = generateMockChartPoints();
  const pathData = chartPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <Card 
      className={`p-6 ${colors.bg} border-2 ${colors.border} backdrop-blur-sm hover-elevate transition-all duration-300`}
      data-testid={`token-chart-${token.toLowerCase()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
            <span className={`font-bold text-sm ${colors.primary}`}>{token}</span>
          </div>
          <div>
            <h3 className={`text-lg font-bold ${colors.primary}`}>{token} Token</h3>
            <p className="text-xs text-muted-foreground">
              {token === "MGC" ? "Mining Gaming Coin" : "Ranking Zone Token"}
            </p>
          </div>
        </div>
        <Badge 
          variant={isPositive ? "default" : "destructive"} 
          className="flex items-center space-x-1"
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{isPositive ? '+' : ''}{data.change24h.toFixed(2)}%</span>
        </Badge>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className={`text-3xl font-bold ${colors.primary} font-mono`}>
            ${data.currentPrice.toFixed(3)}
          </span>
          <span className="text-sm text-muted-foreground">USD</span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>24h High: ${data.high24h.toFixed(3)}</span>
          <span>24h Low: ${data.low24h.toFixed(3)}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className={`rounded-lg ${colors.bg} border ${colors.border} p-4 relative overflow-hidden`}>
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="120" className="absolute inset-0">
              <defs>
                <pattern id={`grid-${token}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className={colors.primary}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${token})`} />
            </svg>
          </div>

          {/* Chart Line */}
          <svg width="400" height="120" className="relative z-10">
            <path
              d={pathData}
              fill="none"
              stroke={token === "MGC" ? "#8b5cf6" : "#10b981"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Gradient Fill */}
            <defs>
              <linearGradient id={`gradient-${token}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={token === "MGC" ? "#8b5cf6" : "#10b981"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={token === "MGC" ? "#8b5cf6" : "#10b981"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${pathData} L 400 120 L 0 120 Z`}
              fill={`url(#gradient-${token})`}
            />
          </svg>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2 mb-6">
        {timeRanges.map((range) => (
          <Button
            key={range}
            variant={selectedRange === range ? "default" : "ghost"}
            size="sm"
            data-testid={`time-range-${range.toLowerCase()}`}
            onClick={() => {
              console.log(`Selected ${range} for ${token} chart`);
              setSelectedRange(range);
            }}
            className={selectedRange === range ? colors.button : ""}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Volume 24h</span>
          </div>
          <span className="text-lg font-semibold text-foreground">{data.volume}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Market Cap</span>
          </div>
          <span className="text-lg font-semibold text-foreground">{data.marketCap}</span>
        </div>
      </div>
    </Card>
  );
}