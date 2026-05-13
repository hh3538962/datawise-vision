import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from "recharts";
import { useState } from "react";
import models from "@/data/models.json";
import { Trophy, Crown } from "lucide-react";

export const Route = createFileRoute("/_app/comparison")({
  head: () => ({ meta: [{ title: "Model Comparison — LumenML" }] }),
  component: Comparison,
});

const tooltip = { contentStyle: { background: "oklch(0.18 0.03 265)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 } };

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
      <div className="inline-flex rounded-full border border-border bg-card/50 p-1 backdrop-blur">
        {(["classification", "regression"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-5 py-1.5 text-sm capitalize transition ${tab === t ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Best banner */}
      <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass relative overflow-hidden rounded-2xl p-6">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary glow">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Champion model</p>
              <p className="font-display text-3xl font-semibold">{best.model}</p>
              <p className="text-sm text-muted-foreground">
                {tab === "classification"
                  ? `Best F1 score (${(best as any).f1.toFixed(3)}) with ${(best as any).accuracy.toFixed(3)} accuracy.`
                  : `Highest R² (${(best as any).r2.toFixed(3)}) with RMSE ${(best as any).rmse.toFixed(2)}.`}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Reasoning</p>
            <p className="max-w-sm">{tab === "classification"
              ? "Tree ensembles capture non-linear interactions between session, demographics and pricing — outperforming the linear baseline."
              : "Boosting captures multiplicative pricing/quantity dynamics, lifting R² over linear methods."}</p>
          </div>
        </div>
      </motion.div>

      {/* Bar chart */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-lg font-semibold">{tab === "classification" ? "Accuracy & F1 by model" : "R² by model"}</h3>
        <ResponsiveContainer width="100%" height={300}>
          {tab === "classification" ? (
            <BarChart data={list}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} domain={[0, 1]} />
              <Tooltip {...tooltip} />
              <Bar dataKey="accuracy" fill="oklch(0.78 0.18 200)" radius={[6, 6, 0, 0]} name="Accuracy" />
              <Bar dataKey="f1" fill="oklch(0.65 0.22 295)" radius={[6, 6, 0, 0]} name="F1" />
            </BarChart>
          ) : (
            <BarChart data={list}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
              <XAxis dataKey="model" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <Tooltip {...tooltip} />
              <Bar dataKey="r2" fill="oklch(0.78 0.18 200)" radius={[6, 6, 0, 0]} name="R²">
                {list.map((m: any, i) => <Cell key={i} fill={i === 0 ? "oklch(0.74 0.16 155)" : "oklch(0.78 0.18 200)"} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-border/60 px-6 py-4">
          <h3 className="font-display text-lg font-semibold">Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
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
                <tr key={m.model} className="border-t border-border/40 transition hover:bg-card/40">
                  <td className="px-6 py-3">
                    {i === 0 ? <Trophy className="h-4 w-4 text-warning" /> : <span className="text-muted-foreground">{i + 1}</span>}
                  </td>
                  <td className="px-6 py-3 font-medium">{m.model}</td>
                  {tab === "classification" ? (
                    <>
                      <td className="px-3 py-3 text-right font-mono">{m.accuracy.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono">{m.precision.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono">{m.recall.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono">{m.f1.toFixed(3)}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3 text-right font-mono">{m.r2.toFixed(3)}</td>
                      <td className="px-3 py-3 text-right font-mono">{m.rmse.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono">{m.mae.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono">{m.mse.toFixed(0)}</td>
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
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold">Top feature importance</h3>
          <p className="text-xs text-muted-foreground">Random Forest, {tab}</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={fi} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} width={130} />
              <Tooltip {...tooltip} />
              <Bar dataKey="importance" fill="oklch(0.65 0.22 295)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-lg font-semibold">Performance radar</h3>
          <p className="text-xs text-muted-foreground">Top 5 models normalized</p>
          {tab === "classification" ? (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={["accuracy", "precision", "recall", "f1"].map((k) => {
                const obj: any = { metric: k };
                list.slice(0, 5).forEach((m: any) => { obj[m.model] = m[k]; });
                return obj;
              })}>
                <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: "oklch(0.7 0.02 260)" }} />
                {list.slice(0, 5).map((m: any, i) => (
                  <Radar key={m.model} dataKey={m.model} stroke={`oklch(0.7 0.2 ${200 + i * 40})`} fill={`oklch(0.7 0.2 ${200 + i * 40})`} fillOpacity={0.15} />
                ))}
                <Tooltip {...tooltip} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={list}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="model" tick={{ fontSize: 10, fill: "oklch(0.7 0.02 260)" }} angle={-20} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.7 0.02 260)" }} />
                <Tooltip {...tooltip} />
                <Bar dataKey="rmse" fill="oklch(0.65 0.22 295)" radius={[6, 6, 0, 0]} name="RMSE" />
                <Bar dataKey="mae" fill="oklch(0.78 0.18 200)" radius={[6, 6, 0, 0]} name="MAE" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Confusion matrix (classification only) */}
      {tab === "classification" && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Confusion matrix</h3>
          <p className="text-xs text-muted-foreground">Random Forest predictions on the 20% test set</p>
          <div className="mt-4 inline-block">
            <table className="text-xs">
              <thead>
                <tr>
                  <th></th>
                  {models.cm_labels.map((l) => <th key={l} className="px-3 py-2 text-muted-foreground">Pred {l}</th>)}
                </tr>
              </thead>
              <tbody>
                {models.cm.map((row: number[], i: number) => {
                  const max = Math.max(...row);
                  return (
                    <tr key={i}>
                      <td className="pr-3 text-muted-foreground">Actual {models.cm_labels[i]}</td>
                      {row.map((v, j) => (
                        <td key={j} className="p-1">
                          <div className="flex h-12 w-16 items-center justify-center rounded font-mono"
                            style={{ background: `oklch(0.78 0.18 200 / ${0.1 + (v / max) * 0.7})` }}>
                            {v}
                          </div>
                        </td>
                      ))}
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
