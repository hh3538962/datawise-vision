import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LineChart,
  Layers,
  Brain,
  Activity,
  Upload,
  Info,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, group: "Overview" },
  { title: "Data Analysis", url: "/analysis", icon: LineChart, group: "Overview" },
  { title: "Classification", url: "/classification", icon: Brain, group: "Predict" },
  { title: "Regression", url: "/regression", icon: Activity, group: "Predict" },
  { title: "Model Comparison", url: "/comparison", icon: Layers, group: "Models" },
  { title: "Upload Dataset", url: "/upload", icon: Upload, group: "Models" },
  { title: "About", url: "/about", icon: Info, group: "Project" },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const groups = ["Overview", "Predict", "Models", "Project"] as const;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight">Lumen<span className="text-gradient">ML</span></span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Business Analytics</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g}>
            <SidebarGroupLabel>{g}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.filter((i) => i.group === g).map((item) => {
                  const active = path === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.url} className="flex items-center gap-2.5">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
