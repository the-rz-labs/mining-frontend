import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, AlertCircle, CheckCircle, Inbox, AlertTriangle, Zap, ShieldCheck, ChevronRight, ExternalLink } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { supportTicketSchema, type SupportTicketRequest, type TicketListResponse, type SupportTicket } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

type SupportForm = SupportTicketRequest;

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'open':
      return {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        icon: MessageSquare
      };
    case 'in_progress':
      return {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        icon: Clock
      };
    case 'resolved':
      return {
        color: 'bg-green-500/20 text-green-400 border-green-500/50',
        icon: CheckCircle
      };
    case 'closed':
      return {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
        icon: ShieldCheck
      };
    default:
      return {
        color: 'bg-white/20 text-white border-white/30',
        icon: MessageSquare
      };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return {
        color: 'bg-red-500/20 text-red-400 border-red-500/50',
        icon: Zap,
        pulse: 'animate-pulse'
      };
    case 'high':
      return {
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
        icon: AlertTriangle,
        pulse: ''
      };
    case 'medium':
      return {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        icon: Clock,
        pulse: ''
      };
    case 'low':
      return {
        color: 'bg-green-500/20 text-green-400 border-green-500/50',
        icon: CheckCircle,
        pulse: ''
      };
    default:
      return {
        color: 'bg-white/20 text-white border-white/30',
        icon: MessageSquare,
        pulse: ''
      };
  }
};

