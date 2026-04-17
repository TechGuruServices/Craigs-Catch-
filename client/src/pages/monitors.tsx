import { MonitorForm } from "@/components/monitor-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteMonitor, useMonitors } from "@/hooks/use-monitors";
import { useToast } from "@/hooks/use-toast";
import { type MonitorResponse } from "@shared/schema";
import { format } from "date-fns";
import { Edit2, Plus, RadioReceiver, Clock, Trash2, Circle, Pause } from "lucide-react";
import { useState } from "react";

export default function Monitors() {
  const { data: monitors, isLoading } = useMonitors();
  const { mutate: deleteMonitor } = useDeleteMonitor();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<MonitorResponse | null>(null);

  const handleCreate = () => {
    setEditingMonitor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (monitor: MonitorResponse) => {
    setEditingMonitor(monitor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this monitor? All associated items will also be removed.")) {
      deleteMonitor(id, {
        onSuccess: () => {
          toast({ title: "Monitor deleted", description: "Monitor and its items have been removed." });
        }
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full">

      {/* ━━━ Page Header ━━━ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-sapphire">
            Active Monitors
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">
            Manage your Craigslist RSS feeds to scrape for free stuff.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="group flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-[14px] z-10 transition-all duration-300 active-press border border-primary/25 text-primary hover:shadow-[0_0_24px_hsl(172_80%_52%/0.15)]"
          style={{ background: 'linear-gradient(135deg, hsl(172 80% 52% / 0.1) 0%, hsl(260 60% 62% / 0.06) 100%)' }}
        >
          <Plus className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-90" />
          Add Monitor
        </button>
      </div>

      {/* ━━━ Dialog ━━━ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[500px] rounded-2xl border border-white/[0.06] shadow-[0_32px_100px_rgba(0,0,0,0.5)]"
          style={{
            background: 'linear-gradient(180deg, hsl(225 12% 7%) 0%, hsl(225 12% 5%) 100%)',
            backdropFilter: 'blur(40px)',
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-gradient-sapphire">
              {editingMonitor ? "Edit Monitor" : "Create Monitor"}
            </DialogTitle>
          </DialogHeader>
          <MonitorForm
            initialData={editingMonitor || undefined}
            onSuccess={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ━━━ Content ━━━ */}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6 glass-card-premium border-white/[0.04] animate-pulse">
              <div className="flex gap-5 items-center">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-1/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : monitors?.length === 0 ? (
        /* Empty state */
        <div 
          className="flex flex-col items-center justify-center py-28 text-center rounded-3xl border border-white/[0.04]"
          style={{ background: 'linear-gradient(180deg, hsl(225 12% 6% / 0.5) 0%, hsl(225 12% 4% / 0.3) 100%)' }}
        >
          <div className="relative p-6 rounded-2xl mb-8 border border-primary/15"
            style={{ background: 'hsl(172 80% 52% / 0.06)' }}
          >
            <RadioReceiver className="w-12 h-12 text-primary" />
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gradient-sapphire">No monitors yet</h2>
          <p className="text-muted-foreground text-base max-w-md mb-10 font-medium leading-relaxed">
            Create your first monitor by providing a Craigslist RSS search URL. We'll automatically fetch new items as they appear.
          </p>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-300 active-press border border-primary/25 text-primary hover:shadow-[0_0_24px_hsl(172_80%_52%/0.15)]"
            style={{ background: 'linear-gradient(135deg, hsl(172 80% 52% / 0.1) 0%, hsl(260 60% 62% / 0.06) 100%)' }}
          >
            <Plus className="w-5 h-5" />
            Create First Monitor
          </button>
        </div>
      ) : (
        /* Monitor cards grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {monitors?.map((monitor) => (
            <div
              key={monitor.id}
              className={`group relative rounded-2xl border overflow-hidden transition-all duration-400 ease-out hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)] ${
                monitor.active
                  ? "border-white/[0.06] hover:border-white/[0.1]"
                  : "border-white/[0.03] opacity-60 hover:opacity-90"
              }`}
              style={{
                background: monitor.active
                  ? 'linear-gradient(165deg, hsl(225 12% 7%) 0%, hsl(225 12% 5.5%) 100%)'
                  : 'linear-gradient(165deg, hsl(225 10% 6%) 0%, hsl(225 10% 4.5%) 100%)',
              }}
            >
              {/* Active left accent stripe */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full transition-colors duration-500 ${
                monitor.active
                  ? "bg-primary shadow-[2px_0_8px_hsl(172_80%_52%/0.3)]"
                  : "bg-white/10"
              }`} />

              {/* Hover ambient glow */}
              {monitor.active && (
                <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[60px] pointer-events-none transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                  style={{ background: 'hsl(172 80% 52% / 0.06)' }}
                />
              )}

              <div className="p-6 pl-7 flex items-start justify-between gap-5 relative z-10">
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Title row */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                      {monitor.name}
                    </h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] border ${
                      monitor.active
                        ? "text-primary/80 border-primary/15"
                        : "text-muted-foreground/60 border-white/[0.06]"
                    }`}
                      style={{
                        background: monitor.active
                          ? 'hsl(172 80% 52% / 0.06)'
                          : 'hsl(225 10% 11%)'
                      }}
                    >
                      {monitor.active ? (
                        <Circle className="w-2 h-2 fill-primary text-primary" />
                      ) : (
                        <Pause className="w-2.5 h-2.5" />
                      )}
                      {monitor.active ? "Active" : "Paused"}
                    </span>
                  </div>

                  {/* URL display */}
                  <p className="text-[13px] text-foreground/50 font-mono truncate px-3 py-2.5 rounded-lg border border-white/[0.04] max-w-full"
                    style={{ background: 'hsl(225 12% 5%)' }}
                  >
                    {monitor.url}
                  </p>

                  {/* Last check info */}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60 font-semibold tracking-wide uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Last Check: {monitor.lastChecked
                        ? format(new Date(monitor.lastChecked), "MMM d, yyyy h:mm a")
                        : "Never"}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  <button
                    onClick={() => handleEdit(monitor)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium text-muted-foreground border border-white/[0.06] hover:border-primary/30 hover:text-primary hover:bg-primary/[0.05] transition-all duration-200 active-press"
                    style={{ background: 'hsl(225 12% 8%)' }}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(monitor.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium text-muted-foreground border border-white/[0.06] hover:border-destructive/30 hover:text-destructive hover:bg-destructive/[0.05] transition-all duration-200 active-press"
                    style={{ background: 'hsl(225 12% 8%)' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
