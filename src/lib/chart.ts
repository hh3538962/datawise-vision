// Centralized chart palette + tooltip — mirrors src/styles.css tokens.
export const CHART = {
  c1: "oklch(0.5 0.16 255)",   // deep blue (primary)
  c2: "oklch(0.55 0.15 285)",  // indigo (accent)
  c3: "oklch(0.62 0.11 200)",  // teal
  c4: "oklch(0.65 0.13 165)",  // emerald
  c5: "oklch(0.7 0.12 230)",   // sky
  c6: "oklch(0.7 0.14 30)",    // warm coral (rare)
};

export const CHART_PALETTE = [CHART.c1, CHART.c2, CHART.c3, CHART.c4, CHART.c5, CHART.c6];

export const AXIS_TICK = { fontSize: 11, fill: "oklch(0.48 0.025 260)" };
export const GRID_STROKE = "oklch(0.9 0.01 255)";

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: "oklch(1 0 0)",
    border: "1px solid oklch(0.9 0.01 255)",
    borderRadius: 12,
    boxShadow: "0 8px 24px -12px oklch(0.22 0.04 260 / 0.18)",
    fontSize: 12,
    color: "oklch(0.22 0.04 260)",
  },
  labelStyle: { color: "oklch(0.3 0.04 260)", fontWeight: 500 },
};
