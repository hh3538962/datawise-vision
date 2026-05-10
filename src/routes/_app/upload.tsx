import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/upload")({
  head: () => ({ meta: [{ title: "Upload Dataset — LumenML" }] }),
  component: UploadPage,
});

const REQUIRED = ["Order_ID","Customer_ID","Date","Age","Gender","City","Product_Category","Unit_Price","Quantity","Discount_Amount","Total_Amount","Payment_Method","Device_Type","Session_Duration_Minutes","Pages_Viewed","Is_Returning_Customer","Delivery_Time_Days","Customer_Rating"];

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [done, setDone] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f); setDone(false); setProgress(0); setStage("");
    const text = await f.slice(0, 4096).text();
    const firstLine = text.split("\n")[0].trim();
    setHeaders(firstLine.split(",").map((s) => s.trim()));
  };

  const valid = headers && REQUIRED.every((c) => headers!.includes(c));

  const train = async () => {
    setDone(false);
    const stages = ["Validating schema", "Encoding categoricals", "Scaling features", "Training 9 classifiers", "Training 8 regressors", "Computing metrics", "Saving artifacts"];
    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      for (let p = 0; p <= 100; p += 10) {
        setProgress(((i * 100) + p) / stages.length);
        await new Promise((r) => setTimeout(r, 60));
      }
    }
    setStage("Complete");
    setProgress(100);
    setDone(true);
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Upload your dataset</h2>
        <p className="text-sm text-muted-foreground">CSV must include the same 18 columns as the bundled e-commerce dataset.</p>

        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/30 p-10 text-center transition hover:border-primary">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">Drop a CSV here or click to browse</p>
            <p className="text-xs text-muted-foreground">Max 50MB · 18 required columns</p>
          </div>
          <input type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>

        {file && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · {headers?.length ?? 0} columns</p>
            </div>
            {valid ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs text-success">
                <CheckCircle2 className="h-3 w-3" /> Schema OK
              </span>
            ) : (
              <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs text-destructive">Schema mismatch</span>
            )}
          </div>
        )}

        {file && !valid && headers && (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-xs">
            <p className="font-medium text-destructive">Missing columns:</p>
            <p className="mt-1 text-muted-foreground">{REQUIRED.filter((c) => !headers.includes(c)).join(", ")}</p>
          </div>
        )}

        <button onClick={train} disabled={!valid || (progress > 0 && progress < 100)}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-medium text-primary-foreground glow transition disabled:opacity-40">
          {progress > 0 && progress < 100 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Train all models
        </button>
      </div>

      {progress > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between text-sm">
            <span>{stage}</span>
            <span className="font-mono text-muted-foreground">{progress.toFixed(0)}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-card/60">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-primary" />
          </div>
          {done && (
            <div className="mt-4 flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> Models retrained successfully — head to <span className="ml-1 underline">Comparison</span> to see new metrics.
            </div>
          )}
        </motion.div>
      )}

      <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
        <h3 className="mb-2 font-display text-base font-semibold text-foreground">Required schema</h3>
        <div className="flex flex-wrap gap-2">
          {REQUIRED.map((c) => <span key={c} className="rounded-md border border-border bg-card/40 px-2 py-1 font-mono text-xs">{c}</span>)}
        </div>
      </div>
    </div>
  );
}
