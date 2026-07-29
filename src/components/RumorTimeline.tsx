import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { RumorTracking } from "@/lib/supabase/types";

export function RumorTimeline({ entries }: { entries: RumorTracking[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
  );

  return (
    <ol className="space-y-4">
      {sorted.map((entry) => (
        <li key={entry.id} className="relative border-l-2 border-border pl-4">
          <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-brand" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={entry.stage} />
            <span className="text-xs text-muted">{formatDateTime(entry.updated_at)}</span>
            {entry.source_accuracy_score !== null && (
              <span className="text-xs text-muted">
                Kaynak doğruluk skoru: %{entry.source_accuracy_score}
              </span>
            )}
          </div>
          {entry.note && <p className="mt-1 text-sm">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}
