import { formatPct, HORIZON_LABELS } from "@/lib/format";
import type { LivePrediction } from "@/lib/predictions";

export function LivePredictionPanel({ prediction }: { prediction: LivePrediction }) {
  const { horizon, sampleCount, expectedChangeLow, expectedChangeHigh, confidence } = prediction;

  if (confidence === null || expectedChangeLow === null || expectedChangeHigh === null) {
    return (
      <div className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted">
        <span className="font-medium text-foreground">
          {HORIZON_LABELS[horizon] ?? horizon} — Canlı Tahmin
        </span>
        <p className="mt-1">
          Bu kategoride Event Memory&apos;de yeterli benzer olay yok ({sampleCount} örnek) — tahmin
          üretilmedi.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface-hover px-3 py-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{HORIZON_LABELS[horizon] ?? horizon} — Canlı Tahmin (kategori eşleşmesi)</span>
        <span>Güven %{confidence}</span>
      </div>
      <p className="mt-1 font-medium tabular-nums">
        {formatPct(expectedChangeLow)} / {formatPct(expectedChangeHigh)}
      </p>
      <p className="mt-1 text-xs text-muted">Dayanak: {sampleCount} aynı kategorideki olay</p>
    </div>
  );
}
