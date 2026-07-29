import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { fetchFinnhubCompanyNews } from "./finnhub";

const LOOKBACK_DAYS = 3;
const MAX_ARTICLES_PER_ASSET = 5;
const DEFAULT_NEW_SOURCE_TRUST_SCORE = 55;

export interface IngestionResult {
  articlesSeen: number;
  eventsCreated: number;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * `assets` tablosundaki her hisse için Finnhub'dan gerçek haber çeker,
 * yeni olayları `events` tablosuna yazar. Kurgusal tickerlar (XHOLD, NOVA)
 * için Finnhub boş sonuç döner — sessizce atlanır, hata değildir.
 *
 * Kategori/duygu sınıflandırması yapılmıyor (gerçek bir NLP hattı yok);
 * her olay `category: "Genel Haber"`, `sentiment_label: "notr"`,
 * `status: "unverified"` ile mühürlenir — dürüstçe "işlenmemiş ham veri"
 * olarak işaretlenir.
 */
export async function runFinnhubIngestion(trigger: "manual" | "cron"): Promise<IngestionResult> {
  const admin = createAdminClient();

  const { data: run, error: runError } = await admin
    .from("ingestion_runs")
    .insert({ connector: "finnhub", trigger, status: "running" })
    .select()
    .single();

  if (runError || !run) {
    throw new Error(`Ingestion run kaydı oluşturulamadı: ${runError?.message}`);
  }

  let articlesSeen = 0;
  let eventsCreated = 0;

  try {
    const { data: assets, error: assetsError } = await admin.from("assets").select("id, ticker");

    if (assetsError) {
      throw new Error(assetsError.message);
    }

    const toDate = new Date();
    const fromDate = new Date(toDate.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

    for (const asset of assets ?? []) {
      let articles;
      try {
        articles = await fetchFinnhubCompanyNews(
          asset.ticker,
          formatDate(fromDate),
          formatDate(toDate)
        );
      } catch {
        continue;
      }

      for (const article of articles.slice(0, MAX_ARTICLES_PER_ASSET)) {
        articlesSeen++;
        if (!article.headline || !article.url) continue;

        const sourceName = article.source || "Finnhub";
        let sourceId: string;

        const { data: existingSource } = await admin
          .from("sources")
          .select("id")
          .eq("name", sourceName)
          .maybeSingle();

        if (existingSource) {
          sourceId = existingSource.id;
        } else {
          const { data: newSource, error: sourceInsertError } = await admin
            .from("sources")
            .insert({
              name: sourceName,
              type: "otomatik_haber_akisi",
              trust_score: DEFAULT_NEW_SOURCE_TRUST_SCORE,
            })
            .select("id")
            .single();

          if (sourceInsertError || !newSource) continue;
          sourceId = newSource.id;
        }

        const { data: insertedEvent, error: eventError } = await admin
          .from("events")
          .insert({
            event_code: `EVT-FINNHUB-${article.id}`,
            occurred_at: new Date(article.datetime * 1000).toISOString(),
            source_id: sourceId,
            category: "Genel Haber",
            headline: article.headline.slice(0, 500),
            summary: article.summary ? article.summary.slice(0, 1000) : null,
            sentiment_label: "notr",
            status: "unverified",
            external_url: article.url,
          })
          .select("id")
          .maybeSingle();

        if (eventError || !insertedEvent) {
          // Muhtemelen external_url/event_code unique çakışması — bu makale
          // daha önce çekilmiş demektir, sessizce atla.
          continue;
        }

        await admin.from("event_assets").insert({
          event_id: insertedEvent.id,
          asset_id: asset.id,
          relation: "birincil",
        });

        eventsCreated++;
      }
    }

    await admin
      .from("ingestion_runs")
      .update({
        status: "success",
        finished_at: new Date().toISOString(),
        articles_seen: articlesSeen,
        events_created: eventsCreated,
      })
      .eq("id", run.id);

    return { articlesSeen, eventsCreated };
  } catch (err) {
    await admin
      .from("ingestion_runs")
      .update({
        status: "error",
        finished_at: new Date().toISOString(),
        articles_seen: articlesSeen,
        events_created: eventsCreated,
        error_message: err instanceof Error ? err.message : String(err),
      })
      .eq("id", run.id);

    throw err;
  }
}
