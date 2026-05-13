import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";
import { emptyStates, trainingQuips } from "@/lib/quips";

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
  const [quip, setQuip] = useState<string>("");
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
    const stages = [
      "Validating schema",
      "Encoding categoricals",
      "Scaling features",
      "Training 4 classifiers",
      "Training 4 regressors",
      "Computing metrics",
      "Saving artifacts",
    ];
    for (let i = 0; i < stages.length; i++) {
      setStage(stages[i]);
      setQuip(trainingQuips[i % trainingQuips.length]);
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
      <div className="surface p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Upload your dataset</h2>
        <p className="mt-1 text-sm text-muted-foreground">CSV must include the same 18 columns as the bundled e-commerce dataset.</p>

        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/40 p-10 text-center transition hover:border-primary hover:bg-primary/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Drop a CSV here or click to browse</p>
            <p className="text-xs text-muted-foreground">Max 50MB · 18 required columns</p>
          </div>
          <input type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>

        {!file && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-center text-sm">
            <p className="font-medium text-foreground">{emptyStates.upload.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{emptyStates.upload.body}</p>
          </div>
        )}

        {file && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · {headers?.length ?? 0} columns</p>
            </div>
            {valid ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Schema OK
              </span>
            ) : (
              <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Schema mismatch</span>
            )}
          </div>
        )}

        {file && !valid && headers && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs">
            <p className="font-medium text-destructive">Missing columns:</p>
            <p className="mt-1 text-muted-foreground">{REQUIRED.filter((c) => !headers.includes(c)).join(", ")}</p>
          </div>
        )}

        <button onClick={train} disabled={!valid || (progress > 0 && progress < 100)}
          className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-40">
          {progress > 0 && progress < 100 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Train all models
        </button>
      </div>

      {progress > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{stage}</span>
            <span className="font-mono text-muted-foreground">{progress.toFixed(0)}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gradient-primary" />
          </div>
          {quip && !done && (
            <p className="mt-3 text-xs italic text-muted-foreground">✦ {quip}</p>
          )}
          {done && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Models retrained successfully — head to Comparison to see new metrics.
            </div>
          )}
        </motion.div>
      )}

      <div className="surface p-6">
        <h3 className="mb-3 font-display text-[15px] font-semibold text-foreground">Required schema</h3>
        <div className="flex flex-wrap gap-1.5">
          {REQUIRED.map((c) => (
            <span key={c} className="rounded-md border border-border bg-secondary/50 px-2 py-1 font-mono text-[11px] text-foreground">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
