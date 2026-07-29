import "server-only";
import { fetchMarketauxArticles } from "./marketaux";
import { runIngestionConnector } from "./runIngestionConnector";
import type { IngestionResult } from "./types";

export async function runMarketauxIngestion(trigger: "manual" | "cron"): Promise<IngestionResult> {
  return runIngestionConnector("marketaux", trigger, (asset) =>
    fetchMarketauxArticles(asset.ticker)
  );
}
