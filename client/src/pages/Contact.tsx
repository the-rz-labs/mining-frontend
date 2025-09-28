import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@rankingmining.com",
      description: "Send us an email anytime"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      content: "Available 24/7",
      description: "Chat with our support team"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Global Operations",
      description: "Worldwide mining network"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We respond to all inquiries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-24 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-r from-neon-purple/30 to-neon-green/30 rounded-full blur-3xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-[500px] h-[500px] bg-gradient-to-r from-mining-orange/20 to-neon-purple/20 rounded-full blur-3xl opacity-60 animate-breathing"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-purple via-white to-neon-green bg-clip-text text-transparent mb-6 tracking-tight">
            Contact Us
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Have questions about our mining platform? We're here to help you get started on your crypto mining journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-neon-green" />
                  <span>Get in Touch</span>
                </CardTitle>
                <CardDescription className="text-white/70">
                  Choose how you'd like to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-green/20 flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-neon-green" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{info.title}</h3>
                      <p className="text-neon-purple font-medium">{info.content}</p>
                      <p className="text-sm text-white/60">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-faq">
                  FAQ & Help Center
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-docs">
                  Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-community">
                  Community Forum
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                <CardDescription className="text-white/70">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
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

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-white/70">
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "How do I start mining?",
                    answer: "Create an account, connect your wallet, choose a mining plan, and start earning rewards immediately."
                  },
                  {
                    question: "What tokens can I mine?",
                    answer: "We currently support MGC and RZ tokens with different mining plans and reward structures."
                  },
                  {
                    question: "How are rewards calculated?",
                    answer: "Rewards are based on your mining plan's hash rate, duration, and current network difficulty."
                  },
                  {
                    question: "Is my investment secure?",
                    answer: "Yes, we use industry-standard security measures and smart contracts to protect your investments."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-white/70 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}