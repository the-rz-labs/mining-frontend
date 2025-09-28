import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Shield, Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { signInSchema } from "@shared/schema";
import type { z } from "zod";
import { useState, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useSignMessage } from 'wagmi';

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
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
    if (isConnected && address && activeTab === "wallet") {
      setWalletAddress(address);
      // Automatically fetch nonce for wallet authentication
      fetchNonceForAuth(address);
    }
  }, [isConnected, address, activeTab]);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

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
        email: null // Wallet users might not have email
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

  // Traditional email/password sign-in
  const signInMutation = useMutation({
    mutationFn: async (data: SignInForm) => {
      // Hardcoded admin login for testing
      if (data.email === "admin@gmail.com" && data.password === "admin") {
        return { user: { email: "admin@gmail.com", username: "admin" } };
      }
      
      // TODO: Replace with actual API call
      // const response = await apiRequest("POST", "/api/auth/sign-in", data);
      // return response.json();

      // Mock for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error("Invalid email or password");
    },
    onSuccess: (data: any) => {
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${data.user.username}`
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    }
  });

  const onEmailSubmit = (data: SignInForm) => {
    signInMutation.mutate(data);
  };

  const handleConnectWallet = () => {
    setActiveTab("wallet");
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
                Sign in to your mining dashboard
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-1">
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple/80 data-[state=active]:to-neon-green/80 data-[state=active]:text-white text-white/60 rounded-lg transition-all duration-300"
                data-testid="tab-email"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="wallet" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple/80 data-[state=active]:to-neon-green/80 data-[state=active]:text-white text-white/60 rounded-lg transition-all duration-300"
                data-testid="tab-wallet"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </TabsTrigger>
            </TabsList>

            {/* Email/Password Sign In */}
            <TabsContent value="email" className="space-y-6 mt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="animate-slide-in-left animate-stagger-2">
                        <FormLabel className="text-white/80 font-medium">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              type="email"
                              placeholder="your.email@example.com"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-neon-purple/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                              data-testid="input-email"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <Mail className="w-4 h-4 text-white/30" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-neon-purple/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10 pr-12"
                              data-testid="input-password"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <button
                                type="button"
                                className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-all duration-300"
                                onClick={() => setShowPassword(!showPassword)}
                                data-testid="button-toggle-password"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Forgot password link */}
                  <div className="text-center">
                    <Link href="/forgot-password" className="text-neon-purple hover:text-neon-purple/80 text-sm font-medium transition-colors duration-300 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={signInMutation.isPending}
                    data-testid="button-signin"
                  >
                    {signInMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In to Mining Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Wallet Sign In */}
            <TabsContent value="wallet" className="space-y-6 mt-8">
              <div className="space-y-6">
                {/* Wallet Status */}
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-purple/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                    <Wallet className="w-8 h-8 text-neon-green animate-pulse-glow" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/60">
                      {isConnected && address ? 
                        `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : 
                        "Connect your wallet to sign in"
                      }
                    </p>
                    {nonce && (
                      <p className="text-white font-medium text-sm break-all bg-white/5 p-3 rounded-lg border border-white/10">
                        {nonce}
                      </p>
                    )}
                  </div>
                </div>

                {/* Wallet Actions */}
                {!isConnected && (
                  <Button
                    type="button"
                    onClick={handleConnectWallet}
                    className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                    data-testid="button-connect-wallet"
                  >
                    Connect Wallet
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}

                {isConnected && nonce && !signature && (
                  <Button
                    type="button"
                    onClick={handleWalletAuth}
                    className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={isSigningMessage || isWalletAuthenticating}
                    data-testid="button-sign-auth-message"
                  >
                    {isSigningMessage || isWalletAuthenticating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {isSigningMessage ? "Signing Message..." : "Authenticating..."}
                      </>
                    ) : (
                      <>
                        Sign Message to Authenticate
                        <Shield className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {isConnected && signature && (
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-neon-green">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Authenticated Successfully!</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

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