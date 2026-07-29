import "server-only";
import { fetchCurrentsArticles } from "./currents";
import { runIngestionConnector } from "./runIngestionConnector";
import type { IngestionResult } from "./types";

export async function runCurrentsIngestion(trigger: "manual" | "cron"): Promise<IngestionResult> {
  return runIngestionConnector("currents", trigger, (asset) => fetchCurrentsArticles(asset.name));
}
