import "server-only";
import { fetchGuardianArticles } from "./guardian";
import { runIngestionConnector } from "./runIngestionConnector";
import type { IngestionResult } from "./types";

export async function runGuardianIngestion(trigger: "manual" | "cron"): Promise<IngestionResult> {
  return runIngestionConnector("guardian", trigger, (asset) => fetchGuardianArticles(asset.name));
}
