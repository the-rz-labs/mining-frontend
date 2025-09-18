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
    mutationFn: (data: SendCodeForm) => apiRequest("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify(data),
    }),
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
    mutationFn: (data: VerifyCodeForm) => apiRequest("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify(data),
    }),
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
    mutationFn: (data: SignUpForm) => apiRequest("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: (data: any) => {
      toast({
        title: "Account created successfully!",
        description: `Welcome to Ranking, ${data.user.username}!`
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mining-orange/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <Card className="w-full max-w-md relative z-10 border-2 border-neon-purple/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            {step > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackStep}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" data-testid="link-signin">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Join Ranking
            </CardTitle>
            <CardDescription className="text-muted-foreground">
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

        <CardContent className="space-y-6">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSendCode)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neon-purple" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@example.com"
                          className="border-2 border-muted focus:border-neon-purple/50 transition-colors"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold"
                  disabled={sendCodeMutation.isPending}
                  data-testid="button-send-code"
                >
                  {sendCodeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Shield className="w-8 h-8 text-neon-green mx-auto" />
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to <strong className="text-foreground">{email}</strong>
                </p>
              </div>

              <Form {...codeForm}>
                <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
                  <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-neon-green" />
                          Verification Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter 6-digit code"
                            className="border-2 border-muted focus:border-neon-green/50 transition-colors text-center font-mono text-lg tracking-wider"
                            maxLength={6}
                            data-testid="input-code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-neon-green to-mining-orange hover:from-neon-green/80 hover:to-mining-orange/80 text-white font-semibold"
                    disabled={verifyCodeMutation.isPending}
                    data-testid="button-verify-code"
                  >
                    {verifyCodeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-neon-purple"
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
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto">
                  <Users className="w-4 h-4 text-neon-green" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Almost done! Create your mining account
                </p>
              </div>

              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Choose a username"
                            className="border-2 border-muted focus:border-mining-orange/50 transition-colors"
                            data-testid="input-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Create a secure password"
                            className="border-2 border-muted focus:border-mining-orange/50 transition-colors"
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="referredByUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-mining-orange" />
                          Referral Code (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter referral code"
                            className="border-2 border-muted focus:border-mining-orange/50 transition-colors"
                            data-testid="input-referral"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-mining-orange to-neon-purple hover:from-mining-orange/80 hover:to-neon-purple/80 text-white font-semibold"
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