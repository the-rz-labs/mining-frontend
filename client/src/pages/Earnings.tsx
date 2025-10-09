import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Coins, TrendingUp, Download, ArrowDownToLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface EarningsSummary {
  symbol: string;
  total_accrued: string;
  total_withdrawn: string;
  pending: string;
}

interface MinersResponse {
  total_power: number;
  total_staked: string;
  earnings_summary: EarningsSummary[];
  miners: any[];
}

export default function Earnings() {
  const { toast } = useToast();

  const { data: minersData, isLoading } = useQuery<MinersResponse>({
    queryKey: ['/api/stakes/miners'],
    refetchInterval: 5000,
  });

  const withdrawMutation = useMutation({
    mutationFn: async ({ symbol }: { symbol: string }) => {
      // TODO: Replace with actual withdraw endpoint when available
      return apiRequest('POST', '/api/stakes/withdraw', { token: symbol });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Withdrawal Initiated",
        description: `Your ${variables.symbol} withdrawal request has been submitted successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stakes/miners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWithdraw = (symbol: string) => {
    withdrawMutation.mutate({ symbol });
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "0.00";
    return num.toFixed(6);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Earnings Overview
        </h1>
        <p className="text-white/60">
          View and manage your mining earnings across all tokens
        </p>
      </div>

      {/* Earnings Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 bg-white/5" />
          <Skeleton className="h-64 bg-white/5" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {minersData?.earnings_summary?.map((earning) => {
            const isMGC = earning.symbol === 'MGC';
            return (
              <Card
                key={earning.symbol}
                className={`border-2 ${isMGC ? 'border-neon-purple/30 bg-gradient-to-br from-white/5 to-neon-purple/10 hover:shadow-neon-purple/20' : 'border-mining-orange/30 bg-gradient-to-br from-white/5 to-mining-orange/10 hover:shadow-mining-orange/20'} backdrop-blur-xl shadow-lg transition-all duration-300`}
                data-testid={`earnings-card-${earning.symbol}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full ${isMGC ? 'bg-gradient-to-br from-purple-600 to-purple-500' : 'bg-gradient-to-br from-orange-600 to-orange-500'} flex items-center justify-center`}>
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">
                          {earning.symbol}
                        </CardTitle>
                        <CardDescription className="text-white/60">
                          {isMGC ? 'Meta Games Coin' : 'RZ Token'}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Earnings Stats */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-white/60 text-sm">Total Accrued</p>
                        <p className="text-2xl font-bold text-white" data-testid={`text-total-accrued-${earning.symbol}`}>
                          {formatAmount(earning.total_accrued)}
                        </p>
                      </div>
                      <TrendingUp className={`w-8 h-8 ${isMGC ? 'text-neon-purple' : 'text-mining-orange'}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm mb-1">Withdrawn</p>
                        <p className="text-lg font-semibold text-white" data-testid={`text-withdrawn-${earning.symbol}`}>
                          {formatAmount(earning.total_withdrawn)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm mb-1">Pending</p>
                        <p className="text-lg font-semibold text-neon-green" data-testid={`text-pending-${earning.symbol}`}>
                          {formatAmount(earning.pending)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <Button
                    onClick={() => handleWithdraw(earning.symbol)}
                    disabled={withdrawMutation.isPending || parseFloat(earning.pending) === 0}
                    className={`w-full ${isMGC ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-neon-purple/30' : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:shadow-mining-orange/30'} hover:opacity-90 text-white font-semibold py-6 text-lg transition-all duration-300 shadow-lg`}
                    data-testid={`button-withdraw-${earning.symbol}`}
                  >
                    {withdrawMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-5 h-5 mr-2" />
                        Withdraw {earning.symbol}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No Earnings State */}
      {!isLoading && (!minersData?.earnings_summary || minersData.earnings_summary.length === 0) && (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 text-neon-purple" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Earnings Yet</h3>
            <p className="text-white/60 mb-6">
              Start mining to begin earning tokens
            </p>
            <Link href="/app/miners">
              <Button
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400"
              >
                Browse Mining Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
