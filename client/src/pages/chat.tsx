import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { api } from "@shared/routes";
import type { Message } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: [api.ai.messages.path],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", api.ai.chat.path, { message });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ai.messages.path] });
      setInput("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    chatMutation.mutate(input);
  };

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-10rem)] animate-fade-in flex flex-col pt-2">
      <div className="mb-8 space-y-2 relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-sapphire inline-flex items-center gap-3">
          AI Intel
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border border-accent/30 text-accent"
            style={{ background: 'hsl(260 60% 62% / 0.1)' }}
          >
            <Sparkles className="w-3 h-3" />
            Beta
          </span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg font-medium">
          Chat with the AI to filter, analyze, or summarize your Craigslist finds.
        </p>
      </div>

      <Card 
        className="flex-1 flex flex-col border border-white/[0.06] rounded-[2rem] overflow-hidden relative shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
        style={{
          background: 'linear-gradient(180deg, hsl(225 12% 7% / 0.9) 0%, hsl(225 12% 5% / 0.95) 100%)',
          backdropFilter: 'blur(40px)',
        }}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, hsl(172 80% 52% / 0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, hsl(260 60% 62% / 0.15) 0%, transparent 70%)' }} />

        <CardHeader className="border-b border-white/[0.04] z-10 px-8 py-5" style={{ background: 'hsl(225 12% 8% / 0.5)' }}>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[0_4px_16px_hsl(260_60%_62%/0.25)] border border-accent/20"
              style={{ background: 'linear-gradient(135deg, hsl(172 80% 52%) 0%, hsl(260 60% 62%) 100%)' }}
            >
              <Bot className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide text-foreground">CraigsCatch Assistant</span>
              <p className="text-[11px] text-muted-foreground/60 font-semibold uppercase tracking-wider">Online</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 z-10">
          <ScrollArea className="h-full px-6 py-6 sm:px-8 scrollbar-premium">
            <div className="space-y-6 pb-4">
              {messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-4 max-w-[85%] ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-[0.8rem] flex items-center justify-center shrink-0 shadow-md border ${
                      msg.role === "user"
                        ? "text-white border-primary/20"
                        : "text-accent border-accent/20"
                    }`}
                      style={{
                        background: msg.role === 'user' 
                          ? 'linear-gradient(135deg, hsl(172 80% 52%) 0%, hsl(190 90% 55%) 100%)'
                          : 'hsl(225 12% 8%)'
                      }}
                    >
                      {msg.role === "user" ? (
                        <User className="w-4 h-4 drop-shadow-sm" />
                      ) : (
                        <Bot className="w-4 h-4 text-gradient-cool" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-5 py-3.5 shadow-sm border ${
                        msg.role === "user"
                          ? "rounded-tr-sm border-primary/20 text-foreground"
                          : "rounded-tl-sm border-white/[0.04] text-foreground/90"
                      }`}
                      style={{
                        background: msg.role === 'user'
                          ? 'hsl(172 80% 52% / 0.1)'
                          : 'hsl(225 15% 4%)'
                      }}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {chatMutation.isPending && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex gap-4 max-w-[80%]">
                    <div className="w-9 h-9 rounded-[0.8rem] text-accent flex items-center justify-center shrink-0 shadow-md border border-accent/20"
                      style={{ background: 'hsl(225 12% 8%)' }}>
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm border border-white/[0.04]"
                      style={{ background: 'hsl(225 15% 4%)' }}>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input Footer */}
        <CardFooter className="border-t border-white/[0.04] z-10 p-5 sm:px-8" style={{ background: 'hsl(225 12% 8% / 0.5)' }}>
          <form onSubmit={handleSubmit} className="flex w-full gap-3 relative">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your recent finds..."
                disabled={chatMutation.isPending}
                className="h-14 w-full rounded-2xl border-white/[0.06] pl-5 pr-14 text-[15px] tracking-wide placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all shadow-inner"
                style={{ background: 'hsl(225 15% 4%)' }}
              />
            </div>
            <Button
              type="submit"
              disabled={chatMutation.isPending}
              className="h-14 px-6 rounded-2xl text-white shadow-[0_8px_20px_hsl(172_80%_52%/0.2)] hover:shadow-[0_12px_28px_hsl(172_80%_52%/0.3)] active-press transition-all duration-300 font-bold border border-white/10 shrink-0 group"
              style={{ background: 'linear-gradient(135deg, hsl(172 80% 52%) 0%, hsl(190 90% 55%) 100%)' }}
            >
              <Send className="w-5 h-5 sm:mr-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
