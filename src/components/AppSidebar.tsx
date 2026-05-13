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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
              Lumen<span className="text-primary">ML</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Business Analytics
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {groups.map((g) => (
          <SidebarGroup key={g}>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.filter((i) => i.group === g).map((item) => {
                  const active = path === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.url} className="flex items-center gap-2.5 rounded-md">
                          <item.icon className="h-4 w-4" />
                          <span className="text-[13px]">{item.title}</span>
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
