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
    body: "Build a unified analytics workspace that (1) classifies expected customer rating per order, (2) regresses expected order revenue, (3) compares the four classifiers and four regressors trained in our notebook, and (4) translates results into business actions a non-technical decision-maker can use.",
  },
  {
    icon: Database, title: "Dataset",
    body: "17,049 e-commerce transactions across 5 Turkish cities with 18 features per row including demographics, session telemetry, pricing, payment method and delivery performance. Target for classification: Customer_Rating (1–5★). Target for regression: Total_Amount.",
  },
  {
    icon: Cpu, title: "Methodology",
    body: "Median/mode imputation, label-encoding for categoricals, standard scaling for distance-based learners, 80/20 stratified split, then training of 4 classifiers (Logistic Regression, Decision Tree, Random Forest, Gradient Boosting) and 4 regressors of the same family with weighted metrics, confusion matrices and feature importance.",
  },
  {
    icon: Lightbulb, title: "Business recommendations",
    body: "Prioritize ≤4-day delivery on Mobile + Returning customer segments to lift average rating by ~0.5★. Bundle Home & Garden with Sports promotions — they correlate with the largest basket size. Promote digital wallets in Konya and Ankara, where they outperform other payment methods.",
  },
  {
    icon: Rocket, title: "Tech stack",
    body: "Frontend: React 19, TanStack Start, Tailwind v4, Framer Motion, Recharts. Backend: FastAPI, scikit-learn, Pandas, NumPy, Joblib. Deployed via Docker on Render with the frontend hosted on Lovable.",
  },
];

function About() {
  return (
    <div className="space-y-6">
      <div className="surface relative overflow-hidden p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <p className="relative text-[11px] font-medium uppercase tracking-widest text-primary">University final project</p>
        <h1 className="relative mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Machine Learning for Business Analytics
        </h1>
        <p className="relative mt-3 max-w-2xl text-muted-foreground">
          LumenML demonstrates how a complete ML pipeline — from preprocessing through deployment —
          can deliver actionable, revenue-impacting intelligence in a single, clean workspace.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="surface p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="surface p-6 text-sm text-muted-foreground">
        <p className="font-display text-[15px] font-semibold text-foreground">Deployment</p>
        <p className="mt-2">
          The bundled <code className="rounded bg-secondary px-1 font-mono text-foreground">ml-backend/</code> folder ships with a Dockerfile and render.yaml.
          Deploy to Render in two clicks, copy the URL, and paste it into <code className="rounded bg-secondary px-1 font-mono text-foreground">VITE_ML_API_URL</code> to wire live training and prediction.
        </p>
      </div>
    </div>
  );
}
