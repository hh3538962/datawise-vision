import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  accent?: "primary" | "accent" | "success" | "warning";
  delay?: number;
}

const accentMap = {
  primary: "from-primary/20 to-primary/5 text-primary",
  accent: "from-accent/20 to-accent/5 text-accent",
  success: "from-success/20 to-success/5 text-success",
  warning: "from-warning/20 to-warning/5 text-warning",
} as const;

export function KpiCard({ label, value, delta, icon: Icon, accent = "primary", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="glass relative overflow-hidden rounded-2xl p-5"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentMap[accent]} opacity-50`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
          {delta && <p className="mt-1 text-xs text-success">{delta}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-background/40 backdrop-blur ${accentMap[accent].split(" ").pop()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
