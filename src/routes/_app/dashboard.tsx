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
import { CHART, CHART_PALETTE, AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from "@/lib/chart";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LumenML" }] }),
  component: Dashboard,
});

function Dashboard() {
  const monthly = (stats as any).monthly as { Date: string; revenue: number; orders: number }[];
  const revByCat = Object.entries((stats as any).rev_by_cat).map(([k, v]) => ({ name: k, value: v as number }));
  const revByCity = Object.entries((stats as any).rev_by_city).map(([k, v]) => ({ name: k, value: v as number }));
  const ratingDist = Object.entries((stats as any).rating_dist).map(([k, v]) => ({ name: `${k}★`, value: v as number }));

  const bestClf = [...models.classification].sort((a, b) => b.accuracy - a.accuracy)[0];
  const bestReg = [...models.regression].sort((a, b) => b.r2 - a.r2)[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total revenue" value={fmtCurrency((stats as any).total_revenue)} icon={DollarSign} accent="primary" delta="real notebook output" delay={0} />
        <KpiCard label="Orders" value={fmtNum((stats as any).rows)} icon={ShoppingBag} accent="accent" delay={0.05} />
        <KpiCard label="Avg rating" value={String((stats as any).avg_rating)} icon={Star} accent="warning" delay={0.1} />
        <KpiCard label="Customers" value={fmtNum((stats as any).unique_customers)} icon={Users} accent="success" delay={0.15} />
      </div>

      {/* Best models */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChampionCard
          icon={<Trophy className="h-4 w-4" />}
          tone="primary"
          eyebrow="Best classifier"
          title={bestClf.model}
          subtitle="predicting Customer_Rating"
          quip="This model cooked."
          metrics={[
            ["Accuracy", bestClf.accuracy],
            ["Precision", bestClf.precision],
            ["Recall", bestClf.recall],
            ["F1", bestClf.f1],
          ]}
        />
        <ChampionCard
          icon={<Trophy className="h-4 w-4" />}
          tone="accent"
          eyebrow="Best regressor"
          title={bestReg.model}
          subtitle="forecasting Total_Amount"
          quip="R² entered the chat."
          metrics={[
            ["R²", bestReg.r2],
            ["RMSE", bestReg.rmse],
            ["MAE", bestReg.mae],
            ["Time(s)", bestReg.time_s],
          ]}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <ChartHeader title="Monthly revenue & orders" hint="12-month trend" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.c1} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART.c1} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.c2} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART.c2} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="Date" tick={AXIS_TICK} />
              <YAxis yAxisId="L" tick={AXIS_TICK} />
              <YAxis yAxisId="R" orientation="right" tick={AXIS_TICK} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area yAxisId="L" type="monotone" dataKey="revenue" stroke={CHART.c1} fill="url(#rev)" strokeWidth={2} />
              <Area yAxisId="R" type="monotone" dataKey="orders" stroke={CHART.c2} fill="url(#ord)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="surface p-5">
          <ChartHeader title="Rating distribution" hint="1–5 stars" />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={ratingDist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {ratingDist.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <ChartHeader title="Revenue by category" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revByCat} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
              <XAxis type="number" tick={AXIS_TICK} />
              <YAxis type="category" dataKey="name" tick={AXIS_TICK} width={110} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {revByCat.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="surface p-5">
          <ChartHeader title="Revenue by city" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revByCity}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="name" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={CHART.c1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2">
        <QuickLink to="/classification" icon={<Brain className="h-4 w-4" />} title="Try classification" body="Predict customer rating from session data" />
        <QuickLink to="/regression" icon={<Activity className="h-4 w-4" />} title="Try regression" body="Forecast revenue for a new order" />
      </div>
    </div>
  );
}

function ChartHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-display text-[15px] font-semibold text-foreground">{title}</h3>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

function ChampionCard({
  eyebrow, title, subtitle, metrics, tone, icon, quip,
}: {
  eyebrow: string; title: string; subtitle: string;
  metrics: [string, number][]; tone: "primary" | "accent"; icon: React.ReactNode; quip: string;
}) {
  const dot = tone === "primary" ? "text-primary" : "text-accent";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface p-6">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground`}>
          <span className={dot}>{icon}</span> {eyebrow}
        </div>
        <Link to="/comparison" className={`inline-flex items-center gap-1 text-xs font-medium ${dot} hover:underline`}>
          Compare <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {metrics.map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border bg-secondary/40 px-2.5 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className="font-display text-base font-semibold text-foreground">{typeof v === "number" ? v.toFixed(3) : v}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs italic text-muted-foreground">✦ {quip}</p>
    </motion.div>
  );
}

function QuickLink({ to, icon, title, body }: { to: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link to={to as any} className="surface group flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{body}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
