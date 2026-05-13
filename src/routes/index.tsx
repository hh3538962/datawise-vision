import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Activity,
  Layers,
  LineChart,
  Database,
  Cpu,
  Github,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumenML — AI Business Analytics Platform" },
      { name: "description", content: "Premium ML analytics platform with classification, regression, EDA and model comparison on real e-commerce data." },
      { property: "og:title", content: "LumenML — AI Business Analytics Platform" },
      { property: "og:description", content: "Compare 15+ ML models, predict customer behavior, and unlock business insights." },
    ],
  }),
  component: Landing,
});

const stats = [
  { label: "ML Models", value: "15+" },
  { label: "Records Analyzed", value: "17K" },
  { label: "Best Accuracy", value: "92%" },
  { label: "Features", value: "18" },
];

const features = [
  { icon: Brain, title: "Classification Engine", body: "9 algorithms predicting customer satisfaction with weighted F1, ROC and confusion matrices." },
  { icon: Activity, title: "Regression Forecasts", body: "8 regressors estimating order revenue with RMSE, MAE and R² benchmarking." },
  { icon: Layers, title: "Model Comparison", body: "Automated leaderboards highlight the best performer with feature-importance reasoning." },
  { icon: LineChart, title: "Interactive EDA", body: "Correlation heatmaps, distributions and category breakdowns rendered in real time." },
  { icon: Database, title: "Bring Your Data", body: "Drop a CSV that matches the schema and re-train every model on your own dataset." },
  { icon: Cpu, title: "Production-Ready API", body: "FastAPI service ships with Docker + Render config — deploy in minutes." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-success/20 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold">Lumen<span className="text-gradient">ML</span></span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#stack" className="hover:text-foreground transition">Stack</a>
          <a href="#team" className="hover:text-foreground transition">Team</a>
          <Link to="/about" className="hover:text-foreground transition">About</Link>
        </div>
        <Link
          to="/dashboard"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-medium text-primary-foreground glow transition hover:opacity-90"
        >
          Launch app <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Final Project · ML for Business Analytics
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Turn raw commerce data into{" "}
            <span className="text-gradient">predictive intelligence</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A production-grade analytics workspace that benchmarks 15+ machine learning models,
            forecasts revenue, predicts customer satisfaction and surfaces business actions —
            from a single beautiful dashboard.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3 text-sm font-medium text-primary-foreground glow transition hover:opacity-90"
            >
              Open dashboard <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/comparison"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-7 py-3 text-sm font-medium backdrop-blur transition hover:bg-card"
            >
              Compare models
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <p className="font-display text-3xl font-semibold text-gradient">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mt-16"
        >
          <div className="absolute inset-x-10 top-10 -z-10 h-72 bg-gradient-primary opacity-20 blur-3xl" />
          <div className="glass-strong overflow-hidden rounded-3xl border border-border/80 p-2">
            <div className="rounded-2xl bg-background/60 p-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-warning/70" />
                <span className="h-3 w-3 rounded-full bg-success/70" />
                <span className="ml-3 text-xs text-muted-foreground">lumen-ml.app/dashboard</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {["Revenue", "Orders", "Avg Rating", "Best F1"].map((l, i) => (
                  <div key={l} className="rounded-xl border border-border/60 bg-card/40 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
                    <p className="mt-1 font-display text-2xl font-semibold">
                      {["$12.4M", "17,049", "3.41", "0.892"][i]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 h-44 rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="h-44 rounded-xl border border-border/60 bg-gradient-to-br from-success/10 to-warning/10" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">What's inside</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">An end-to-end ML workspace</h2>
          <p className="mt-3 text-muted-foreground">
            Every screen was designed to make machine-learning depth feel approachable for business stakeholders.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="mx-auto max-w-7xl px-6 py-24">
        <div className="glass rounded-3xl p-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">Technology</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Built on a modern, production stack</h2>
              <p className="mt-3 text-muted-foreground">
                React 19 + TanStack Start on the frontend; FastAPI + scikit-learn on the backend.
                Every component, chart and prediction is engineered to scale.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              {[
                "React 19", "TanStack Start", "Tailwind v4", "Framer Motion", "Recharts",
                "FastAPI", "scikit-learn", "Pandas", "NumPy", "Docker", "Render",
              ].map((t) => (
                <div key={t} className="rounded-xl border border-border bg-card/40 px-3 py-2 text-center text-muted-foreground">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-primary">Project team</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">Built by analytics students</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Team Member 1", role: "Data & Modeling" },
            { name: "Team Member 2", role: "Frontend & UX" },
            { name: "Team Member 3", role: "Business Insights" },
          ].map((p, i) => (
            <div key={i} className="glass flex items-center gap-4 rounded-2xl p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary font-display text-lg font-semibold text-primary-foreground">
                {p.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Replace placeholders in <code className="rounded bg-card/60 px-1">src/routes/index.tsx</code> with your team's names.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center">
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <h2 className="relative font-display text-4xl font-semibold">Ready to explore the platform?</h2>
          <p className="relative mt-3 text-muted-foreground">
            Open the dashboard to see live KPIs, model leaderboards and prediction studios.
          </p>
          <Link
            to="/dashboard"
            className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3 text-sm font-medium text-primary-foreground glow"
          >
            Enter dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-border px-6 py-8 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LumenML · University Final Project</p>
          <div className="flex items-center gap-3">
            <Github className="h-4 w-4" />
            <span>Made with React, TanStack Start & scikit-learn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
