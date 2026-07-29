import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { TrustBadge } from "@/components/TrustBadge";
import { PredictionSummary } from "@/components/PredictionSummary";
import { MarketContextTable } from "@/components/MarketContextTable";
import { RumorTimeline } from "@/components/RumorTimeline";
import { LivePredictionPanel } from "@/components/LivePredictionPanel";
import { formatDateTime, RELATION_LABELS } from "@/lib/format";
import { getEventByCode } from "@/lib/events";
import { computeLivePredictions } from "@/lib/predictions";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const event = await getEventByCode(code);

  if (!event) {
    notFound();
  }

  const assetIds = [...new Set(event.assets.map((a) => a.asset.id))];
  const livePredictions = await computeLivePredictions(event.category, event.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Olay Akışına Dön
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={event.status} />
        <span className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
          {event.category}
        </span>
      </div>

      <h1 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">{event.headline}</h1>
      {event.summary && <p className="mt-2 text-muted">{event.summary}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <TrustBadge name={event.source.name} trustScore={event.source.trust_score} />
        <span className="text-muted">{formatDateTime(event.occurred_at)}</span>
        <span className="font-mono text-xs text-muted">{event.event_code}</span>
      </div>

      {event.rumor_tracking.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Söylenti Yaşam Döngüsü</h2>
          <div className="mt-3">
            <RumorTimeline entries={event.rumor_tracking} />
          </div>
        </section>
      )}

      <section className="mt-8 space-y-8">
        {assetIds.map((assetId) => {
          const link = event.assets.find((a) => a.asset.id === assetId)!;
          const contextRows = event.market_context.filter((mc) => mc.asset_id === assetId);
          const predictions = event.predictions.filter((p) => p.asset_id === assetId);

          return (
            <div key={assetId} className="rounded-xl border border-border bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border px-2.5 py-1 font-mono text-sm font-semibold">
                    {link.asset.ticker}
                  </span>
                  <span className="text-sm text-muted">{link.asset.name}</span>
                </div>
                <span className="text-xs text-muted">
                  {RELATION_LABELS[link.relation] ?? link.relation}
                </span>
              </div>

              {contextRows.length > 0 && (
                <div className="mt-4">
                  <MarketContextTable rows={contextRows} currency={link.asset.currency} />
                </div>
              )}

              {predictions.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted">Kayıtlı İlk Tahmin</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {predictions.map((prediction) => (
                      <PredictionSummary key={prediction.id} prediction={prediction} />
                    ))}
                  </div>
                </div>
              )}

              {link.relation === "birincil" && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted">
                    Canlı Hesaplanan Tahmin (aynı kategorideki olayların ortalaması)
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {livePredictions.map((prediction) => (
                      <LivePredictionPanel key={prediction.horizon} prediction={prediction} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="mt-8 rounded-xl border border-dashed border-border p-4 text-sm text-muted">
        <p>
          <strong className="text-foreground">Benzer Olay Arama:</strong> Canlı hesaplanan tahminler
          şu an yalnızca <strong className="text-foreground">kategori eşleşmesine</strong> dayanıyor
          (bkz. <code>compute_category_prediction</code>,{" "}
          <code>supabase/migrations/0003_prediction_engine.sql</code>). Gerçek vektörel benzerlik
          araması, embedding üretimi Faz 5&apos;te bir embedding API&apos;siyle bağlandığında bunun
          yerini alacak (bkz. <code>match_events</code>,{" "}
          <code>supabase/migrations/0002_similarity_search.sql</code>).
        </p>
      </section>

      <p className="mt-6 text-xs text-muted">
        Bu sayfadaki tahminler geçmiş olayların istatistiksel analizine dayanır ve{" "}
        <strong className="text-foreground">yatırım tavsiyesi değildir</strong>.
      </p>
    </div>
  );
}
