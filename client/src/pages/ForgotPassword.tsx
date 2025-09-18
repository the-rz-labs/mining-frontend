import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Mail, ArrowRight, Loader2, ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sendCodeSchema } from "@shared/schema";
import type { z } from "zod";

type ForgotPasswordForm = z.infer<typeof sendCodeSchema>;

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: {
      email: ""
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      const response = await apiRequest("POST", "/api/auth/forgot-password", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset email sent!",
        description: "Check your email for instructions to reset your password."
      });
      // Optionally redirect to sign-in page after successful request
      setTimeout(() => navigate("/sign-in"), 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again or contact support",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    resetPasswordMutation.mutate(data);
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
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
                data-testid="button-back-signin"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Button>
            </Link>
            <div className="flex-1" />
          </div>

          {/* Header Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
              <Shield className="w-8 h-8 text-neon-purple animate-pulse-glow" />
            </div>
            
            <div className="space-y-3 animate-slide-in-left">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent tracking-tight">
                Reset Password
              </CardTitle>
              <CardDescription className="text-white/70 text-lg animate-fade-in animate-stagger-1">
                Enter your email to receive a password reset link
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 transition-all duration-300 hover:scale-[1.02] animate-slide-in-right animate-stagger-3"
                disabled={resetPasswordMutation.isPending}
                data-testid="button-reset-password"
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Message */}
          <div className="text-center text-xs text-muted-foreground animate-fade-in animate-stagger-4">
            <p>Remember your password?</p>
            <Link href="/sign-in" className="text-neon-purple hover:underline font-medium">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}