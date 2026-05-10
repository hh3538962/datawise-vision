import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Star, Users, ArrowRight, Trophy, Brain, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { KpiCard } from "@/components/KpiCard";
import stats from "@/data/stats.json";
import models from "@/data/models.json";
import { fmtCurrency, fmtNum } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LumenML" }] }),
  component: Dashboard,
});

const COLORS = ["oklch(0.78 0.18 200)", "oklch(0.65 0.22 295)", "oklch(0.74 0.16 155)", "oklch(0.82 0.17 80)", "oklch(0.7 0.2 22)", "oklch(0.6 0.18 170)", "oklch(0.7 0.18 330)"];

function Dashboard() {
  const monthly = (stats as any).monthly as { Date: string; revenue: number; orders: number }[];
  const revByCat = Object.entries((stats as any).rev_by_cat).map(([k, v]) => ({ name: k, value: v as number }));
  const revByCity = Object.entries((stats as any).rev_by_city).map(([k, v]) => ({ name: k, value: v as number }));
  const ratingDist = Object.entries((stats as any).rating_dist).map(([k, v]) => ({ name: `★ ${k}`, value: v as number }));

  const bestClf = [...models.classification].sort((a, b) => b.accuracy - a.accuracy)[0];
  const bestReg = [...models.regression].sort((a, b) => b.r2 - a.r2)[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={fmtCurrency((stats as any).total_revenue)} icon={DollarSign} accent="primary" delta="+ baseline" delay={0} />
        <KpiCard label="Orders" value={fmtNum((stats as any).rows)} icon={ShoppingBag} accent="accent" delay={0.05} />
        <KpiCard label="Avg Rating" value={String((stats as any).avg_rating)} icon={Star} accent="warning" delay={0.1} />
        <KpiCard label="Customers" value={fmtNum((stats as any).unique_customers)} icon={Users} accent="success" delay={0.15} />
      </div>

      {/* Best models */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass relative overflow-hidden rounded-2xl p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Trophy className="h-4 w-4 text-primary" /> Best classifier
            </div>
            <Link to="/comparison" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Compare <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="mt-4 font-display text-3xl font-semibold">{bestClf.model}</p>
          <p className="text-sm text-muted-foreground">predicting Customer_Rating</p>
          <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
            {[
              ["Accuracy", bestClf.accuracy],
              ["Precision", bestClf.precision],
              ["Recall", bestClf.recall],
              ["F1", bestClf.f1],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border/60 bg-background/30 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="font-display text-lg font-semibold">{(v as number).toFixed(3)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass relative overflow-hidden rounded-2xl p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Trophy className="h-4 w-4 text-accent" /> Best regressor
            </div>
            <Link to="/comparison" className="text-xs text-accent hover:underline inline-flex items-center gap-1">
              Compare <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="mt-4 font-display text-3xl font-semibold">{bestReg.model}</p>
          <p className="text-sm text-muted-foreground">forecasting Total_Amount</p>
          <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
            {[
              ["R²", bestReg.r2],
              ["RMSE", bestReg.rmse],
              ["MAE", bestReg.mae],
              ["Time(s)", bestReg.time_s],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border/60 bg-background/30 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="font-display text-lg font-semibold">{typeof v === "number" ? (v as number).toFixed(2) : v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Monthly revenue & orders</h3>
            <span className="text-xs text-muted-foreground">12-month trend</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="Date" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <YAxis yAxisId="L" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <YAxis yAxisId="R" orientation="right" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 265)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
              <Area yAxisId="L" type="monotone" dataKey="revenue" stroke="oklch(0.78 0.18 200)" fill="url(#rev)" strokeWidth={2} />
              <Area yAxisId="R" type="monotone" dataKey="orders" stroke="oklch(0.65 0.22 295)" fill="url(#ord)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold">Rating distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={ratingDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {ratingDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 265)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold">Revenue by category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revByCat} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} width={100} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 265)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {revByCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold">Revenue by city</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revByCity}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.03 265)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="oklch(0.78 0.18 200)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/classification" className="glass group flex items-center justify-between rounded-2xl p-5 transition hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary"><Brain className="h-5 w-5 text-primary-foreground" /></div>
            <div>
              <p className="font-medium">Try classification</p>
              <p className="text-xs text-muted-foreground">Predict customer rating from session data</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5" />
        </Link>
        <Link to="/regression" className="glass group flex items-center justify-between rounded-2xl p-5 transition hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary"><Activity className="h-5 w-5 text-primary-foreground" /></div>
            <div>
              <p className="font-medium">Try regression</p>
              <p className="text-xs text-muted-foreground">Forecast revenue for a new order</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
