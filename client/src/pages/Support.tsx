import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Phone, Clock, AlertCircle } from "lucide-react";

const supportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  priority: z.string().min(1, "Please select a priority level")
});

type SupportForm = z.infer<typeof supportSchema>;

function ContactCard({ icon: Icon, title, description, value }: {
  icon: any;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-green/20 rounded-lg flex items-center justify-center border border-white/10">
            <Icon className="w-6 h-6 text-neon-purple" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-white/60 text-sm">{description}</p>
            <p className="text-neon-green font-medium">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Support() {
  const { toast } = useToast();
  
  const form = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
      priority: ""
    }
  });

  const onSubmit = async (data: SupportForm) => {
    // Mock form submission - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Support Request Submitted",
      description: "We've received your message and will respond within 24 hours.",
    });
    
    form.reset();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
          Support Center
        </h1>
        <p className="text-white/60">
          Get help with your mining operations and account management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          
          <ContactCard
            icon={Mail}
            title="Email Support"
            description="Get help via email"
            value="support@ranking.com"
          />
          
          <ContactCard
            icon={Phone}
            title="Phone Support"
            description="Call us for urgent issues"
            value="+1 (555) 123-4567"
          />
          
          <ContactCard
            icon={Clock}
            title="Business Hours"
            description="When we're available"
            value="Mon-Fri 9AM-6PM EST"
          />

          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <AlertCircle className="w-5 h-5 text-mining-orange" />
                <span>Emergency Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 text-sm mb-4">
                For critical mining issues or security concerns, use our emergency hotline available 24/7.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                data-testid="button-emergency"
              >
                Emergency Hotline
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Form */}
        <div className="lg:col-span-2">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <MessageSquare className="w-5 h-5 text-neon-green" />
                <span>Submit Support Request</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                              data-testid="input-support-name"
                            />
                          </FormControl>
                          <FormMessage />
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
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                              data-testid="input-support-email"
                            />
                          </FormControl>
                          <FormMessage />
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
                            placeholder="Brief description of your issue"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            data-testid="input-support-subject"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger 
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="select-support-category"
                              >
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mining">Mining Issues</SelectItem>
                              <SelectItem value="account">Account Management</SelectItem>
                              <SelectItem value="payments">Payments & Withdrawals</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="billing">Billing Questions</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger 
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="select-support-priority"
                              >
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Please provide detailed information about your issue..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-32"
                            data-testid="textarea-support-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/80 hover:to-emerald-600/80"
                    disabled={form.formState.isSubmitting}
                    data-testid="button-submit-support"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Support Request"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}