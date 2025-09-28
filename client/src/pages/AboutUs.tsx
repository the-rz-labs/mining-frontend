import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, Target, Award, Sparkles, Globe, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AboutUs() {
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

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
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

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            What Makes Us Different
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-3xl mx-auto">
            Our platform is built on principles that prioritize your success and security
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-neon-green" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-3xl mb-4">How Ranking Mining Works</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Our revolutionary approach to crypto mining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-neon-purple">1</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">No Token Deposits</h3>
                  <p className="text-white/60 text-sm">We don't take your assets. You mine using your own resources and keep full control.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-neon-green">2</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Fair Mining Plans</h3>
                  <p className="text-white/60 text-sm">Choose from transparent mining plans with clear terms and guaranteed returns.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-mining-orange">3</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Instant Rewards</h3>
                  <p className="text-white/60 text-sm">Earn daily rewards directly to your wallet with real-time tracking and analytics.</p>
                </div>
              </div>
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