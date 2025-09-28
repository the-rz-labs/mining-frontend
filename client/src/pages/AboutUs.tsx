import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, Target, Award, Sparkles, Globe, TrendingUp, Cpu, Database, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function AboutUs() {
  const [animatedStats, setAnimatedStats] = useState({
    miners: 0,
    rewards: 0,
    uptime: 0,
    countries: 0
  });

  // Animate statistics on page load
  useEffect(() => {
    const targets = { miners: 50000, rewards: 10000000, uptime: 99.9, countries: 150 };
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepTime = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      setAnimatedStats({
        miners: Math.round(targets.miners * easeProgress),
        rewards: Math.round(targets.rewards * easeProgress),
        uptime: Number((targets.uptime * easeProgress).toFixed(1)),
        countries: Math.round(targets.countries * easeProgress)
      });
      
      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Built on blockchain technology with complete transparency. Your investments are protected by smart contracts and industry-leading security measures."
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "State-of-the-art mining infrastructure with 99.9% uptime. Our advanced algorithms optimize mining efficiency for maximum returns."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a global community of crypto miners. Benefit from referral programs, social features, and collaborative mining strategies."
    },
    {
      icon: Target,
      title: "Focused Innovation",
      description: "Dedicated to advancing crypto mining technology. We continuously improve our platform to deliver the best mining experience."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Miners", icon: Users },
    { value: "$10M+", label: "Total Rewards Paid", icon: Award },
    { value: "99.9%", label: "Platform Uptime", icon: Zap },
    { value: "150+", label: "Countries Served", icon: Globe }
  ];

  const team = [
    {
      name: "Mining Infrastructure",
      role: "Built for Scale",
      description: "Enterprise-grade mining infrastructure designed to handle massive workloads with optimal efficiency."
    },
    {
      name: "Smart Contracts",
      role: "Transparent & Secure",
      description: "All operations are governed by audited smart contracts, ensuring fairness and transparency."
    },
    {
      name: "24/7 Support",
      role: "Always Available",
      description: "Round-the-clock technical support and community assistance to help you succeed."
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-24 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-neon-green/30 rounded-full blur-3xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl opacity-60 animate-breathing"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-neon-green/20 to-mining-orange/20 rounded-full blur-3xl opacity-50 animate-float hidden sm:block"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent mb-6 tracking-tight">
            About Ranking Mining
          </h1>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing the crypto mining industry with fairness, transparency, and cutting-edge technology. 
            Our platform empowers miners worldwide to earn rewards without traditional barriers.
          </p>
        </div>

        {/* Enhanced Animated Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl text-center group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:rotate-12">
                <Users className="w-6 h-6 text-neon-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {animatedStats.miners.toLocaleString()}+
              </h3>
              <p className="text-white/60 text-sm">Active Miners</p>
              <div className="mt-2 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-neon-green fill-current opacity-80" />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl text-center group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:rotate-12">
                <Award className="w-6 h-6 text-neon-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                ${(animatedStats.rewards / 1000000).toFixed(0)}M+
              </h3>
              <p className="text-white/60 text-sm">Total Rewards Paid</p>
              <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-neon-purple to-neon-green h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl text-center group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:rotate-12">
                <Zap className="w-6 h-6 text-neon-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {animatedStats.uptime}%
              </h3>
              <p className="text-white/60 text-sm">Platform Uptime</p>
              <div className="mt-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse mr-2"></div>
                <span className="text-neon-green text-xs">Live</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl text-center group hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:rotate-12">
                <Globe className="w-6 h-6 text-neon-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {animatedStats.countries}+
              </h3>
              <p className="text-white/60 text-sm">Countries Served</p>
              <div className="mt-2 text-neon-purple text-xs">
                🌍 Global Network
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center space-x-2">
                <Target className="w-6 h-6 text-neon-purple" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 leading-relaxed">
                To democratize cryptocurrency mining by providing a fair, transparent, and accessible platform where anyone can participate in the crypto economy. We believe mining should be profitable, secure, and available to miners worldwide regardless of their technical expertise or initial investment.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-neon-green" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 leading-relaxed">
                To become the world's leading crypto mining platform, setting new standards for transparency, efficiency, and user experience. We envision a future where crypto mining is sustainable, profitable, and contributes to the growth of the global blockchain ecosystem.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <Sparkles className="w-8 h-8 text-neon-purple mr-3 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                What Makes Us Different
              </h2>
              <Sparkles className="w-8 h-8 text-neon-green ml-3 animate-pulse" />
            </div>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Our platform is built on principles that prioritize your success and security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white/10 transition-all duration-500 group hover:scale-105 relative overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-neon-green" />
                  </div>
                  <CardTitle className="text-white text-xl group-hover:text-neon-green transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">{feature.description}</p>
                  
                  {/* Progress indicator */}
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="flex-1 bg-white/10 rounded-full h-1">
                      <div className="bg-gradient-to-r from-neon-purple to-neon-green h-1 rounded-full transition-all duration-1000 group-hover:w-full w-0"></div>
                    </div>
                    <Zap className="w-4 h-4 text-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </CardContent>
                
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-neon-purple rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-float transition-all duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-neon-green rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-float transition-all duration-700" style={{ animationDelay: '0.5s' }} />
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced How It Works */}
        <div className="mb-20">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-500 relative overflow-hidden group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="text-center relative z-10">
              <div className="flex justify-center items-center mb-4">
                <Cpu className="w-8 h-8 text-neon-purple mr-3 animate-pulse" />
                <CardTitle className="text-white text-3xl">How Ranking Mining Works</CardTitle>
                <Database className="w-8 h-8 text-neon-green ml-3 animate-pulse" />
              </div>
              <CardDescription className="text-white/70 text-lg">
                Our revolutionary approach to crypto mining
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group/item hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 relative">
                    <span className="text-2xl font-bold text-neon-purple">1</span>
                    <div className="absolute inset-0 rounded-full border-2 border-neon-purple/30 animate-ping opacity-0 group-hover/item:opacity-100"></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover/item:text-neon-purple transition-colors">No Token Deposits</h3>
                  <p className="text-white/60 text-sm group-hover/item:text-white/80 transition-colors">We don't take your assets. You mine using your own resources and keep full control.</p>
                  <div className="mt-4 w-8 h-1 bg-gradient-to-r from-neon-purple to-transparent mx-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="text-center group/item hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 relative">
                    <span className="text-2xl font-bold text-neon-green">2</span>
                    <div className="absolute inset-0 rounded-full border-2 border-neon-green/30 animate-ping opacity-0 group-hover/item:opacity-100"></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover/item:text-neon-green transition-colors">Fair Mining Plans</h3>
                  <p className="text-white/60 text-sm group-hover/item:text-white/80 transition-colors">Choose from transparent mining plans with clear terms and guaranteed returns.</p>
                  <div className="mt-4 w-8 h-1 bg-gradient-to-r from-neon-green to-transparent mx-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="text-center group/item hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 relative">
                    <span className="text-2xl font-bold text-mining-orange">3</span>
                    <div className="absolute inset-0 rounded-full border-2 border-mining-orange/30 animate-ping opacity-0 group-hover/item:opacity-100"></div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover/item:text-mining-orange transition-colors">Instant Rewards</h3>
                  <p className="text-white/60 text-sm group-hover/item:text-white/80 transition-colors">Earn daily rewards directly to your wallet with real-time tracking and analytics.</p>
                  <div className="mt-4 w-8 h-1 bg-gradient-to-r from-mining-orange to-transparent mx-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              {/* Connection lines animation */}
              <div className="hidden md:block absolute top-1/2 left-1/3 w-4 h-0.5 bg-gradient-to-r from-neon-purple to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="hidden md:block absolute top-1/2 right-1/3 w-4 h-0.5 bg-gradient-to-r from-neon-green to-mining-orange opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ transitionDelay: '0.5s' }}></div>
            </CardContent>
          </Card>
        </div>

        {/* Team/Technology Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Built by Experts
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with industry expertise
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-neon-green" />
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <CardDescription className="text-neon-purple font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-center text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
      </div>
      <Footer />
    </>
  );
}