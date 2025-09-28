import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, MessageSquare, Send, Sparkles, Zap, Globe, Shield } from "lucide-react";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return response.json();

      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-24 pb-16">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-neon-green/30 rounded-full blur-3xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl opacity-60 animate-breathing"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mr-4 animate-pulse">
                <MessageSquare className="w-8 h-8 text-neon-green" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent tracking-tight">
                Contact Us
              </h1>
            </div>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
              Have questions about our mining platform? We're here to help you get started on your crypto mining journey.
            </p>
            
            {/* Contact method cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-white font-semibold mb-2">Email Support</h3>
                <p className="text-white/60 text-sm">support@rankingmining.com</p>
                <p className="text-neon-purple text-xs mt-1">24/7 Response</p>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-white font-semibold mb-2">Global Reach</h3>
                <p className="text-white/60 text-sm">150+ Countries</p>
                <p className="text-neon-purple text-xs mt-1">Worldwide Support</p>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-white font-semibold mb-2">Secure Platform</h3>
                <p className="text-white/60 text-sm">99.9% Uptime</p>
                <p className="text-neon-purple text-xs mt-1">Enterprise Security</p>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-500 relative overflow-hidden group">
            {/* Animated border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-transparent to-neon-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-full flex items-center justify-center animate-pulse">
                  <Send className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl flex items-center">
                    Send us a Message
                    <Sparkles className="w-5 h-5 text-neon-purple ml-2 animate-pulse" />
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-neon-green" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-white/70">Thank you for contacting us. We'll respond within 24 hours.</p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 bg-gradient-to-r from-neon-purple to-neon-green text-white"
                    data-testid="button-send-another"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Your Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your full name"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-neon-purple/50"
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your.email@example.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-neon-purple/50"
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="What's this about?"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-neon-purple/50"
                              data-testid="input-subject"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us more about your inquiry..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-2 focus:ring-neon-purple/50 min-h-[120px]"
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full h-12 bg-gradient-to-r from-neon-purple to-neon-green hover:from-neon-purple/80 hover:to-neon-green/80 text-white font-semibold text-lg shadow-lg hover:shadow-neon-purple/40 transition-all duration-300"
                      data-testid="button-send-message"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}