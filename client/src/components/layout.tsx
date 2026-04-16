import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Target, MessageSquare, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Feed", icon: LayoutDashboard },
    { href: "/monitors", label: "Monitors", icon: Target },
    { href: "/chat", label: "AI Intel", icon: MessageSquare },
  ];

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 dark">
      {/* Deep Space Background Effects - Raycast/Linear Inspired */}
      <div className="fixed inset-0 pointer-events-none w-full h-full">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Deep ambient glow from bottom right */}
        <div className="absolute -bottom-1/2 -right-[20%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse-glow pointer-events-none" />
        
        {/* Subtle mesh top left */}
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-violet-500/10 blur-[100px] mix-blend-screen pointer-events-none" />
      </div>

      <div className="flex flex-col h-screen relative z-10">
        {/* Sleek MacOS-like Top Bar */}
        <header className="flex-none h-14 w-full flex items-center justify-between px-6 z-50 glass-ultra border-b border-white/5 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_15px_hsl(var(--primary)/40%)] flex items-center justify-center border border-white/20">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold tracking-wide text-[15px] font-display text-white/90">
              CraigsCatch<span className="text-primary ml-0.5">.</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium tracking-wider text-white/60 uppercase">System Active</span>
            </div>
          </div>
        </header>

        {/* Dynamic Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full mx-auto max-w-[1400px] scrollbar-premium relative z-0">
           <div className="p-4 sm:p-8 md:p-10 pb-32 sm:pb-32">
             {children}
           </div>
        </main>

        {/* Minimalist Floating Dock (Mobile-First / Desktop Centered) */}
        <div className="fixed bottom-6 inset-x-0 w-full flex justify-center z-50 pointer-events-none px-4">
          <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl glass-card-premium border border-white/10 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5),0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-3xl overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/5" />
            
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl transition-all duration-500 ease-out z-10 group overflow-hidden outline-none",
                    isActive ? "text-white" : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]"
                  )}>
                    {/* Active Background Glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl flex items-center justify-center">
                        <div className="absolute bottom-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_-4px_10px_hsl(var(--primary)/50%)]" />
                      </div>
                    )}
                    
                    <Icon className={cn(
                      "w-[22px] h-[22px] relative z-20 transition-transform duration-300",
                      isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "group-hover:scale-105"
                    )} />
                    <span className={cn(
                      "text-[13px] font-medium tracking-wide relative z-20 transition-all duration-300",
                      isActive ? "opacity-100" : "hidden sm:block sm:opacity-100"
                    )}>
                      {item.label}
                    </span>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
