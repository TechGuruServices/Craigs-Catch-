import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="relative flex min-h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(20,184,166,0.22),transparent_18%),radial-gradient(circle_at_92%_10%,rgba(59,130,246,0.14),transparent_18%),radial-gradient(circle_at_48%_78%,rgba(96,165,250,0.12),transparent_24%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,19,0.92),rgba(9,14,22,0.98))]" />

        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0 relative z-0">
          <header className="flex h-20 items-center justify-between px-8 border-b border-white/10 bg-card/55 backdrop-blur-3xl sticky top-0 z-50 shadow-sm shadow-black/20">
            <div className="flex items-center gap-5">
              <SidebarTrigger className="hover-elevate active-elevate-2 w-11 h-11 bg-card/80 border border-white/10 text-foreground/75 hover:text-primary transition-all rounded-2xl shadow-sm shadow-black/10" />
              <div>
                <h1 className="text-2xl font-bold font-display tracking-tight text-glow bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  CraigsCatch
                </h1>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70 mt-1">
                  Premium alert scanner, always dark.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-background/15 px-4 py-2 text-sm text-foreground/80 shadow-sm shadow-black/10 backdrop-blur-xl">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(20,184,166,0.45)]" />
              Live feed monitor
            </div>
          </header>

          <main className="relative flex-1 overflow-auto bg-transparent px-4 py-6 md:px-8 md:py-10">
            <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%)] pointer-events-none -z-10" />
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
