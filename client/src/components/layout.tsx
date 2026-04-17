import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Target, MessageSquare, Activity, Zap } from "lucide-react";
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
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 dark">
      {/* ━━━ Ambient Background Effects ━━━ */}
      <div className="fixed inset-0 pointer-events-none w-full h-full z-0">
        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.018] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Primary aurora - teal glow bottom right */}
        <div className="absolute -bottom-[30%] -right-[15%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full blur-[140px] pointer-events-none animate-breathe"
          style={{ background: 'radial-gradient(circle, hsl(172 80% 52% / 0.12) 0%, transparent 70%)' }}
        />

        {/* Accent aurora - violet glow top left */}
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full blur-[120px] pointer-events-none animate-breathe"
          style={{
            background: 'radial-gradient(circle, hsl(260 60% 62% / 0.08) 0%, transparent 70%)',
            animationDelay: '2s'
          }}
        />

        {/* Subtle center wash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vh] rounded-full blur-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(225 15% 8% / 0.5) 0%, transparent 70%)' }}
        />
      </div>

      <div className="flex flex-col h-screen h-[100dvh] relative z-10">
        {/* ━━━ Premium Top Bar ━━━ */}
        <header className="flex-none h-14 w-full flex items-center justify-between px-5 sm:px-8 z-50 sticky top-0 border-b border-white/[0.04]"
          style={{
            background: 'linear-gradient(180deg, hsl(225 15% 4% / 0.9) 0%, hsl(225 15% 4% / 0.75) 100%)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden border border-white/[0.08]"
              style={{
                background: 'linear-gradient(135deg, hsl(172 80% 52%) 0%, hsl(190 90% 55%) 50%, hsl(260 60% 62%) 100%)',
              }}
            >
              <Zap className="w-3.5 h-3.5 text-white drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </div>

            <span className="font-semibold tracking-tight text-[15px] text-foreground/90">
              CraigsCatch<span className="text-primary font-bold">.</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* System status pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06]"
              style={{ background: 'hsl(225 12% 8% / 0.6)' }}
            >
              <span className="relative flex h-[7px] w-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-400 shadow-[0_0_6px_hsl(152_70%_50%/0.6)]"></span>
              </span>
              <span className="text-[10px] font-semibold tracking-[0.12em] text-white/50 uppercase">
                Live
              </span>
            </div>
          </div>
        </header>

        {/* ━━━ Scrollable Content ━━━ */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full mx-auto max-w-[1400px] scrollbar-premium relative z-0">
          <div className="flex flex-col min-h-full p-4 sm:p-8 md:p-10 pb-32 sm:pb-32">
            <div className="flex-1">
              {children}
            </div>

            {/* ━━━ Premium Footer ━━━ */}
            <footer className="mt-16 mb-4 flex justify-center items-center w-full pointer-events-none fade-in animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="px-6 py-2.5 rounded-full border border-white/[0.04] bg-white/[0.02] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center">
                <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-muted-foreground/50 uppercase flex items-center gap-2.5">
                  Powered by
                  <span className="relative font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-flow bg-[length:200%_auto] drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]">
                    TECHGURU
                  </span>
                </p>
              </div>
            </footer>
          </div>
        </main>

        {/* ━━━ Premium Floating Dock ━━━ */}
        <div className="fixed bottom-5 inset-x-0 w-full flex justify-center z-50 pointer-events-none px-4">
          <nav
            className="pointer-events-auto flex items-center gap-0.5 p-1.5 rounded-2xl border border-white/[0.06] overflow-hidden relative"
            style={{
              background: 'linear-gradient(180deg, hsl(225 12% 8% / 0.85) 0%, hsl(225 12% 6% / 0.9) 100%)',
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              boxShadow: '0 20px 60px -10px rgba(0,0,0,0.5), 0 0 0 1px hsl(225 10% 13% / 0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "relative flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all duration-400 ease-out z-10 group overflow-hidden outline-none",
                    isActive
                      ? "text-primary"
                      : "text-white/35 hover:text-white/65 hover:bg-white/[0.03]"
                  )}>
                    {/* Active indicator */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'linear-gradient(180deg, hsl(172 80% 52% / 0.08) 0%, transparent 100%)',
                          }}
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, transparent, hsl(172 80% 52%), transparent)',
                            boxShadow: '0 0 12px hsl(172 80% 52% / 0.5)',
                          }}
                        />
                      </>
                    )}

                    <Icon className={cn(
                      "w-[20px] h-[20px] relative z-20 transition-all duration-300",
                      isActive
                        ? "drop-shadow-[0_0_6px_hsl(172_80%_52%/0.5)]"
                        : "group-hover:scale-105"
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