export default function Support() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<SupportForm>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      subject: "",
      category: "general",
      message: "",
      priority: "medium"
    }
  });

  const { data: ticketsData, isLoading: isLoadingTickets, isError: isTicketsError, error: ticketsError, refetch: refetchTickets } = useQuery<TicketListResponse>({
    queryKey: ['/api/support/tickets'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('/api/support/tickets', { headers });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.detail || errorData?.error || 'Failed to fetch support tickets';
        throw new Error(errorMessage);
      }
      return response.json();
    },
    retry: 2,
  });

  React.useEffect(() => {
    if (isTicketsError && ticketsError instanceof Error) {
      toast({
        title: "Failed to Load Tickets",
        description: ticketsError.message,
        variant: "destructive"
      });
    }
  }, [isTicketsError, ticketsError, toast]);

  const submitTicketMutation = useMutation({
    mutationFn: async (data: SupportTicketRequest) => {
      return await apiRequest("POST", "/api/support/tickets", data);
    },
    onSuccess: () => {
      toast({
        title: "Support Request Submitted",
        description: "We've received your message and will respond within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.detail || error?.data?.error || error?.message || "There was an error submitting your support request. Please try again.";
      toast({
        title: "Failed to Submit",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: SupportForm) => {
    submitTicketMutation.mutate(data);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-green/20 p-8 md:p-12 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.15),transparent_50%)]" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <MessageSquare className="w-4 h-4 text-neon-green" />
              <span className="text-sm text-white/70 font-medium">24/7 Support Available</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-neon-purple via-neon-green to-mining-orange bg-clip-text text-transparent">
              Support Center
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl">
              Get expert help with your mining operations, account management, and technical issues
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="submit" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 h-auto backdrop-blur-xl">
            <TabsTrigger 
              value="submit" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-green/20 data-[state=active]:to-emerald-500/20 data-[state=active]:text-neon-green data-[state=active]:border data-[state=active]:border-neon-green/30 data-[state=active]:shadow-lg transition-all duration-300 py-3 rounded-md"
              data-testid="tab-submit-ticket"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="font-semibold">Submit Ticket</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-neon-purple data-[state=active]:border data-[state=active]:border-neon-purple/30 data-[state=active]:shadow-lg transition-all duration-300 py-3 rounded-md"
              data-testid="tab-my-tickets"
            >
              <Inbox className="w-4 h-4 mr-2" />
              <span className="font-semibold">My Tickets</span>
              <Badge className="ml-2 bg-neon-purple/20 text-neon-purple border-neon-purple/30 text-xs">
                {ticketsData?.count || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Submit Ticket Tab */}
          <TabsContent value="submit" className="space-y-0">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-transparent pointer-events-none" />
              <CardHeader className="space-y-3 pb-6 relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neon-green/10 border border-neon-green/30 shadow-lg">
                    <MessageSquare className="w-6 h-6 text-neon-green" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-2xl md:text-3xl font-bold">
                      Submit Support Request
                    </CardTitle>
                    <CardDescription className="text-white/60 mt-1">
                      Fill out the form below and our team will respond within 24 hours
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-semibold">Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Brief description of your issue"
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 transition-all"
                              data-testid="input-support-subject"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90 font-semibold">Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger 
                                  className="bg-white/5 border-white/10 text-white h-12 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20"
                                  data-testid="select-support-category"
                                >
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
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
                            <FormLabel className="text-white/90 font-semibold">Priority Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger 
                                  className="bg-white/5 border-white/10 text-white h-12 focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20"
                                  data-testid="select-support-priority"
                                >
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                    Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-yellow-400" />
                                    Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                                    High
                                  </div>
                                </SelectItem>
                                <SelectItem value="urgent">
                                  <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-red-400" />
                                    Urgent
                                  </div>
                                </SelectItem>
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
                          <FormLabel className="text-white/90 font-semibold">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Please provide detailed information about your issue..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-40 resize-none focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 transition-all"
                              data-testid="textarea-support-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/90 hover:to-emerald-600/90 text-white font-bold text-lg h-14 shadow-lg transition-all duration-300"
                      disabled={submitTicketMutation.isPending}
                      data-testid="button-submit-support"
                    >
                      {submitTicketMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Submit Support Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="tickets" className="space-y-0">
            {isLoadingTickets ? (
              <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-neon-purple/20 rounded-full" />
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-neon-purple rounded-full animate-spin" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white font-semibold text-lg">Loading Your Tickets</p>
                      <p className="text-white/60">Please wait while we fetch your support history...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : isTicketsError ? (
              <Card className="border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-xl shadow-lg">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30">
                      <AlertCircle className="w-12 h-12 text-red-400" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <p className="text-2xl font-bold text-white">Failed to Load Tickets</p>
                      <p className="text-white/70 leading-relaxed">
                        {ticketsError instanceof Error ? ticketsError.message : 'There was an error loading your support tickets. Please try again later or contact support if the issue persists.'}
                      </p>
                    </div>
                    <Button
                      onClick={() => refetchTickets()}
                      className="bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/90 hover:to-emerald-600/90 shadow-lg"
                      data-testid="button-retry-tickets"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : ticketsData?.results && ticketsData.results.length > 0 ? (
              <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="space-y-3 pb-6 relative border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/30 shadow-lg">
                      <Inbox className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl md:text-3xl font-bold">
                        Support Tickets
                      </CardTitle>
                      <CardDescription className="text-white/60 mt-1">
                        Click any ticket to view details and reply
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative">
                  {/* Table - Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider">ID</th>
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider">Subject</th>
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider">Status</th>
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider">Priority</th>
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider">Category</th>
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider">Created</th>
                          <th className="text-left p-4 text-white/70 font-semibold text-sm uppercase tracking-wider w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketsData.results.map((ticket: SupportTicket) => {
                          const statusConfig = getStatusConfig(ticket.status);
                          const priorityConfig = getPriorityConfig(ticket.priority);
                          const StatusIcon = statusConfig.icon;
                          const PriorityIcon = priorityConfig.icon;

                          return (
                            <tr 
                              key={ticket.id}
                              className="border-b border-white/5 hover-elevate cursor-pointer transition-all duration-200"
                              onClick={() => setLocation(`/app/support/ticket/${ticket.id}`)}
                              data-testid={`row-ticket-${ticket.id}`}
                            >
                              <td className="p-4">
                                <span className="text-white/60 font-mono text-sm" data-testid={`text-ticket-id-${ticket.id}`}>#{ticket.id}</span>
                              </td>
                              <td className="p-4">
                                <div className="space-y-1">
                                  <span className="text-white font-semibold" data-testid={`text-subject-${ticket.id}`}>{ticket.subject}</span>
                                  <p className="text-white/50 text-xs">
                                    {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`${statusConfig.color} border font-semibold`} data-testid={`badge-status-${ticket.id}`}>
                                  <StatusIcon className="w-3 h-3 mr-1.5" />
                                  {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge className={`${priorityConfig.color} ${priorityConfig.pulse} border font-semibold`} data-testid={`badge-priority-${ticket.id}`}>
                                  <PriorityIcon className="w-3 h-3 mr-1.5" />
                                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <span className="text-white/70 text-sm" data-testid={`text-category-${ticket.id}`}>
                                  {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="space-y-1">
                                  <div className="text-white/70 text-sm" data-testid={`text-date-${ticket.id}`}>
                                    {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                                  </div>
                                  <div className="text-white/40 text-xs">
                                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <ChevronRight className="w-5 h-5 text-white/40" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {ticketsData.results.map((ticket: SupportTicket) => {
                      const statusConfig = getStatusConfig(ticket.status);
                      const priorityConfig = getPriorityConfig(ticket.priority);
                      const StatusIcon = statusConfig.icon;
                      const PriorityIcon = priorityConfig.icon;

                      return (
                        <Card 
                          key={ticket.id}
                          className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg overflow-visible cursor-pointer hover-elevate"
                          onClick={() => setLocation(`/app/support/ticket/${ticket.id}`)}
                          data-testid={`card-ticket-mobile-${ticket.id}`}
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-white font-bold text-lg truncate">{ticket.subject}</h3>
                                  <ChevronRight className="w-5 h-5 text-white/40 shrink-0" />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`${statusConfig.color} border text-xs`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                  </Badge>
                                  <Badge className={`${priorityConfig.color} ${priorityConfig.pulse} border text-xs`}>
                                    <PriorityIcon className="w-3 h-3 mr-1" />
                                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-white/60 font-mono">#{ticket.id}</span>
                                <span className="text-white/50 text-xs">
                                  {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                                </span>
                              </div>
                              <span className="text-white/50 text-xs">
                                {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
                <CardContent className="py-20 relative">
                  <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="p-6 rounded-full bg-white/5 border border-white/10">
                      <Inbox className="w-16 h-16 text-white/40" />
                    </div>
                    <div className="space-y-3 max-w-md">
                      <p className="text-2xl md:text-3xl font-bold text-white">No Support Tickets Yet</p>
                      <p className="text-white/60 leading-relaxed">
                        You haven't submitted any support requests. Need help with mining operations, account issues, or have questions? Submit a ticket and we'll respond within 24 hours.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        const submitTab = document.querySelector('[value="submit"]') as HTMLElement;
                        submitTab?.click();
                      }}
                      className="bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/90 hover:to-emerald-600/90 shadow-lg"
                      data-testid="button-create-ticket"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Create Your First Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
