import "server-only";
import { fetchGNewsArticles } from "./gnews";
import { runIngestionConnector } from "./runIngestionConnector";
import type { IngestionResult } from "./types";

export async function runGNewsIngestion(trigger: "manual" | "cron"): Promise<IngestionResult> {
  return runIngestionConnector("gnews", trigger, (asset) => fetchGNewsArticles(asset.name));
}
