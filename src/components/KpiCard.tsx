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

const accentBg: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
};

export function KpiCard({ label, value, delta, icon: Icon, accent = "primary", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className="surface group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-tight text-foreground">{value}</p>
          {delta && <p className="mt-2 text-xs font-medium text-success">{delta}</p>}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg[accent]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}
