import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
} from "recharts";
import stats from "@/data/stats.json";
import { Lightbulb, AlertCircle, TrendingUp, Target } from "lucide-react";
import { CHART, CHART_PALETTE, AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from "@/lib/chart";

export const Route = createFileRoute("/_app/analysis")({
  head: () => ({ meta: [{ title: "Data Analysis — LumenML" }] }),
  component: Analysis,
});

function Heatmap() {
  const cols = (stats as any).corr_cols as string[];
  const corr = (stats as any).corr as Record<string, Record<string, number>>;
  return (
    <div className="overflow-x-auto">
      <table className="text-[11px]">
        <thead>
          <tr>
            <th></th>
            {cols.map((c) => (
              <th key={c} className="px-2 py-1 font-medium text-muted-foreground"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cols.map((r) => (
            <tr key={r}>
              <td className="pr-3 font-medium text-muted-foreground">{r}</td>
              {cols.map((c) => {
                const v = corr[r][c];
                const a = Math.abs(v);
                // positive = blue, negative = warm coral, neutral = light slate
                const color = v >= 0
                  ? `oklch(0.5 ${0.16 * a} 255 / ${Math.max(0.08, a * 0.85)})`
                  : `oklch(0.65 ${0.18 * a} 30 / ${Math.max(0.08, a * 0.85)})`;
                const fg = a > 0.55 ? "white" : "oklch(0.3 0.04 260)";
                return (
                  <td key={c} className="p-0.5">
                    <div
                      className="flex h-9 w-12 items-center justify-center rounded-md font-mono text-[10px] font-medium"
                      style={{ background: color, color: fg, border: "1px solid oklch(0.9 0.01 255)" }}
                    >
                      {v.toFixed(2)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Analysis() {
  const cats = (k: string) => Object.entries((stats as any)[k] as Record<string, number>).map(([name, value]) => ({ name, value }));
  const insights = [
    { icon: TrendingUp, color: "primary", title: "Home & Garden drives revenue", body: "Home & Garden and Sports lead total revenue thanks to high unit prices, even though Books and Beauty drive volume." },
    { icon: Target, color: "accent", title: "Returning customers spend more", body: "Returning customers complete more multi-item orders and rate the experience meaningfully higher." },
    { icon: AlertCircle, color: "warning", title: "Delivery time impacts rating", body: "Orders delivered in ≤4 days correlate with the highest ratings; delays beyond 9 days drop satisfaction." },
    { icon: Lightbulb, color: "success", title: "Mobile dominates engagement", body: "Mobile sessions account for the majority of orders — optimize the checkout funnel for small screens first." },
  ];
  const toneBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/10 text-success",
  };

  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insights.map((i, k) => (
          <motion.div key={i.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.04 }}
            className="surface p-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${toneBg[i.color]}`}>
              <i.icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-foreground">{i.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{i.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Correlation heatmap */}
      <div className="surface p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">Correlation heatmap</h3>
            <p className="text-[11px] text-muted-foreground">Pearson correlation across numeric features</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>−1</span>
            <div className="h-2 w-32 rounded-full"
                 style={{ background: "linear-gradient(to right, oklch(0.65 0.18 30), oklch(0.95 0.005 250), oklch(0.5 0.16 255))" }} />
            <span>+1</span>
          </div>
        </div>
        <Heatmap />
      </div>

      {/* Distributions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { title: "Age distribution", data: (stats as any).dist_age },
          { title: "Total amount distribution", data: (stats as any).dist_total },
          { title: "Session duration (min)", data: (stats as any).dist_session },
          { title: "Pages viewed", data: (stats as any).dist_pages },
        ].map((d) => (
          <div key={d.title} className="surface p-5">
            <h3 className="font-display text-[15px] font-semibold text-foreground">{d.title}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.data}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="x" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="y" fill={CHART.c1} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Categorical breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { title: "Payment methods", k: "payment" },
          { title: "Device types", k: "device" },
          { title: "Cities", k: "city" },
          { title: "Categories", k: "category" },
        ].map((d) => {
          const data = cats(d.k);
          return (
            <div key={d.k} className="surface p-5">
              <h3 className="font-display text-[15px] font-semibold text-foreground">{d.title}</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                  <XAxis type="number" tick={AXIS_TICK} />
                  <YAxis type="category" dataKey="name" tick={AXIS_TICK} width={100} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                    {data.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}
