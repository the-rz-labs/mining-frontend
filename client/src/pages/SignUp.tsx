import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Mail, Shield, KeyRound, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sendCodeSchema, verifyCodeSchema, insertUserSchema } from "@shared/schema";
import type { z } from "zod";

type Step = 1 | 2 | 3;

type SendCodeForm = z.infer<typeof sendCodeSchema>;
type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;
type SignUpForm = z.infer<typeof insertUserSchema>;

export default function SignUp() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Extract referral code from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get("ref");
    if (refParam) {
      setReferralCode(refParam);
    }
  }, []);

  // Step 1: Send verification code
  const emailForm = useForm<SendCodeForm>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: { email: "" }
  });

  const sendCodeMutation = useMutation({
    mutationFn: async (data: SendCodeForm) => {
      const response = await apiRequest("POST", "/api/auth/send-code", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification code sent!",
        description: "Check your email for the 6-digit verification code."
      });
      setStep(2);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive"
      });
    }
  });

  // Step 2: Verify code
  const codeForm = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { email: "", code: "" }
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async (data: VerifyCodeForm) => {
      const response = await apiRequest("POST", "/api/auth/verify-code", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email verified!",
        description: "Now create your account details."
      });
      setStep(3);
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive"
      });
    }
  });

  // Step 3: Complete signup
  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { 
      email: "", 
      username: "", 
      password: "",
      referredByUserId: referralCode
    }
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpForm) => {
      const response = await apiRequest("POST", "/api/auth/sign-up", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Account created successfully!",
        description: `Welcome to Mining, ${data.user.username}!`
      });
      navigate("/"); // Navigate to home or dashboard
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    }
  });

  const onSendCode = (data: SendCodeForm) => {
    setEmail(data.email);
    sendCodeMutation.mutate(data);
  };

  const onVerifyCode = (data: VerifyCodeForm) => {
    verifyCodeMutation.mutate({ ...data, email });
  };

  const onSignUp = (data: SignUpForm) => {
    signUpMutation.mutate({ ...data, email });
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  // Update form email when step changes
  useEffect(() => {
    if (step === 2) {
      codeForm.setValue("email", email);
    }
    if (step === 3) {
      signUpForm.setValue("email", email);
      signUpForm.setValue("referredByUserId", referralCode);
    }
  }, [step, email, referralCode, codeForm, signUpForm]);

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
            {[1, 2, 3].map((stepNumber) => (
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
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                    step > stepNumber ? 'bg-gradient-to-r from-neon-purple to-neon-green' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3 animate-slide-in-left">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent tracking-tight">
              Join Mining
            </CardTitle>
            <CardDescription className="text-white/70 text-lg animate-fade-in animate-stagger-1">
              {step === 1 && "Start your crypto mining journey"}
              {step === 2 && "Verify your email address"}
              {step === 3 && "Complete your account setup"}
            </CardDescription>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  num === step
                    ? "bg-neon-purple w-8"
                    : num < step
                    ? "bg-neon-green"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-3 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <Mail className="w-8 h-8 text-neon-purple animate-pulse-glow" />
                </div>
                <p className="text-white/60 animate-slide-in-left animate-stagger-1">Enter your email to get started</p>
              </div>

              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSendCode)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={sendCodeMutation.isPending}
                    data-testid="button-send-code"
                  >
                    {sendCodeMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-mining-orange/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <Shield className="w-8 h-8 text-neon-green animate-pulse-glow" />
                </div>
                <div className="space-y-2 animate-slide-in-left animate-stagger-1">
                  <p className="text-white/60">We sent a verification code to</p>
                  <p className="text-white font-medium">{email}</p>
                </div>
              </div>

              <Form {...codeForm}>
                <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-6">
                  <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Verification Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="000000"
                              className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center font-mono text-2xl tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-neon-green/50 focus:border-transparent transition-all duration-300"
                              maxLength={6}
                              data-testid="input-code"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <KeyRound className="w-5 h-5 text-white/30" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={verifyCodeMutation.isPending}
                    data-testid="button-verify-code"
                  >
                    {verifyCodeMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                </form>
              </Form>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => {
                  setStep(1);
                  sendCodeMutation.reset();
                }}
                data-testid="button-resend-code"
              >
                Resend Code
              </Button>
            </div>
          )}

          {/* Step 3: Complete Registration */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mining-orange/20 to-neon-purple/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                  <Users className="w-8 h-8 text-mining-orange animate-pulse-glow" />
                </div>
                <div className="space-y-2 animate-slide-in-left animate-stagger-1">
                  <p className="text-white/60">Almost there!</p>
                  <p className="text-white font-medium">Complete your mining account</p>
                </div>
              </div>

              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Username</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              placeholder="Choose a unique username"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-mining-orange/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
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
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              type="password"
                              placeholder="Create a secure password"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-mining-orange/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                              data-testid="input-password"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                              <KeyRound className="w-4 h-4 text-white/30" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="referredByUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 font-medium">Referral Code (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              placeholder="Enter referral code"
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-mining-orange/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                              data-testid="input-referral"
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-mining-orange to-neon-purple hover:from-mining-orange/80 hover:to-neon-purple/80 text-white font-semibold rounded-xl shadow-lg shadow-mining-orange/20 hover:shadow-mining-orange/40 transition-all duration-300 hover:scale-[1.02]"
                    disabled={signUpMutation.isPending}
                    data-testid="button-create-account"
                  >
                    {signUpMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* Terms and Privacy */}
          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>By creating an account, you agree to our</p>
            <div className="flex items-center justify-center gap-1">
              <Link href="#" className="text-neon-purple hover:underline">
                Terms of Service
              </Link>
              <span>and</span>
              <Link href="#" className="text-neon-purple hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}