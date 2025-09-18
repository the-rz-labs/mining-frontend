import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign } from "lucide-react";

type TimeRange = "1W" | "1M" | "1Y";
type TokenType = "MGC" | "RZ";

interface TokenChartProps {
  token: TokenType;
}

// CoinGecko API endpoints
const COINGECKO_ENDPOINTS = {
  MGC: 'https://api.coingecko.com/api/v3/coins/meta-games-coin/market_chart?vs_currency=usd',
  RZ: 'https://api.coingecko.com/api/v3/coins/rzcoin/market_chart?vs_currency=usd'
};

const TIME_RANGE_DAYS = {
  '1W': 7,
  '1M': 30,
  '1Y': 365
};

export default function TokenChart({ token }: TokenChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1W");
  
  // Fetch real data from CoinGecko API
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['token-chart', token, selectedRange],
    queryFn: async () => {
      const days = TIME_RANGE_DAYS[selectedRange];
      const response = await fetch(`${COINGECKO_ENDPOINTS[token]}&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch token data');
      }
      const data = await response.json();
      
      // Process the data
      const prices = data.prices || [];
      const volumes = data.total_volumes || [];
      
      if (prices.length === 0) {
        throw new Error('No price data available');
      }
      
      const currentPrice = prices[prices.length - 1]?.[1] || 0;
      const previousPrice = prices[0]?.[1] || currentPrice;
      const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;
      
      // Calculate high and low
      const pricesOnly = prices.map((p: [number, number]) => p[1]);
      const high = Math.max(...pricesOnly);
      const low = Math.min(...pricesOnly);
      
      // Calculate total volume
      const totalVolume = volumes.reduce((acc: number, vol: [number, number]) => acc + (vol[1] || 0), 0);
      
      return {
        currentPrice,
        change24h,
        volume: (totalVolume / 1000000).toFixed(1) + 'M',
        high24h: high,
        low24h: low,
        chartPoints: prices.map((price: [number, number], index: number) => ({
          timestamp: price[0],
          price: price[1]
        }))
      };
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000 // 5 minutes
  });

  const timeRanges: TimeRange[] = ["1W", "1M", "1Y"];
  
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
  const data = chartData || { currentPrice: 0, change24h: 0, volume: '0M', high24h: 0, low24h: 0, chartPoints: [] };
  const isPositive = data.change24h > 0;

  // Process chart points for SVG
  const processChartPoints = () => {
    if (!data.chartPoints || data.chartPoints.length === 0) {
      return { pathData: '', points: [] };
    }
    
    const prices = data.chartPoints.map((p: {timestamp: number, price: number}) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    
    const points = data.chartPoints.map((point: {timestamp: number, price: number}, index: number) => {
      const x = (index / (data.chartPoints.length - 1)) * 380; // Scale to 380px width
      const normalizedPrice = (point.price - minPrice) / priceRange;
      const y = 100 - (normalizedPrice * 80); // Invert Y axis, use 80px range with 10px margins
      return { x, y };
    });
    
    const pathData = points.map((point: {x: number, y: number}, index: number) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    return { pathData, points };
  };
  
  const { pathData, points } = processChartPoints();

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
        <div className={`rounded-lg ${colors.bg} border ${colors.border} p-4 relative overflow-hidden h-32`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-current opacity-50"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading chart...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Failed to load chart data
            </div>
          ) : pathData ? (
            <>
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
              <svg width="100%" height="120" className="relative z-10" viewBox="0 0 380 120">
                <defs>
                  <linearGradient id={`gradient-${token}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={token === "MGC" ? "#8b5cf6" : "#10b981"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={token === "MGC" ? "#8b5cf6" : "#10b981"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={pathData}
                  fill="none"
                  stroke={token === "MGC" ? "#8b5cf6" : "#10b981"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`${pathData} L 380 120 L 0 120 Z`}
                  fill={`url(#gradient-${token})`}
                />
              </svg>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No chart data available
            </div>
          )}
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
            <span className="text-sm text-muted-foreground">Range High</span>
          </div>
          <span className="text-lg font-semibold text-foreground">
            {isLoading ? '...' : `$${data.high24h?.toFixed(4) || '0.0000'}`}
          </span>
        </div>
      </div>
    </Card>
  );
}