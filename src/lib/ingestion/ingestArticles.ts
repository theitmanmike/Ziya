import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { IngestionResult, NormalizedArticle } from "./types";

const DEFAULT_NEW_SOURCE_TRUST_SCORE = 55;

/**
 * Normalize edilmiş makaleleri bir varlığa (asset) bağlı olay olarak yazar.
 * Dedup, `events.external_url` ve `events.event_code` unique kısıtlarına
 * dayanır — burada ayrıca kontrol edilmez, çakışan insert sessizce atlanır.
 */
export async function ingestArticlesForAsset(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: SupabaseClient<any, any, any>,
  connector: string,
  assetId: string,
  articles: NormalizedArticle[]
): Promise<IngestionResult> {
  let articlesSeen = 0;
  let eventsCreated = 0;

  for (const article of articles) {
    articlesSeen++;
    if (!article.headline || !article.url) continue;

    const sourceName = article.sourceName || connector;
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
        event_code: `EVT-${connector.toUpperCase()}-${article.externalId}`,
        occurred_at: article.occurredAt,
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
      // Muhtemelen external_url/event_code çakışması — bu makale daha önce
      // çekilmiş demektir (belki başka bir varlık için), sessizce atla.
      continue;
    }

    await admin.from("event_assets").insert({
      event_id: insertedEvent.id,
      asset_id: assetId,
      relation: "birincil",
    });

    eventsCreated++;
  }

  return { articlesSeen, eventsCreated };
}
