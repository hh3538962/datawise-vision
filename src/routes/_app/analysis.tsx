import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
} from "recharts";
import stats from "@/data/stats.json";
import { Lightbulb, AlertCircle, TrendingUp, Target } from "lucide-react";

export const Route = createFileRoute("/_app/analysis")({
  head: () => ({ meta: [{ title: "Data Analysis — LumenML" }] }),
  component: Analysis,
});

const tooltip = { contentStyle: { background: "oklch(0.18 0.03 265)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 } };

function Heatmap() {
  const cols = (stats as any).corr_cols as string[];
  const corr = (stats as any).corr as Record<string, Record<string, number>>;
  return (
    <div className="overflow-x-auto">
      <table className="text-[11px]">
        <thead>
          <tr>
            <th></th>
            {cols.map((c) => <th key={c} className="px-2 py-1 font-medium text-muted-foreground" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {cols.map((r) => (
            <tr key={r}>
              <td className="pr-3 text-muted-foreground">{r}</td>
              {cols.map((c) => {
                const v = corr[r][c];
                const a = Math.abs(v);
                const color = v >= 0
                  ? `oklch(0.78 ${0.18 * a} 200 / ${Math.max(0.15, a)})`
                  : `oklch(0.65 ${0.22 * a} 22 / ${Math.max(0.15, a)})`;
                return (
                  <td key={c} className="p-0.5">
                    <div className="flex h-9 w-12 items-center justify-center rounded font-mono text-[10px] font-medium" style={{ background: color }}>
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
  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insights.map((i, k) => (
          <motion.div key={i.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05 }}
            className="glass rounded-2xl p-5">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-${i.color}/15 text-${i.color}`}>
              <i.icon className="h-4 w-4" />
            </div>
            <p className="font-medium">{i.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{i.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Correlation heatmap */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Correlation heatmap</h3>
            <p className="text-xs text-muted-foreground">Pearson correlation across numeric features</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>−1</span>
            <div className="h-2 w-32 rounded-full" style={{ background: "linear-gradient(to right, oklch(0.65 0.22 22), oklch(0.3 0.02 265), oklch(0.78 0.18 200))" }} />
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
          <div key={d.title} className="glass rounded-2xl p-5">
            <h3 className="font-display text-lg font-semibold">{d.title}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="x" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
                <Tooltip {...tooltip} />
                <Bar dataKey="y" fill="oklch(0.78 0.18 200)" radius={[6, 6, 0, 0]} />
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
            <div key={d.k} className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg font-semibold">{d.title}</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} width={100} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {data.map((_, i) => <Cell key={i} fill={`oklch(${0.65 + (i % 3) * 0.05} 0.2 ${200 + i * 25})`} />)}
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
