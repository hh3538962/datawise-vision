import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from "recharts";
import { useState } from "react";
import models from "@/data/models.json";
import { Trophy, Crown } from "lucide-react";
import { CHART, CHART_PALETTE, AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from "@/lib/chart";

export const Route = createFileRoute("/_app/comparison")({
  head: () => ({ meta: [{ title: "Model Comparison — LumenML" }] }),
  component: Comparison,
});

function Comparison() {
  const [tab, setTab] = useState<"classification" | "regression">("classification");
  const clf = [...models.classification].sort((a, b) => b.f1 - a.f1);
  const reg = [...models.regression].sort((a, b) => b.r2 - a.r2);
  const list = tab === "classification" ? clf : reg;
  const best = list[0];
  const fi = tab === "classification" ? models.fi_classification : models.fi_regression;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
        {(["classification", "regression"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Best banner */}
      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Champion model</p>
              <p className="font-display text-2xl font-semibold tracking-tight text-foreground">{best.model}</p>
              <p className="text-sm text-muted-foreground">
                {tab === "classification"
                  ? `Best F1 (${(best as any).f1.toFixed(3)}) with ${(best as any).accuracy.toFixed(3)} accuracy.`
                  : `Highest R² (${(best as any).r2.toFixed(3)}) with RMSE ${(best as any).rmse.toFixed(2)}.`}
              </p>
              <p className="mt-1 text-xs italic text-muted-foreground">
                ✦ {tab === "classification" ? "Accuracy increased — dopamine activated." : "R² entered the chat."}
              </p>
            </div>
          </div>
          <div className="max-w-sm rounded-lg border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Why it wins</p>
            {tab === "classification"
              ? "Tree ensembles capture non-linear interactions between session, demographics, and pricing — outperforming the linear baseline."
              : "Boosting captures multiplicative pricing × quantity dynamics, lifting R² above linear methods."}
          </div>
        </div>
      </motion.div>

      {/* Bar chart */}
      <div className="surface p-5">
        <h3 className="font-display text-[15px] font-semibold text-foreground">
          {tab === "classification" ? "Accuracy & F1 by model" : "R² by model"}
        </h3>
        <p className="text-[11px] text-muted-foreground">Real metrics from the project notebook</p>
        <ResponsiveContainer width="100%" height={300}>
          {tab === "classification" ? (
            <BarChart data={list} margin={{ top: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="model" tick={AXIS_TICK} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={AXIS_TICK} domain={[0, 1]} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="accuracy" fill={CHART.c1} radius={[5, 5, 0, 0]} name="Accuracy" />
              <Bar dataKey="f1" fill={CHART.c2} radius={[5, 5, 0, 0]} name="F1" />
            </BarChart>
          ) : (
            <BarChart data={list} margin={{ top: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="model" tick={AXIS_TICK} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="r2" radius={[5, 5, 0, 0]} name="R²">
                {list.map((_, i) => <Cell key={i} fill={i === 0 ? CHART.c4 : CHART.c1} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="surface overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-[15px] font-semibold text-foreground">Leaderboard</h3>
          <p className="text-[11px] text-muted-foreground">Sorted by {tab === "classification" ? "F1" : "R²"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Model</th>
                {tab === "classification" ? (
                  <>
                    <th className="px-3 py-3 text-right">Accuracy</th>
                    <th className="px-3 py-3 text-right">Precision</th>
                    <th className="px-3 py-3 text-right">Recall</th>
                    <th className="px-3 py-3 text-right">F1</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-3 text-right">R²</th>
                    <th className="px-3 py-3 text-right">RMSE</th>
                    <th className="px-3 py-3 text-right">MAE</th>
                    <th className="px-3 py-3 text-right">MSE</th>
                  </>
                )}
                <th className="px-6 py-3 text-right">Time(s)</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m: any, i) => (
                <tr key={m.model} className="border-t border-border transition hover:bg-secondary/40">
                  <td className="px-6 py-3">
                    {i === 0 ? <Trophy className="h-4 w-4 text-warning" /> : <span className="text-muted-foreground">{i + 1}</span>}
                  </td>
                  <td className="px-6 py-3 font-medium text-foreground">{m.model}</td>
                  {tab === "classification" ? (
                    <>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.accuracy.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.precision.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.recall.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.f1.toFixed(3)}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.r2.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.rmse.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.mae.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono text-foreground">{m.mse.toFixed(0)}</td>
                    </>
                  )}
                  <td className="px-6 py-3 text-right text-muted-foreground">{m.time_s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature importance + radar */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h3 className="font-display text-[15px] font-semibold text-foreground">Top feature importance</h3>
          <p className="text-[11px] text-muted-foreground">Random Forest, {tab}</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={fi} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
              <XAxis type="number" tick={AXIS_TICK} />
              <YAxis type="category" dataKey="feature" tick={AXIS_TICK} width={140} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="importance" fill={CHART.c2} radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="surface p-5">
          <h3 className="font-display text-[15px] font-semibold text-foreground">Performance comparison</h3>
          <p className="text-[11px] text-muted-foreground">All models normalized</p>
          {tab === "classification" ? (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={["accuracy", "precision", "recall", "f1"].map((k) => {
                const obj: any = { metric: k };
                list.forEach((m: any) => { obj[m.model] = m[k]; });
                return obj;
              })}>
                <PolarGrid stroke={GRID_STROKE} />
                <PolarAngleAxis dataKey="metric" tick={AXIS_TICK} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "oklch(0.48 0.025 260)" }} />
                {list.map((m: any, i) => (
                  <Radar key={m.model} dataKey={m.model} stroke={CHART_PALETTE[i % CHART_PALETTE.length]} fill={CHART_PALETTE[i % CHART_PALETTE.length]} fillOpacity={0.12} />
                ))}
                <Tooltip {...TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={list}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="model" tick={AXIS_TICK} angle={-20} textAnchor="end" height={70} />
                <YAxis tick={AXIS_TICK} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="rmse" fill={CHART.c2} radius={[5, 5, 0, 0]} name="RMSE" />
                <Bar dataKey="mae" fill={CHART.c1} radius={[5, 5, 0, 0]} name="MAE" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Confusion matrix (classification only) */}
      {tab === "classification" && (
        <div className="surface p-6">
          <h3 className="font-display text-[15px] font-semibold text-foreground">Confusion matrix</h3>
          <p className="text-[11px] text-muted-foreground">Random Forest predictions on the 20% test set</p>
          <p className="mt-1 text-xs italic text-muted-foreground">✦ Confusion matrix looking emotionally confusing.</p>
          <div className="mt-4 inline-block">
            <table className="text-xs">
              <thead>
                <tr>
                  <th></th>
                  {models.cm_labels.map((l) => <th key={l} className="px-3 py-2 font-medium text-muted-foreground">Pred {l}</th>)}
                </tr>
              </thead>
              <tbody>
                {models.cm.map((row: number[], i: number) => {
                  const max = Math.max(...row);
                  return (
                    <tr key={i}>
                      <td className="pr-3 font-medium text-muted-foreground">Actual {models.cm_labels[i]}</td>
                      {row.map((v, j) => {
                        const intensity = 0.08 + (v / max) * 0.55;
                        const isDiag = i === j;
                        return (
                          <td key={j} className="p-1">
                            <div
                              className="flex h-12 w-16 items-center justify-center rounded-md font-mono text-foreground"
                              style={{
                                background: isDiag
                                  ? `oklch(0.65 0.13 165 / ${intensity})`
                                  : `oklch(0.5 0.16 255 / ${intensity})`,
                                border: "1px solid oklch(0.9 0.01 255)",
                              }}
                            >
                              {v}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
