import { formatPct, HORIZON_LABELS } from "@/lib/format";
import type { Prediction } from "@/lib/supabase/types";

export function PredictionSummary({ prediction }: { prediction: Prediction }) {
  return (
    <div className="rounded-lg border border-border bg-surface-hover px-3 py-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{HORIZON_LABELS[prediction.horizon] ?? prediction.horizon} Beklenti</span>
        <span>Güven %{prediction.confidence}</span>
      </div>
      <p className="mt-1 font-medium tabular-nums">
        {formatPct(prediction.expected_change_low)} / {formatPct(prediction.expected_change_high)}
      </p>
      <p className="mt-1 text-xs text-muted">
        Dayanak: {prediction.basis_event_count} benzer olay
      </p>
    </div>
  );
}
