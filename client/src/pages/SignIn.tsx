import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { signInSchema } from "@shared/schema";
import type { z } from "zod";
import { useState } from "react";

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInForm) => {
      const response = await apiRequest("POST", "/api/auth/sign-in", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${data.user.username}`
      });
      navigate("/"); // Navigate to home or dashboard
    },
    onError: (error: any) => {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SignInForm) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Modern Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-gradient-to-r from-neon-green/30 to-neon-purple/30 rounded-full blur-3xl md:blur-3xl blur-xl animate-float opacity-70"></div>
        <div className="absolute -bottom-10 -right-10 w-[500px] h-[500px] bg-gradient-to-r from-neon-purple/20 to-mining-orange/20 rounded-full blur-3xl md:blur-3xl blur-xl animate-breathing opacity-60" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-mining-orange/20 to-neon-green/20 rounded-full blur-3xl md:blur-3xl blur-xl animate-float opacity-50 hidden sm:block" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.02] to-transparent opacity-50"></div>
        
        {/* Floating particles */}
        <div className="absolute top-32 right-20 w-2 h-2 bg-neon-green rounded-full animate-float opacity-60 hidden md:block"></div>
        <div className="absolute top-60 left-32 w-1 h-1 bg-neon-purple rounded-full animate-float opacity-40 hidden lg:block" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-40 right-1/3 w-1.5 h-1.5 bg-mining-orange rounded-full animate-float opacity-50 hidden md:block" style={{ animationDelay: "3s" }}></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-neon-green/10 hover:shadow-neon-green/20 transition-all duration-500 hover:border-white/20 animate-scale-in">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-purple/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
              <Shield className="w-8 h-8 text-neon-green animate-pulse-glow" />
            </div>
            
            <div className="space-y-3 animate-slide-in-left">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-green via-white to-mining-orange bg-clip-text text-transparent tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-white/70 text-lg animate-fade-in animate-stagger-1">
                Sign in to your mining dashboard
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
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-neon-green/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
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
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-mining-orange/50 focus:border-transparent transition-all duration-300 group-hover:bg-white/10 pr-12"
                          data-testid="input-password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-all duration-300"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-white/20 bg-white/5 checked:bg-neon-green checked:border-neon-green transition-all duration-300 hover:border-white/40"
                      data-testid="checkbox-remember"
                    />
                  </div>
                  <span className="text-white/60 group-hover:text-white/80 transition-colors duration-300">Remember me</span>
                </label>
                
                <Link href="#" className="text-neon-green hover:text-neon-green/80 hover:underline transition-colors duration-300 text-sm font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-neon-green to-mining-orange hover:from-neon-green/80 hover:to-mining-orange/80 text-white font-semibold rounded-xl shadow-lg shadow-neon-green/20 hover:shadow-neon-green/40 transition-all duration-300 hover:scale-[1.02]"
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