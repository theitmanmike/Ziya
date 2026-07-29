import { formatPct } from "@/lib/format";

export function ChangeValue({ value, className = "" }: { value: number | null; className?: string }) {
  if (value === null) return <span className={`text-muted ${className}`}>—</span>;
  const tone = value > 0 ? "text-positive" : value < 0 ? "text-negative" : "text-muted";
  return <span className={`font-medium tabular-nums ${tone} ${className}`}>{formatPct(value)}</span>;
}
