import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTriggerCheck } from "@/hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, MessageSquare, RadioReceiver, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export function AppSidebar() {
  const [location] = useLocation();
  const { mutate: triggerCheck, isPending } = useTriggerCheck();
  const { toast } = useToast();

  const handleTrigger = () => {
    triggerCheck(undefined, {
      onSuccess: () => {
        toast({
          title: "Sync complete",
          description: "Successfully checked all active RSS feeds.",
        });
      },
      onError: (err) => {
        toast({
          title: "Sync failed",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const navItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Monitors", url: "/monitors", icon: RadioReceiver },
    { title: "AI Assistant", url: "/chat", icon: MessageSquare },
  ];

  return (
    <Sidebar className="border-r border-white/[0.04] z-40 overflow-hidden shadow-[32px_0_100px_rgba(0,0,0,0.5)]"
      style={{
        background: 'linear-gradient(135deg, hsl(225 15% 4% / 0.9) 0%, hsl(225 15% 3% / 0.95) 100%)',
        backdropFilter: 'blur(30px)'
      }}
    >
      <SidebarContent>
        {/* Brand Header */}
        <div className="px-6 pt-8 pb-6 relative">
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-primary/10 to-transparent opacity-30 pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.85rem] text-white shadow-[0_4px_16px_hsl(172_80%_52%/0.2)] border border-primary/20 hover-lift"
              style={{ background: 'linear-gradient(135deg, hsl(172 80% 52%) 0%, hsl(190 90% 55%) 50%, hsl(260 60% 62%) 100%)' }}
            >
              <Zap className="h-5 w-5 drop-shadow-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gradient-sapphire tracking-tight leading-tight">CraigsCatch</h2>
              <p className="text-[11px] font-semibold text-muted-foreground/60 tracking-wider uppercase mt-0.5">Automated Feeds</p>
            </div>
          </div>
        </div>

        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 mb-3 px-6">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {navItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      data-active={isActive}
                      className={`relative overflow-hidden transition-all duration-300 rounded-xl mb-1.5 hover-lift active-press group ${
                        isActive
                          ? "text-primary font-bold shadow-[0_4px_12px_hsl(172_80%_52%/0.08)] border border-primary/10"
                          : "text-muted-foreground border border-transparent hover:text-foreground"
                      }`}
                      style={{
                        background: isActive 
                          ? 'linear-gradient(90deg, hsl(172 80% 52% / 0.1) 0%, hsl(172 80% 52% / 0.05) 100%)' 
                          : 'transparent'
                      }}
                    >
                      <Link href={item.url} className="flex items-center gap-4 px-4 py-2.5 outline-none relative z-10">
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 bg-primary rounded-r-full shadow-[2px_0_8px_hsl(var(--primary)/0.4)]" />
                        )}
                        <item.icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_hsl(172_80%_52%/0.4)]' : 'group-hover:scale-110'}`} />
                        <span className="text-[13px] tracking-wide">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5 border-t border-white/[0.04] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-20 pointer-events-none" />
        
        <button
          onClick={handleTrigger}
          disabled={isPending}
          className="w-full relative overflow-hidden group flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-bold text-white shadow-[0_8px_20px_hsl(172_80%_52%/0.2)] hover:shadow-[0_12px_28px_hsl(172_80%_52%/0.3)] active-press disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 border border-white/10"
          style={{ background: 'linear-gradient(135deg, hsl(172 80% 52%) 0%, hsl(260 60% 62%) 100%)' }}
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
          
          <RefreshCw className={`h-4 w-4 relative z-10 ${isPending ? 'animate-spin' : ''}`} />
          <span className="relative z-10 text-[13px] tracking-wide">
            {isPending ? 'Syncing Feeds...' : 'Force Sync Now'}
          </span>
        </button>

        <div className="mt-4 flex items-center justify-between px-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.14em]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>System Online</span>
          </div>
          <span className="px-2 py-0.5 rounded-md border border-white/[0.04]" style={{ background: 'hsl(225 12% 8%)' }}>
            Ready
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// Ensure RefreshCw is available
import { RefreshCw } from "lucide-react";
