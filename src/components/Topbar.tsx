import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { Github, Search } from "lucide-react";
import { pickGreeting } from "@/lib/quips";

const titles: Record<string, { t: string; s: string }> = {
  "/dashboard": { t: "Dashboard", s: "Real-time KPIs and model performance overview" },
  "/analysis": { t: "Data Analysis", s: "Exploratory analysis and business insights" },
  "/classification": { t: "Classification", s: "Predict customer satisfaction tier" },
  "/regression": { t: "Regression", s: "Forecast order revenue" },
  "/comparison": { t: "Model Comparison", s: "Benchmark all algorithms side-by-side" },
  "/upload": { t: "Upload Dataset", s: "Train models on your own CSV" },
  "/about": { t: "About the Project", s: "Methodology and business recommendations" },
};

export function Topbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const meta = titles[path] ?? { t: "LumenML", s: "" };
  const greeting = useMemo(() => pickGreeting(), [path]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden md:block">
          <h2 className="font-display text-[15px] font-semibold leading-tight text-foreground">{meta.t}</h2>
          <p className="text-xs text-muted-foreground">{meta.s}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground italic">
          <span className="text-base leading-none">✦</span>
          <span className="not-italic">{greeting}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          ML service connected
        </div>
        <a
          href="#"
          className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground transition"
          aria-label="GitHub"
        >
          <Github className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}
