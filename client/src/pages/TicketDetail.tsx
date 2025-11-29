import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Clock, AlertCircle, CheckCircle, AlertTriangle, Zap, ShieldCheck, Send, Loader2, XCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ticketReplySchema, type TicketReplyRequest, type SupportTicket } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

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

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<TicketReplyRequest>({
    resolver: zodResolver(ticketReplySchema),
    defaultValues: {
      message: ""
    }
  });

  const { data: ticket, isLoading, isError, error, refetch } = useQuery<SupportTicket>({
    queryKey: ['/api/support/tickets', id],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/support/tickets/${id}`, { headers });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || errorData?.error || 'Failed to fetch ticket details');
      }
      return response.json();
    },
    enabled: !!id,
    refetchInterval: 30000,
  });

  const replyMutation = useMutation({
    mutationFn: async (data: TicketReplyRequest) => {
      return await apiRequest("POST", `/api/support/tickets/${id}/reply`, data);
    },
    onSuccess: () => {
      toast({
        title: "Reply Sent",
        description: "Your message has been sent to the support team.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.detail || error?.data?.error || error?.message || "Failed to send reply. Please try again.";
      toast({
        title: "Failed to Send Reply",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const closeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/support/tickets/${id}/close`, {});
    },
    onSuccess: () => {
      toast({
        title: "Ticket Closed",
        description: "Your support ticket has been closed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.data?.detail || error?.data?.error || error?.message || "Failed to close ticket. Please try again.";
      toast({
        title: "Failed to Close Ticket",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const onSubmit = async (data: TicketReplyRequest) => {
    replyMutation.mutate(data);
  };

  const handleCloseTicket = () => {
    closeMutation.mutate();
  };

  useEffect(() => {
    if (ticket?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-neon-purple/20 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-neon-purple rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-lg">Loading Ticket Details</p>
                  <p className="text-white/60">Please wait...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/app/support')}
            className="text-white/70 hover:text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Button>
          
          <Card className="border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-xl shadow-lg">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </div>
                <div className="space-y-2 max-w-md">
                  <p className="text-2xl font-bold text-white">Failed to Load Ticket</p>
                  <p className="text-white/70 leading-relaxed">
                    {error instanceof Error ? error.message : 'There was an error loading the ticket details.'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => refetch()}
                    className="bg-gradient-to-r from-neon-green to-emerald-600"
                    data-testid="button-retry"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/app/support')}
                    className="border-white/20 text-white"
                    data-testid="button-back-to-support"
                  >
                    Back to Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);
  const StatusIcon = statusConfig.icon;
  const PriorityIcon = priorityConfig.icon;
  const isTicketClosed = ticket.status === 'closed' || ticket.status === 'resolved';

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => setLocation('/app/support')}
          className="text-white/70 hover:text-white"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-transparent pointer-events-none" />
          
          <CardHeader className="space-y-4 pb-6 relative border-b border-white/10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 font-mono text-sm" data-testid="text-ticket-id">#{ticket.id}</span>
                </div>
                <CardTitle className="text-white text-2xl md:text-3xl font-bold leading-tight" data-testid="text-subject">
                  {ticket.subject}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${statusConfig.color} border font-semibold`} data-testid="badge-status">
                    <StatusIcon className="w-3 h-3 mr-1.5" />
                    {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                  <Badge className={`${priorityConfig.color} ${priorityConfig.pulse} border font-semibold`} data-testid="badge-priority">
                    <PriorityIcon className="w-3 h-3 mr-1.5" />
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-white/70 border-white/20" data-testid="badge-category">
                    {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="text-right space-y-2 shrink-0">
                <div className="flex items-center justify-end text-white/60 gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium" data-testid="text-created">
                    {format(new Date(ticket.created_at), 'PPp')}
                  </span>
                </div>
                <p className="text-white/40 text-xs">
                  {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                </p>
                {!isTicketClosed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCloseTicket}
                    disabled={closeMutation.isPending}
                    className="mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                    data-testid="button-close-ticket"
                  >
                    {closeMutation.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                        Closing...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1.5" />
                        Close Ticket
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative pt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neon-purple" />
                Conversation
                <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 text-xs ml-2">
                  {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                </Badge>
              </h3>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {ticket.messages.map((message, index) => {
                  const isStaff = message.from_staff;
                  const initials = message.author_name.split(' ').map(n => n[0]).join('').toUpperCase();

                  return (
                    <div 
                      key={message.id}
                      className="relative flex gap-4"
                      data-testid={`message-${message.id}`}
                    >
                      {index < ticket.messages.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
                      )}
                      
                      <Avatar 
                        className={`shrink-0 w-10 h-10 border-2 ${isStaff ? 'border-neon-purple shadow-lg' : 'border-neon-green shadow-lg'}`}
                        data-testid={`avatar-${message.author_name.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <AvatarFallback className={`${isStaff ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-green/20 text-neon-green'} font-bold text-sm`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className={`p-4 rounded-xl border ${
                          isStaff 
                            ? 'bg-gradient-to-br from-neon-purple/10 to-purple-500/5 border-neon-purple/30 shadow-lg' 
                            : 'bg-white/5 border-white/10'
                        }`}>
                          <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-sm ${isStaff ? 'text-neon-purple' : 'text-neon-green'}`}>
                                {message.author_name}
                              </span>
                              {isStaff && (
                                <Badge variant="outline" className="text-xs text-neon-purple border-neon-purple/40 bg-neon-purple/10 px-2 py-0.5">
                                  <ShieldCheck className="w-3 h-3 mr-1" />
                                  Staff
                                </Badge>
                              )}
                            </div>
                            <span className="text-white/50 text-xs font-medium">
                              {format(new Date(message.created_at), 'PPp')}
                            </span>
                          </div>
                          <p className="text-white/80 whitespace-pre-line leading-relaxed">{message.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {isTicketClosed ? (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                <p className="text-white/60">
                  This ticket has been {ticket.status}. You cannot reply to it.
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-neon-green" />
                  Send a Reply
                </h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Type your reply here..."
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-32 resize-none focus:border-neon-green/50 focus:ring-2 focus:ring-neon-green/20 transition-all"
                              data-testid="textarea-reply"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/90 hover:to-emerald-600/90 text-white font-semibold shadow-lg"
                        disabled={replyMutation.isPending}
                        data-testid="button-send-reply"
                      >
                        {replyMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
