import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { TrustBadge } from "@/components/TrustBadge";
import { ChangeValue } from "@/components/ChangeValue";
import { PredictionSummary } from "@/components/PredictionSummary";
import { formatDateTime } from "@/lib/format";
import type { EventWithRelations } from "@/lib/supabase/types";

export function EventCard({ event }: { event: EventWithRelations }) {
  const primaryAsset = event.assets.find((a) => a.relation === "birincil")?.asset ?? event.assets[0]?.asset;
  const latestContext = [...event.market_context]
    .filter((mc) => mc.asset_id === primaryAsset?.id)
    .sort((a, b) => a.offset_label.localeCompare(b.offset_label))
    .at(-1);
  const primaryPrediction = event.predictions.find((p) => p.asset_id === primaryAsset?.id) ?? event.predictions[0];

  return (
    <Link
      href={`/events/${event.event_code}`}
      className="block rounded-xl border border-border bg-surface p-4 transition hover:border-brand hover:shadow-sm sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={event.status} />
        <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
          {event.category}
        </span>
        {primaryAsset && (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs font-mono font-semibold">
            {primaryAsset.ticker}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug sm:text-lg">{event.headline}</h3>
      {event.summary && (
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{event.summary}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <TrustBadge name={event.source.name} trustScore={event.source.trust_score} />
        <span>{formatDateTime(event.occurred_at)}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        {latestContext ? (
          <div>
            <p className="text-xs text-muted">Şu ana kadarki tepki</p>
            <ChangeValue value={latestContext.change_pct} className="text-lg" />
          </div>
        ) : (
          <span />
        )}
        {primaryPrediction && <PredictionSummary prediction={primaryPrediction} />}
      </div>
    </Link>
  );
}
