import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { ingestArticlesForAsset } from "./ingestArticles";
import type { IngestionResult, NormalizedArticle } from "./types";

interface AssetRef {
  id: string;
  ticker: string;
  name: string;
}

/**
 * Tek bir bağlayıcı için ortak çalıştırma iskeleti: `ingestion_runs` kaydı açar,
 * her varlık için `fetchArticlesForAsset` ile makale çeker, yazar, sonucu loglar.
 * Bir varlığın çekimi başarısız olursa (kota, ağ hatası) o varlık atlanır,
 * çalıştırma bütün olarak başarısız sayılmaz.
 */
export async function runIngestionConnector(
  connector: string,
  trigger: "manual" | "cron",
  fetchArticlesForAsset: (asset: AssetRef) => Promise<NormalizedArticle[]>
): Promise<IngestionResult> {
  const admin = createAdminClient();

  const { data: run, error: runError } = await admin
    .from("ingestion_runs")
    .insert({ connector, trigger, status: "running" })
    .select()
    .single();

  if (runError || !run) {
    throw new Error(`Ingestion run kaydı oluşturulamadı (${connector}): ${runError?.message}`);
  }

  let articlesSeen = 0;
  let eventsCreated = 0;

  try {
    const { data: assets, error: assetsError } = await admin
      .from("assets")
      .select("id, ticker, name");

    if (assetsError) {
      throw new Error(assetsError.message);
    }

    for (const asset of assets ?? []) {
      let articles: NormalizedArticle[];
      try {
        articles = await fetchArticlesForAsset(asset);
      } catch {
        continue;
      }

      const result = await ingestArticlesForAsset(admin, connector, asset.id, articles);
      articlesSeen += result.articlesSeen;
      eventsCreated += result.eventsCreated;
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
