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
import { MessageSquare } from "lucide-react";

// Mock user data - same as profile
const mockUserData = {
  username: "CryptoMiner_Pro",
  email: "admin@gmail.com"
};

const supportSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  priority: z.string().min(1, "Please select a priority level")
});

type SupportForm = z.infer<typeof supportSchema>;

export default function Support() {
  const { toast } = useToast();
  
  const form = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      username: mockUserData.username,
      email: mockUserData.email,
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
    
    // Reset only the editable fields
    form.setValue("subject", "");
    form.setValue("category", "");
    form.setValue("message", "");
    form.setValue("priority", "");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent">
          Support Center
        </h1>
        <p className="text-white/70 text-lg">
          Get help with your mining operations and account management
        </p>
      </div>

      {/* Support Form */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white text-2xl">
            <MessageSquare className="w-6 h-6 text-neon-green" />
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="bg-white/10 border-white/20 text-white/80 cursor-not-allowed"
                          data-testid="input-support-username"
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
                          disabled
                          className="bg-white/10 border-white/20 text-white/80 cursor-not-allowed"
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
                className="w-full bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/80 hover:to-emerald-600/80 text-white font-semibold text-lg h-12"
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
  );
}
