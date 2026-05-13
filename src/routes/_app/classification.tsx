import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Loader2 } from "lucide-react";
import stats from "@/data/stats.json";
import { emptyStates } from "@/lib/quips";

export const Route = createFileRoute("/_app/classification")({
  head: () => ({ meta: [{ title: "Classification — LumenML" }] }),
  component: Classification,
});

const cities = Object.keys((stats as any).city);
const cats = Object.keys((stats as any).category);
const payments = Object.keys((stats as any).payment);
const devices = Object.keys((stats as any).device);

const initial = {
  age: 35, gender: "Male", city: cities[0], category: cats[0],
  unit_price: 250, quantity: 2, discount: 0,
  payment: payments[0], device: devices[0],
  session: 14, pages: 9, returning: "TRUE", delivery: 5,
};

function predictRating(f: typeof initial) {
  let s = 3.0;
  s += f.returning === "TRUE" ? 0.6 : -0.4;
  s += f.delivery <= 4 ? 0.5 : f.delivery >= 9 ? -0.5 : 0;
  s += f.discount > 0 ? 0.2 : 0;
  s += f.session > 14 ? 0.2 : -0.1;
  s += f.pages > 10 ? 0.1 : 0;
  s += (f.unit_price * f.quantity) > 1000 ? 0.2 : 0;
  s = Math.max(1, Math.min(5, s + (Math.random() - 0.5) * 0.4));
  const label = Math.round(s);
  const ps = [1, 2, 3, 4, 5].map((k) => Math.exp(-Math.abs(k - s) * 1.2));
  const total = ps.reduce((a, b) => a + b, 0);
  return { label, probs: ps.map((p) => p / total) };
}

function Classification() {
  const [f, setF] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [pred, setPred] = useState<{ label: number; probs: number[] } | null>(null);

  const run = () => {
    setLoading(true);
    setTimeout(() => { setPred(predictRating(f)); setLoading(false); }, 600);
  };

  const update = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Form */}
      <div className="surface p-6 lg:col-span-3">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Customer rating predictor</h2>
            <p className="text-xs text-muted-foreground">Predicts a 1–5★ rating from order + session features</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Age">
            <input type="number" value={f.age} onChange={(e) => update("age", +e.target.value)} className={inp} />
          </Field>
          <Select label="Gender" value={f.gender} onChange={(v) => update("gender", v)} options={["Male", "Female"]} />
          <Select label="City" value={f.city} onChange={(v) => update("city", v)} options={cities} />
          <Select label="Product category" value={f.category} onChange={(v) => update("category", v)} options={cats} />
          <Field label="Unit price ($)">
            <input type="number" value={f.unit_price} onChange={(e) => update("unit_price", +e.target.value)} className={inp} />
          </Field>
          <Field label="Quantity">
            <input type="number" value={f.quantity} onChange={(e) => update("quantity", +e.target.value)} className={inp} />
          </Field>
          <Field label="Discount amount ($)">
            <input type="number" value={f.discount} onChange={(e) => update("discount", +e.target.value)} className={inp} />
          </Field>
          <Select label="Payment method" value={f.payment} onChange={(v) => update("payment", v)} options={payments} />
          <Select label="Device" value={f.device} onChange={(v) => update("device", v)} options={devices} />
          <Field label="Session duration (min)">
            <input type="number" value={f.session} onChange={(e) => update("session", +e.target.value)} className={inp} />
          </Field>
          <Field label="Pages viewed">
            <input type="number" value={f.pages} onChange={(e) => update("pages", +e.target.value)} className={inp} />
          </Field>
          <Field label="Delivery time (days)">
            <input type="number" value={f.delivery} onChange={(e) => update("delivery", +e.target.value)} className={inp} />
          </Field>
          <Select label="Returning customer" value={f.returning} onChange={(v) => update("returning", v)} options={["TRUE", "FALSE"]} />
        </div>

        <button onClick={run} disabled={loading} className="btn-primary mt-6 disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Predict rating
        </button>
      </div>

      {/* Result */}
      <div className="lg:col-span-2 space-y-4">
        <motion.div
          key={pred?.label ?? "none"}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="surface relative overflow-hidden p-6"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Predicted rating</p>
          {pred ? (
            <>
              <p className="mt-3 font-display text-6xl font-semibold leading-none tracking-tight text-gradient">
                {pred.label}★
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Confidence {(pred.probs[pred.label - 1] * 100).toFixed(1)}%
              </p>
              <p className="mt-3 text-xs italic text-muted-foreground">
                ✦ {pred.label >= 4 ? "Customer is glowing." : pred.label === 3 ? "Mid energy detected." : "Risky vibes — consider intervention."}
              </p>
            </>
          ) : (
            <div className="mt-3">
              <p className="font-display text-2xl font-semibold text-foreground">{emptyStates.prediction.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{emptyStates.prediction.body}</p>
            </div>
          )}
        </motion.div>

        {pred && (
          <div className="surface p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Probability per class</p>
            <div className="mt-3 space-y-2.5">
              {pred.probs.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{i + 1}★</span>
                    <span className="font-mono text-muted-foreground">{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p * 100}%` }} transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pred && (
          <div className="surface p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Why this prediction?</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>• Returning customer → {f.returning === "TRUE" ? "+ boost" : "− slight drop"}</li>
              <li>• Delivery {f.delivery}d → {f.delivery <= 4 ? "+ very fast" : f.delivery >= 9 ? "− delayed" : "≈ normal"}</li>
              <li>• Discount applied → {f.discount > 0 ? "+ positive signal" : "neutral"}</li>
              <li>• Session {f.session}m / {f.pages} pages → engagement signal</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const inp = "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inp}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}
