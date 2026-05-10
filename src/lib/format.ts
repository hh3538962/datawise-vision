export const fmtNum = (n: number, d = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(n);
export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const fmtPct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;
