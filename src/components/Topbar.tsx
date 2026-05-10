import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouterState } from "@tanstack/react-router";
import { Github } from "lucide-react";

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
  const meta = titles[path] ?? { t: "Lumen ML", s: "" };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden md:block">
          <h2 className="font-display text-lg font-semibold leading-tight">{meta.t}</h2>
          <p className="text-xs text-muted-foreground">{meta.s}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="hidden md:inline-flex h-2 w-2 rounded-full bg-success" />
        <span className="hidden md:inline">ML service: connected</span>
        <Github className="ml-3 h-4 w-4" />
      </div>
    </header>
  );
}
