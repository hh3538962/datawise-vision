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
  Check,
} from "lucide-react";
import models from "@/data/models.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumenML — Machine Learning for Business Analytics" },
      { name: "description", content: "A clean ML analytics platform: classification, regression, EDA, and model comparison on real e-commerce data. Built for a university final project." },
      { property: "og:title", content: "LumenML — Machine Learning for Business Analytics" },
      { property: "og:description", content: "Compare 4 classifiers + 4 regressors, predict customer behavior, and surface business actions." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "Classification", body: "Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting predicting Customer Rating." },
  { icon: Activity, title: "Regression", body: "Four regressors estimating order revenue with RMSE, MAE, and R² benchmarks." },
  { icon: Layers, title: "Model Comparison", body: "Leaderboards, confusion matrices, and feature importance — all side by side." },
  { icon: LineChart, title: "Interactive EDA", body: "Correlation heatmaps, distributions, and category breakdowns rendered in real time." },
  { icon: Database, title: "Bring Your Data", body: "Upload a CSV that matches the schema and retrain every model on your dataset." },
  { icon: Cpu, title: "FastAPI Backend", body: "scikit-learn service ships with Docker + Render config — deploy in minutes." },
];

function Landing() {
  const bestClf = [...models.classification].sort((a, b) => b.f1 - a.f1)[0];
  const bestReg = [...models.regression].sort((a, b) => b.r2 - a.r2)[0];

  return (
    <div className="relative min-h-screen mesh-bg">
      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
            Lumen<span className="text-primary">ML</span>
          </span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#stack" className="hover:text-foreground transition">Stack</a>
          <a href="#team" className="hover:text-foreground transition">Team</a>
          <Link to="/about" className="hover:text-foreground transition">About</Link>
        </div>
        <Link to="/dashboard" className="btn-primary">
          Open dashboard <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            University final project · ML for Business Analytics
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
            Turn raw commerce data into{" "}
            <span className="text-gradient">predictive intelligence</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
            A clean analytics workspace that benchmarks ML models, forecasts revenue,
            predicts customer satisfaction, and surfaces business actions — all from one dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="btn-primary">
              Launch app <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/comparison" className="btn-ghost">Compare models</Link>
          </div>
          <p className="mt-4 text-xs italic text-muted-foreground">
            ✦ Loading intelligence… hopefully.
          </p>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
        >
          {[
            { v: "8", l: "ML models" },
            { v: "17K", l: "Records" },
            { v: `${(bestClf.accuracy * 100).toFixed(1)}%`, l: "Best accuracy" },
            { v: bestReg.r2.toFixed(3), l: "Best R²" },
          ].map((s) => (
            <div key={s.l} className="surface px-4 py-4 text-center">
              <p className="font-display text-2xl font-semibold tracking-tight text-foreground">{s.v}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </motion.div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="relative mt-14"
        >
          <div className="surface overflow-hidden p-2">
            <div className="rounded-[calc(var(--radius-xl)-6px)] border border-border bg-secondary/40 p-5">
              <div className="flex items-center gap-1.5 border-b border-border pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground">lumen-ml.app/dashboard</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ["Revenue", "$12.4M"],
                  ["Orders", "17,049"],
                  ["Avg rating", "3.41"],
                  ["Best F1", bestClf.f1.toFixed(3)],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-lg border border-border bg-card p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{l}</p>
                    <p className="mt-1 font-display text-xl font-semibold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2 h-40 rounded-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="h-40 rounded-lg border border-border bg-gradient-to-br from-success/5 to-primary/5" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">What's inside</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            An end-to-end ML workspace
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every screen was designed to make machine-learning depth feel approachable for business stakeholders.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="surface p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="mx-auto max-w-6xl px-6 py-16">
        <div className="surface p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-accent">Technology</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Built on a modern, production stack
              </h2>
              <p className="mt-3 text-muted-foreground">
                React 19 + TanStack Start on the frontend. FastAPI + scikit-learn on the backend.
                Every component, chart, and prediction is engineered to scale.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {[
                  "Stratified 80/20 split on the same notebook pipeline",
                  "Weighted precision/recall for imbalanced ratings",
                  "Real metrics — no placeholders, no fake numbers",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
              {[
                "React 19", "TanStack Start", "Tailwind v4", "Framer Motion", "Recharts",
                "FastAPI", "scikit-learn", "Pandas", "NumPy", "Docker", "Render",
              ].map((t) => (
                <div key={t} className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-center text-muted-foreground">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Project team</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">Built by analytics students</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: "Team Member 1", role: "Data & Modeling" },
            { name: "Team Member 2", role: "Frontend & UX" },
            { name: "Team Member 3", role: "Business Insights" },
          ].map((p, i) => (
            <div key={i} className="surface flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary font-display text-sm font-semibold text-primary-foreground">
                {p.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Replace placeholders in <code className="rounded bg-secondary px-1 font-mono">src/routes/index.tsx</code> with your team's names.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="surface relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-foreground">
            Ready to explore the platform?
          </h2>
          <p className="relative mt-2 text-muted-foreground">
            Open the dashboard for live KPIs, model leaderboards, and prediction studios.
          </p>
          <Link to="/dashboard" className="btn-primary relative mt-6">
            Enter dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LumenML · University final project</p>
          <div className="flex items-center gap-2">
            <Github className="h-3.5 w-3.5" />
            <span>Made with React, TanStack Start & scikit-learn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
