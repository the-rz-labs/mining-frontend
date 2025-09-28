import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowRight, Loader2, Shield, Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useSignMessage } from 'wagmi';

export default function SignIn() {
  const [nonce, setNonce] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isWalletAuthenticating, setIsWalletAuthenticating] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { signMessage, isPending: isSigningMessage } = useSignMessage();

  // Handle wallet connection for authentication
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      // Automatically fetch nonce for wallet authentication
      fetchNonceForAuth(address);
    }
  }, [isConnected, address]);

  // Mock API function to fetch nonce for authentication
  const fetchNonceForAuth = async (walletAddress: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/nonce', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ wallet_address: walletAddress })
      // });
      // const data = await response.json();
      
      // Mock nonce for now
      const mockNonce = `Please sign this message to authenticate your account. Nonce: ${Date.now()}`;
      setNonce(mockNonce);
      
      toast({
        title: "Wallet Connected!",
        description: "Please sign the message to authenticate.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch authentication nonce. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle wallet authentication (sign message)
  const handleWalletAuth = async () => {
    if (!nonce || !walletAddress) return;

    setIsWalletAuthenticating(true);
    try {
      await signMessage(
        { message: nonce },
        {
          onSuccess: (sig) => {
            setSignature(sig);
            // Authenticate with backend
            authenticateWithWallet(walletAddress, sig, nonce);
          },
          onError: (error) => {
            setIsWalletAuthenticating(false);
            toast({
              title: "Authentication Failed",
              description: error.message || "Failed to sign message",
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      setIsWalletAuthenticating(false);
      toast({
        title: "Error",
        description: "Failed to sign message for authentication",
        variant: "destructive"
      });
    }
  };

  // Authenticate with wallet credentials
  const authenticateWithWallet = async (walletAddress: string, signature: string, nonce: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/wallet-login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     wallet_address: walletAddress,
      //     signature: signature,
      //     nonce: nonce
      //   })
      // });
      // const data = await response.json();

      // Mock successful authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockUser = {
        id: "wallet-user-123",
        username: `User_${walletAddress.slice(2, 8)}`,
        wallet_address: walletAddress,
      };

      setIsWalletAuthenticating(false);
      toast({
        title: "Welcome back!",
        description: `Successfully authenticated with wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      });
      navigate("/");
    } catch (error) {
      setIsWalletAuthenticating(false);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleConnectWallet = () => {
    open({ view: "Connect" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-neon-green/30 rounded-full blur-3xl md:blur-3xl blur-xl animate-float opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl md:blur-3xl blur-xl animate-breathing opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-neon-green/20 to-mining-orange/20 rounded-full blur-3xl md:blur-3xl blur-xl animate-float opacity-50 hidden sm:block" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-50"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60 hidden md:block"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-neon-green rounded-full animate-float opacity-40 hidden lg:block" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-mining-orange rounded-full animate-float opacity-50 hidden md:block" style={{ animationDelay: "3s" }}></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-purple/10 hover:shadow-neon-purple/20 transition-all duration-500 hover:border-white/20 animate-scale-in">
        <CardHeader className="text-center space-y-6 p-8">
          {/* Navigation */}
          <div className="flex items-center justify-end">
            <Link href="/sign-up">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110" data-testid="link-signup">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Header Section */}
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
              <Shield className="w-8 h-8 text-neon-purple animate-pulse-glow" />
            </div>
            
            <div className="space-y-3 animate-slide-in-left">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-white/70 text-lg animate-fade-in animate-stagger-1">
                Connect your wallet to access mining dashboard
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Wallet Authentication Flow */}
          <div className="space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                !isConnected ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' : 
                'bg-neon-green/20 text-neon-green border border-neon-green/30'
              }`}>
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium">1. Connect</span>
                {isConnected && <CheckCircle className="w-4 h-4" />}
              </div>
              
              <div className={`w-8 h-px transition-all duration-300 ${
                isConnected ? 'bg-neon-green' : 'bg-white/20'
              }`}></div>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                !isConnected ? 'bg-white/5 text-white/40 border border-white/10' :
                signature ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' :
                'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
              }`}>
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">2. Sign</span>
                {signature && <CheckCircle className="w-4 h-4" />}
              </div>
            </div>

            {/* Wallet Status */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-purple/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <Wallet className="w-10 h-10 text-neon-green animate-pulse-glow" />
              </div>
              
              <div className="space-y-2">
                {!isConnected && (
                  <p className="text-white/60 text-lg">
                    Connect your wallet to get started
                  </p>
                )}
                
                {isConnected && address && (
                  <div className="space-y-3">
                    <p className="text-neon-green font-medium">
                      Connected: {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                    
                    {nonce && (
                      <div className="space-y-2">
                        <p className="text-white/60 text-sm">
                          Please sign this message to authenticate:
                        </p>
                        <p className="text-white font-medium text-sm break-all bg-white/5 p-4 rounded-lg border border-white/10 max-w-md mx-auto">
                          {nonce}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!isConnected && (
                <Button
                  type="button"
                  onClick={handleConnectWallet}
                  className="w-full h-14 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02] text-lg"
                  data-testid="button-connect-wallet"
                >
                  <Wallet className="w-6 h-6 mr-3" />
                  Connect Wallet
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              )}

              {isConnected && nonce && !signature && (
                <Button
                  type="button"
                  onClick={handleWalletAuth}
                  className="w-full h-14 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02] text-lg"
                  disabled={isSigningMessage || isWalletAuthenticating}
                  data-testid="button-sign-auth-message"
                >
                  {isSigningMessage || isWalletAuthenticating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-3" />
                      {isSigningMessage ? "Signing Message..." : "Authenticating..."}
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6 mr-3" />
                      Sign Message to Continue
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </>
                  )}
                </Button>
              )}

              {isConnected && signature && (
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-3 text-neon-green p-4 rounded-xl bg-neon-green/10 border border-neon-green/20">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-medium text-lg">Authentication Successful!</span>
                  </div>
                  <p className="text-white/60 text-sm">Redirecting to dashboard...</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-neon-green hover:text-neon-green/80 font-medium transition-colors duration-300">
                Create one now
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}