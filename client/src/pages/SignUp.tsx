import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Shield, KeyRound, Users, ArrowRight, Loader2, Wallet, Image, CheckCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AvatarSelection, getRandomAvatar } from "@/components/AvatarSelection";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useSignMessage } from 'wagmi';
import { z } from "zod";

type Step = 1 | 2 | 3 | 4;

// Define the schemas for the new flow
const finalRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  avatar_id: z.string().min(1, "Please select an avatar"),
  invite_code: z.string().optional()
});

type FinalRegistrationForm = z.infer<typeof finalRegistrationSchema>;

export default function SignUp() {
  const [step, setStep] = useState<Step>(1);
  const [nonce, setNonce] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { signMessage, isPending: isSigningMessage } = useSignMessage();

  // Handle wallet connection
  useEffect(() => {
    if (isConnected && address && step === 1) {
      setWalletAddress(address);
      // Automatically fetch nonce and move to step 2
      fetchNonce(address);
    }
  }, [isConnected, address, step]);

  // Set random avatar if none selected when reaching step 3
  useEffect(() => {
    if (step === 3 && !selectedAvatar) {
      setSelectedAvatar(getRandomAvatar());
    }
  }, [step, selectedAvatar]);

  // Extract invite code from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref") || params.get("invite");
    if (refParam) {
      setInviteCode(refParam);
    }
  }, []);

  // Fetch nonce from API
  const fetchNonce = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/wallets/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch nonce');
      }
      
      const data = await response.json();
      // API returns { id: nonce_id, message: "message to sign" }
      setNonce(data.message);
      // Store nonce_id for later use
      (window as any).__nonce_id = data.id;
      setStep(2);
      
      toast({
        title: "Wallet Connected!",
        description: "Please sign the message to verify ownership.",
      });
    } catch (error) {
      console.error("Fetch nonce error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch nonce. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle message signing
  const handleSignMessage = async () => {
    if (!nonce || !walletAddress) return;

    try {
      await signMessage(
        { message: nonce },
        {
          onSuccess: (sig) => {
            setSignature(sig);
            setStep(3);
            toast({
              title: "Message Signed!",
              description: "Now let's set up your avatar.",
            });
          },
          onError: (error) => {
            toast({
              title: "Signing Failed",
              description: error.message || "Failed to sign message",
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign message",
        variant: "destructive"
      });
    }
  };

  // Final registration form
  const finalForm = useForm<FinalRegistrationForm>({
    resolver: zodResolver(finalRegistrationSchema),
    defaultValues: {
      email: "",
      username: "",
      avatar_id: selectedAvatar || "",
      invite_code: inviteCode
    }
  });

  // Update form when selectedAvatar or inviteCode changes
  useEffect(() => {
    if (selectedAvatar) {
      finalForm.setValue("avatar_id", selectedAvatar);
    }
  }, [selectedAvatar, finalForm]);

  useEffect(() => {
    if (inviteCode) {
      finalForm.setValue("invite_code", inviteCode);
    }
  }, [inviteCode, finalForm]);

  // Final registration mutation
  const finalRegistrationMutation = useMutation({
    mutationFn: async (data: FinalRegistrationForm) => {
      const nonceId = (window as any).__nonce_id;
      
      if (!nonceId) {
        throw new Error('Nonce ID not found');
      }

      // Map avatar URL to avatar_key (the API expects one of 4 avatar keys)
      // Since we're using avatar URLs, we'll use the avatar_id as the key
      // The API documentation shows avatar_key is an enum with 4 options
      const avatarKey = data.avatar_id.split('/').pop()?.split('.')[0] || 'avatar1';

      const response = await fetch('/api/auth/wallet-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: walletAddress,
          signature: signature,
          nonce_id: nonceId,
          provider: 'metamask',
          email: data.email,
          username: data.username,
          avatar_key: avatarKey,
          invite: data.invite_code
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 200) {
          throw new Error('Wallet already connected to another account');
        } else if (response.status === 409) {
          throw new Error('This wallet is already registered');
        }
        throw new Error(responseData.error || 'Registration failed');
      }

      return responseData;
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: `Welcome to Mining!`
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    }
  });

  const onFinalSubmit = (data: FinalRegistrationForm) => {
    finalRegistrationMutation.mutate(data);
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Connect Your Wallet";
      case 2: return "Verify Ownership";
      case 3: return "Choose Your Avatar";
      case 4: return "Complete Registration";
      default: return "Join Mining";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Connect your wallet to get started";
      case 2: return "Sign a message to verify wallet ownership";
      case 3: return "Select an avatar for your profile";
      case 4: return "Fill in your details to complete registration";
      default: return "Start your crypto mining journey";
    }
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
          <div className="flex items-center justify-between">
            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackStep}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110" data-testid="link-signin">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-neon-purple to-neon-green text-white shadow-lg shadow-neon-purple/50' 
                      : 'bg-white/10 text-white/40 border border-white/20'
                  }`}
                >
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                    step > stepNumber ? 'bg-gradient-to-r from-neon-purple to-neon-green' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3 animate-slide-in-left">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent tracking-tight">
              {getStepTitle()}
            </CardTitle>
            <CardDescription className="text-white/70 text-lg animate-fade-in animate-stagger-1">
              {getStepDescription()}
            </CardDescription>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  num === step
                    ? "bg-neon-purple w-8"
                    : num < step
                    ? "bg-neon-green"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Step 1: Wallet Connection */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-3 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <Wallet className="w-8 h-8 text-neon-purple animate-pulse-glow" />
                </div>
                <p className="text-white/60 animate-slide-in-left animate-stagger-1">
                  {isConnected && address ? 
                    `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : 
                    "Connect your wallet to get started"
                  }
                </p>
              </div>

              <Button
                type="button"
                onClick={() => open({ view: "Connect" })}
                className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                disabled={isConnected}
                data-testid="button-connect-wallet"
              >
                {isConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Wallet Connected
                  </>
                ) : (
                  <>
                    Connect Wallet
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Sign Message */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-mining-orange/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <Shield className="w-8 h-8 text-neon-green animate-pulse-glow" />
                </div>
                <div className="space-y-2 animate-slide-in-left animate-stagger-1">
                  <p className="text-white/60">Please sign the message to verify ownership</p>
                  <p className="text-white font-medium text-sm break-all bg-white/5 p-3 rounded-lg border border-white/10">
                    {nonce}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSignMessage}
                className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                disabled={isSigningMessage}
                data-testid="button-sign-message"
              >
                {isSigningMessage ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing Message...
                  </>
                ) : (
                  <>
                    Sign Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 3: Avatar Selection */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mining-orange/20 to-neon-purple/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <Image className="w-8 h-8 text-mining-orange animate-pulse-glow" />
                </div>
                <div className="space-y-2 animate-slide-in-left animate-stagger-1">
                  <p className="text-white/60">Choose your avatar</p>
                  <p className="text-white font-medium">This will represent you in the mining platform</p>
                </div>
              </div>

              <div className="space-y-6">
                <AvatarSelection
                  selectedAvatar={selectedAvatar}
                  onAvatarSelect={setSelectedAvatar}
                />

                <Button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                  disabled={!selectedAvatar}
                  data-testid="button-continue-avatar"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Final Registration */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 animate-fade-in">
                {selectedAvatar ? (
                  <Avatar className="w-28 h-28 mx-auto border-2 border-neon-green/50 shadow-lg shadow-neon-green/20">
                    <AvatarImage 
                      src={selectedAvatar} 
                      alt="Your profile avatar" 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-neon-purple/30 to-neon-green/30 text-white">
                      <Users className="w-8 h-8 text-neon-green animate-pulse-glow" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-neon-green/20 to-neon-purple/20 flex items-center justify-center border-2 border-white/20">
                    <Users className="w-8 h-8 text-neon-green animate-pulse-glow" />
                  </div>
                )}
                <div className="space-y-2 animate-slide-in-left animate-stagger-1">
                  <p className="text-white/60">Almost there!</p>
                  <p className="text-white font-medium">Complete your mining account</p>
                </div>
              </div>

              <Form {...finalForm}>
                <form onSubmit={finalForm.handleSubmit(onFinalSubmit)} className="space-y-6">
                  <FormField
                    control={finalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-neon-green/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                              data-testid="input-email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={finalForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              placeholder="Choose a unique username"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-neon-green/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                              data-testid="input-username"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <Users className="w-4 h-4 text-white/30" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={finalForm.control}
                    name="invite_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Invite Code (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              placeholder="Enter invite code if you have one"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-neon-green/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                              data-testid="input-invite-code"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={finalRegistrationMutation.isPending}
                    data-testid="button-complete-registration"
                  >
                    {finalRegistrationMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}