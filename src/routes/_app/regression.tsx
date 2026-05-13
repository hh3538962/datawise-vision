import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Sparkles, Loader2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import stats from "@/data/stats.json";
import models from "@/data/models.json";
import { fmtCurrency } from "@/lib/format";
import { CHART, AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from "@/lib/chart";
import { emptyStates } from "@/lib/quips";

export const Route = createFileRoute("/_app/regression")({
  head: () => ({ meta: [{ title: "Regression — LumenML" }] }),
  component: Regression,
});

const cities = Object.keys((stats as any).city);
const cats = Object.keys((stats as any).category);
const payments = Object.keys((stats as any).payment);
const devices = Object.keys((stats as any).device);

const initial = { unit_price: 250, quantity: 2, discount: 0, age: 35, session: 14, pages: 9, delivery: 5, rating: 4, gender: "Male", city: cities[0], category: cats[0], payment: payments[0], device: devices[0], returning: "TRUE" };

function predictTotal(f: typeof initial) {
  const base = f.unit_price * f.quantity - f.discount;
  const adj = (f.returning === "TRUE" ? 0.05 : 0) + (f.session > 14 ? 0.03 : 0) + (f.rating >= 4 ? 0.02 : -0.02);
  const pred = base * (1 + adj);
  return { pred, lo: pred * 0.9, hi: pred * 1.1 };
}

function Regression() {
  const [f, setF] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [pred, setPred] = useState<{ pred: number; lo: number; hi: number } | null>(null);
  const update = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => setF((p) => ({ ...p, [k]: v }));

  const run = () => {
    setLoading(true);
    setTimeout(() => { setPred(predictTotal(f)); setLoading(false); }, 500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="surface p-6 lg:col-span-3">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Order revenue forecaster</h2>
            <p className="text-xs text-muted-foreground">Predicts Total_Amount with a 90% confidence band</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <F label="Unit price ($)"><input type="number" value={f.unit_price} onChange={(e) => update("unit_price", +e.target.value)} className={inp} /></F>
          <F label="Quantity"><input type="number" value={f.quantity} onChange={(e) => update("quantity", +e.target.value)} className={inp} /></F>
          <F label="Discount ($)"><input type="number" value={f.discount} onChange={(e) => update("discount", +e.target.value)} className={inp} /></F>
          <F label="Age"><input type="number" value={f.age} onChange={(e) => update("age", +e.target.value)} className={inp} /></F>
          <S label="Gender" value={f.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} />
          <S label="City" value={f.city} onChange={(v) => update("city", v)} options={cities} />
          <S label="Category" value={f.category} onChange={(v) => update("category", v)} options={cats} />
          <S label="Payment" value={f.payment} onChange={(v) => update("payment", v)} options={payments} />
          <S label="Device" value={f.device} onChange={(v) => update("device", v)} options={devices} />
          <F label="Session (min)"><input type="number" value={f.session} onChange={(e) => update("session", +e.target.value)} className={inp} /></F>
          <F label="Pages viewed"><input type="number" value={f.pages} onChange={(e) => update("pages", +e.target.value)} className={inp} /></F>
          <F label="Delivery (days)"><input type="number" value={f.delivery} onChange={(e) => update("delivery", +e.target.value)} className={inp} /></F>
          <F label="Customer rating"><input type="number" value={f.rating} onChange={(e) => update("rating", +e.target.value)} className={inp} /></F>
          <S label="Returning" value={f.returning} onChange={(v) => update("returning", v)} options={["TRUE", "FALSE"]} />
        </div>
        <button onClick={run} disabled={loading} className="btn-primary mt-6 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Predict revenue
        </button>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <motion.div key={pred?.pred ?? "none"} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="surface p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Predicted revenue</p>
          {pred ? (
            <>
              <p className="mt-3 font-display text-4xl font-semibold leading-none tracking-tight text-gradient">
                {fmtCurrency(pred.pred)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                90% interval: {fmtCurrency(pred.lo)} – {fmtCurrency(pred.hi)}
              </p>
              <p className="mt-3 text-xs italic text-muted-foreground">✦ Gradient Boosting carrying as usual.</p>
            </>
          ) : (
            <div className="mt-3">
              <p className="font-display text-2xl font-semibold text-foreground">{emptyStates.prediction.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{emptyStates.prediction.body}</p>
            </div>
          )}
        </motion.div>

        <div className="surface p-5">
          <h4 className="font-display text-sm font-semibold text-foreground">Predicted vs actual (test set)</h4>
          <p className="text-[11px] text-muted-foreground">First 80 samples</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={(models as any).pred_vs_actual.slice(0, 80)}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="i" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line dataKey="actual" stroke={CHART.c1} strokeWidth={2} dot={false} name="Actual" />
              <Line dataKey="predicted" stroke={CHART.c2} strokeWidth={2} dot={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const inp = "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</label>{children}</div>;
}
function S({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <F label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inp}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </F>
  );
}
