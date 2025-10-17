import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Coins, TrendingUp, Download, ArrowDownToLine, Loader2, ExternalLink, Calendar, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

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

interface ClaimSignature {
  symbol: string;
  to: string;
  token: string;
  amount_scaled: string;
  nonce: number;
  deadline: number;
  signature: string;
  chain_id: number;
  verifying_contract: string;
  intent_id: number;
  expires_in_seconds: number;
}

interface ClaimIntent {
  id: number;
  user_id: number;
  token_symbol: string;
  token_address: string;
  user_address: string;
  amount_scaled: number;
  nonce: number;
  deadline: number;
  signature: string;
  status: "pending" | "confirmed" | "failed";
  created_at: string;
  updated_at: string;
  tx_hash?: string;
}

interface ClaimTx {
  id: number;
  user_id: number;
  user_address: string;
  token_symbol: string;
  token_address: string;
  amount_scaled: number;
  nonce: number;
  tx_hash: string;
  created_at: string;
}

interface ClaimHistoryResponse {
  user_id: number;
  claim_intents: ClaimIntent[];
  claim_txs: ClaimTx[];
}

const CLAIM_ABI = [
  {
    type: "function",
    name: "claim",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "signature", type: "bytes", internalType: "bytes" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
] as const;

export default function Earnings() {
  const { toast } = useToast();
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<EarningsSummary | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [claimSignature, setClaimSignature] = useState<ClaimSignature | null>(null);

  const { data: minersData, isLoading } = useQuery<MinersResponse>({
    queryKey: ['/api/stakes/miners'],
    refetchInterval: 5000,
  });

  const { data: claimHistory, isLoading: isHistoryLoading } = useQuery<ClaimHistoryResponse>({
    queryKey: ['/api/claims/history'],
    refetchInterval: 10000,
  });

  const { 
    writeContract, 
    data: txHash, 
    isPending: isContractPending,
    error: writeError 
  } = useWriteContract();

  const { 
    isLoading: isTxConfirming, 
    isSuccess: isTxSuccess,
    error: txError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const getSignatureMutation = useMutation({
    mutationFn: async ({ symbol, amount }: { symbol: string; amount: string }) => {
      const response = await apiRequest('POST', '/api/claims/sign', { symbol, amount });
      console.log("Received signature response:", response);
      return response as ClaimSignature;
    },
    onSuccess: (data) => {
      console.log("Signature data received:", data);
      setClaimSignature(data);
      executeContractClaim(data);
    },
    onError: (error: any) => {
      console.error("Signature mutation error:", error);
      toast({
        title: "Signature Failed",
        description: error.message || "Failed to get withdrawal signature. Please try again.",
        variant: "destructive",
      });
      setWithdrawDialogOpen(false);
    },
  });

  const executeContractClaim = (signature: ClaimSignature | null | undefined) => {
    try {
      console.log("Executing contract claim with signature:", signature);
      
      // Validate signature object exists
      if (!signature) {
        throw new Error("No signature data received");
      }
      
      // Validate required fields
      if (!signature.signature) {
        console.error("Missing signature field, full object:", signature);
        throw new Error("Missing signature from API response");
      }
      if (!signature.token) {
        console.error("Missing token field, full object:", signature);
        throw new Error("Missing token address from API response");
      }
      if (!signature.amount_scaled) {
        console.error("Missing amount_scaled field, full object:", signature);
        throw new Error("Missing amount_scaled from API response");
      }
      if (!signature.deadline) {
        console.error("Missing deadline field, full object:", signature);
        throw new Error("Missing deadline from API response");
      }
      if (!signature.verifying_contract) {
        console.error("Missing verifying_contract field, full object:", signature);
        throw new Error("Missing verifying_contract from API response");
      }
      
      // Add 0x prefix to signature if not present
      const formattedSignature = signature.signature.startsWith('0x') 
        ? signature.signature 
        : `0x${signature.signature}`;
      
      console.log("Calling writeContract with:", {
        address: signature.verifying_contract,
        token: signature.token,
        amount: signature.amount_scaled,
        deadline: signature.deadline,
        signature: formattedSignature,
        chainId: signature.chain_id,
      });
      
      writeContract({
        address: signature.verifying_contract as `0x${string}`,
        abi: CLAIM_ABI,
        functionName: "claim",
        args: [
          signature.token as `0x${string}`,
          BigInt(signature.amount_scaled),
          BigInt(signature.deadline),
          formattedSignature as `0x${string}`
        ],
        chainId: signature.chain_id,
      });
    } catch (error: any) {
      console.error("Contract execution error:", error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to execute withdrawal transaction.",
        variant: "destructive",
      });
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setClaimSignature(null);
    }
  };

  useEffect(() => {
    if (isTxSuccess && selectedToken) {
      toast({
        title: "Withdrawal Successful",
        description: `Your ${selectedToken.symbol} has been withdrawn successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stakes/miners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/claims/history'] });
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setClaimSignature(null);
    }
  }, [isTxSuccess, selectedToken, toast]);

  useEffect(() => {
    if (writeError) {
      toast({
        title: "Transaction Rejected",
        description: writeError.message || "You rejected the transaction in your wallet.",
        variant: "destructive",
      });
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setClaimSignature(null);
    }
  }, [writeError, toast]);

  useEffect(() => {
    if (txError) {
      toast({
        title: "Transaction Failed",
        description: txError.message || "The transaction failed on the blockchain. Please try again.",
        variant: "destructive",
      });
      setWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setClaimSignature(null);
    }
  }, [txError, toast]);

  const handleWithdrawClick = (earning: EarningsSummary) => {
    setSelectedToken(earning);
    setWithdrawAmount(earning.pending);
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawSubmit = () => {
    if (!selectedToken || !withdrawAmount) return;
    
    const amount = parseFloat(withdrawAmount);
    const pending = parseFloat(selectedToken.pending);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > pending) {
      toast({
        title: "Insufficient Balance",
        description: `You can only withdraw up to ${formatAmount(selectedToken.pending)} ${selectedToken.symbol}.`,
        variant: "destructive",
      });
      return;
    }
    
    getSignatureMutation.mutate({ 
      symbol: selectedToken.symbol, 
      amount: withdrawAmount 
    });
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "0.00";
    return num.toFixed(6);
  };

  const isProcessing = getSignatureMutation.isPending || isContractPending || isTxConfirming;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Earnings Overview
        </h1>
        <p className="text-sm md:text-base text-white/60">
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
                    onClick={() => handleWithdrawClick(earning)}
                    disabled={parseFloat(earning.pending) === 0}
                    className={`w-full ${isMGC ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-neon-purple/30' : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:shadow-mining-orange/30'} hover:opacity-90 text-white font-semibold py-6 text-lg transition-all duration-300 shadow-lg`}
                    data-testid={`button-withdraw-${earning.symbol}`}
                  >
                    <ArrowDownToLine className="w-5 h-5 mr-2" />
                    Withdraw {earning.symbol}
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

      {/* Claim Transaction History */}
      <Card className="border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Download className="w-6 h-6 mr-3 text-neon-purple" />
            Withdrawal History
          </CardTitle>
          <CardDescription className="text-white/60">
            Your recent withdrawal transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isHistoryLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full bg-white/10" />
              ))}
            </div>
          ) : claimHistory && claimHistory.claim_txs.length > 0 ? (
            <div className="space-y-3">
              {claimHistory.claim_txs.map((claim) => {
                const isMGC = claim.token_symbol === 'MGC';
                const divisor = isMGC ? 1e9 : 1e18;
                const amount = (claim.amount_scaled / divisor).toFixed(6);
                const tokenGradient = isMGC 
                  ? 'from-purple-600 to-purple-500' 
                  : 'from-orange-600 to-orange-500';
                const bscscanUrl = `https://bscscan.com/tx/${claim.tx_hash}`;

                return (
                  <div
                    key={claim.id}
                    className={`p-4 md:p-5 rounded-xl bg-gradient-to-r ${isMGC ? 'from-purple-500/10 to-purple-600/5' : 'from-orange-500/10 to-orange-600/5'} border ${isMGC ? 'border-purple-500/30' : 'border-orange-500/30'} hover:border-white/40 transition-all duration-300 hover:shadow-lg ${isMGC ? 'hover:shadow-purple-500/20' : 'hover:shadow-orange-500/20'}`}
                    data-testid={`claim-history-${claim.id}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                      {/* Token Icon & Amount */}
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${tokenGradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Coins className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-white/50 text-xs font-medium mb-1">Amount</p>
                          <p className={`text-xl md:text-2xl font-bold ${isMGC ? 'text-purple-400' : 'text-orange-400'}`}>
                            {amount} {claim.token_symbol}
                          </p>
                        </div>
                      </div>

                      {/* Date & Wallet - Stacked on mobile, side-by-side on tablet+ */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:flex-1 lg:justify-center">
                        {/* Date */}
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-white/40 flex-shrink-0" />
                          <div>
                            <p className="text-white/50 text-xs font-medium mb-1">Date</p>
                            <p className="text-white text-sm font-medium">
                              {new Date(claim.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-white/60 text-xs">
                              {new Date(claim.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {/* Wallet Address */}
                        <div className="flex items-center space-x-3">
                          <Wallet className="w-5 h-5 text-white/40 flex-shrink-0" />
                          <div>
                            <p className="text-white/50 text-xs font-medium mb-1">Wallet</p>
                            <p className="text-white text-sm font-mono">
                              {claim.user_address.slice(0, 6)}...{claim.user_address.slice(-4)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Link */}
                      <a
                        href={bscscanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r ${tokenGradient} hover:opacity-90 transition-opacity w-full lg:w-auto`}
                        data-testid={`link-bscscan-${claim.id}`}
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-semibold whitespace-nowrap">View on BSCScan</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Download className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 text-lg">No withdrawal history yet</p>
              <p className="text-white/40 text-sm mt-2">
                Your withdrawal transactions will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-black/95 to-black/90 border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Withdraw {selectedToken?.symbol}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Enter the amount you want to withdraw from your earnings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Available Balance */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Available to Withdraw</p>
              <p className="text-2xl font-bold text-neon-green" data-testid="text-available-balance">
                {formatAmount(selectedToken?.pending || "0")} {selectedToken?.symbol}
              </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount" className="text-white">
                Withdrawal Amount
              </Label>
              <div className="relative">
                <Input
                  id="withdraw-amount"
                  type="number"
                  step="0.000001"
                  placeholder="0.000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-20"
                  disabled={isProcessing}
                  data-testid="input-withdraw-amount"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setWithdrawAmount(selectedToken?.pending || "")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neon-purple hover:text-neon-green"
                  disabled={isProcessing}
                  data-testid="button-max-amount"
                >
                  MAX
                </Button>
              </div>
            </div>

            {/* Transaction Status */}
            {isProcessing && (
              <div className="p-4 rounded-lg bg-neon-purple/10 border border-neon-purple/30">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                  <div>
                    <p className="text-white font-semibold">Processing Withdrawal...</p>
                    <p className="text-white/60 text-sm">
                      {getSignatureMutation.isPending && "Getting signature..."}
                      {isContractPending && "Confirm transaction in wallet..."}
                      {isTxConfirming && "Confirming transaction on blockchain..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWithdrawDialogOpen(false)}
                disabled={isProcessing}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                data-testid="button-cancel-withdraw"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleWithdrawSubmit}
                disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className={`flex-1 ${selectedToken?.symbol === 'MGC' ? 'bg-gradient-to-r from-purple-600 to-purple-500' : 'bg-gradient-to-r from-orange-600 to-orange-500'} hover:opacity-90`}
                data-testid="button-confirm-withdraw"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="w-4 h-4 mr-2" />
                    Withdraw
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
