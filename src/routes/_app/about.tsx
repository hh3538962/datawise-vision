import { createFileRoute } from "@tanstack/react-router";
import { Target, Lightbulb, Database, Cpu, BookOpen, Rocket } from "lucide-react";

export const Route = createFileRoute("/_app/about")({
  head: () => ({ meta: [{ title: "About — LumenML" }] }),
  component: About,
});

const sections = [
  {
    icon: BookOpen, title: "Problem statement",
    body: "E-commerce platforms struggle to anticipate which orders will lead to high customer satisfaction and which sessions will produce the most revenue. Without predictive insight, marketing budgets, delivery SLAs and pricing strategies remain reactive.",
  },
  {
    icon: Target, title: "Objectives",
    body: "Build a unified analytics workspace that (1) classifies expected customer rating per order, (2) regresses expected order revenue, (3) compares 15+ ML algorithms on weighted metrics, and (4) translates results into business actions a non-technical decision-maker can use.",
  },
  {
    icon: Database, title: "Dataset",
    body: "17,049 e-commerce transactions across 5 Turkish cities with 18 features per row including demographics, session telemetry, pricing, payment method and delivery performance. The target for classification is Customer_Rating (1–5 stars); for regression it is Total_Amount.",
  },
  {
    icon: Cpu, title: "Methodology",
    body: "Median/mode imputation, label-encoding for categoricals, standard scaling for distance-based learners, 80/20 stratified split, then a sweep of 9 classifiers and 8 regressors with weighted metrics, confusion matrices and feature importance.",
  },
  {
    icon: Lightbulb, title: "Business recommendations",
    body: "Prioritize ≤4-day delivery on Mobile-Returning customer segments to lift average rating by ~0.5★. Bundle Home & Garden with Sports promotions — they correlate with the largest basket size. Promote digital wallets in Konya and Ankara, where they outperform other payments.",
  },
  {
    icon: Rocket, title: "Tech stack",
    body: "Frontend: React 19, TanStack Start, Tailwind v4, Framer Motion, Recharts. Backend: FastAPI, scikit-learn, XGBoost, Pandas, NumPy, Joblib. Deployed via Docker on Render with the frontend hosted on Lovable.",
  },
];

function About() {
  return (
    <div className="space-y-6">
      <div className="glass relative overflow-hidden rounded-3xl p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
        <p className="text-xs uppercase tracking-widest text-primary">University Final Project</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Machine Learning for Business Analytics</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          LumenML demonstrates how a complete ML pipeline — from preprocessing through deployment —
          can deliver actionable, revenue-impacting intelligence in a single, beautiful workspace.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="glass rounded-2xl p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary glow">
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
        <p className="font-display text-base font-semibold text-foreground">Deployment</p>
        <p className="mt-2">The bundled <code className="rounded bg-card/60 px-1">ml-backend/</code> folder ships with a Dockerfile and render.yaml. Deploy to Render in two clicks, copy the URL, and paste it into <code className="rounded bg-card/60 px-1">VITE_ML_API_URL</code> to wire live training and prediction.</p>
      </div>
    </div>
  );
}
