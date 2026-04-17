import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, Trash2, Tag, PackageSearch, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useItems, useDeleteItem } from "@/hooks/use-items";
import { useMonitors } from "@/hooks/use-monitors";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Helper to strip HTML and extract preview from Craigslist CDATA description
function stripHtml(html: string) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function Dashboard() {
  const { data: items, isLoading: itemsLoading } = useItems();
  const { data: monitors } = useMonitors();
  const { mutate: deleteItem } = useDeleteItem();
  const { toast } = useToast();

  const [filterMonitor, setFilterMonitor] = useState<number | 'all'>('all');

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    deleteItem(id, {
      onSuccess: () => {
        toast({ title: "Item removed", description: "The item has been cleared from your dashboard." });
      }
    });
  };

  const filteredItems = items?.filter(item =>
    filterMonitor === 'all' ? true : item.monitorId === filterMonitor
  ) || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full">

      {/* ━━━ Page Header ━━━ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border border-primary/20 text-primary"
              style={{ background: 'hsl(172 80% 52% / 0.06)' }}
            >
              <Sparkles className="w-3 h-3" />
              Auto-Scanning
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient-sapphire">
            Recent Finds
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">
            Fresh free items discovered from your active feeds.
          </p>
        </div>

        {/* Filter pills */}
        {monitors && monitors.length > 0 && (
          <div className="flex flex-wrap gap-2 z-10">
            <button
              onClick={() => setFilterMonitor('all')}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 active-press border ${
                filterMonitor === 'all'
                  ? 'bg-primary/10 text-primary border-primary/25 shadow-[0_0_16px_hsl(172_80%_52%/0.12)]'
                  : 'border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/[0.1] hover:bg-white/[0.02]'
              }`}
            >
              All Items
            </button>
            {monitors.map(m => (
              <button
                key={m.id}
                onClick={() => setFilterMonitor(m.id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 active-press border ${
                  filterMonitor === m.id
                    ? 'bg-primary/10 text-primary border-primary/25 shadow-[0_0_16px_hsl(172_80%_52%/0.12)]'
                    : 'border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/[0.1] hover:bg-white/[0.02]'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ━━━ Content ━━━ */}

      {itemsLoading ? (
        /* Skeleton loading state */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-6 space-y-4 glass-card-premium animate-pulse border-white/[0.04]">
              <Skeleton className="h-5 w-16 rounded-lg" />
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <div className="flex justify-between items-center pt-4 border-t border-white/[0.04]">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center py-28 text-center rounded-3xl border border-white/[0.04]"
          style={{ background: 'linear-gradient(180deg, hsl(225 12% 6% / 0.5) 0%, hsl(225 12% 4% / 0.3) 100%)' }}
        >
          <div className="relative p-6 rounded-2xl mb-8 border border-primary/15"
            style={{ background: 'hsl(172 80% 52% / 0.06)' }}
          >
            <PackageSearch className="w-12 h-12 text-primary" />
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gradient-sapphire">No items found</h2>
          <p className="text-muted-foreground text-base max-w-md font-medium leading-relaxed">
            We haven't found any items matching your criteria yet. Ensure your monitors are active and try triggering a manual sync.
          </p>
        </motion.div>
      ) : (
        /* Item grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredItems.map((item, i) => {
              const monitor = monitors?.find(m => m.id === item.monitorId);
              const descriptionText = item.description ? stripHtml(item.description).slice(0, 140) + "..." : "No description available.";
              const postedDate = item.postedAt ? new Date(item.postedAt) : new Date(item.createdAt);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
                  >
                    <div
                      className="h-full flex flex-col p-6 rounded-2xl border border-white/[0.05] relative overflow-hidden transition-all duration-400 ease-out group-hover:border-white/[0.1] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]"
                      style={{
                        background: 'linear-gradient(165deg, hsl(225 12% 7%) 0%, hsl(225 12% 5.5%) 100%)',
                      }}
                    >
                      {/* Hover glow orb */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none transition-all duration-700 opacity-0 group-hover:opacity-100"
                        style={{ background: 'hsl(172 80% 52% / 0.08)' }}
                      />

                      {/* External link indicator */}
                      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                        <ExternalLink className="w-4 h-4 text-primary/70" />
                      </div>

                      {/* Monitor tag */}
                      <div className="inline-flex items-center gap-1.5 mb-4 w-fit">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg border border-primary/15 text-primary/80"
                          style={{ background: 'hsl(172 80% 52% / 0.05)' }}
                        >
                          <Tag className="w-3 h-3" />
                          {monitor?.name || 'Unknown'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-snug mb-2.5 group-hover:text-primary transition-colors duration-300 relative z-10">
                        {item.title}
                      </h3>

                      {/* Image */}
                      {item.imageUrl && (
                        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden z-10 border border-white/[0.04] bg-muted/20">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-muted-foreground/80 text-sm flex-grow line-clamp-3 mb-6 leading-relaxed relative z-10">
                        {descriptionText}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.04] relative z-10 group-hover:border-white/[0.06] transition-colors duration-300">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <div className="flex flex-col">
                            <span className="text-[13px] text-foreground/70 font-medium">
                              {formatDistanceToNow(postedDate, { addSuffix: true })}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 font-medium tracking-wide mt-0.5">
                              {format(postedDate, 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(item.id, e)}
                          className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 -mr-1 z-20 relative rounded-lg h-8 w-8 transition-all duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
