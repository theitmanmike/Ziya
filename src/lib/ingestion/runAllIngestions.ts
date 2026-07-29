import "server-only";
import { runFinnhubIngestion } from "./runFinnhubIngestion";
import { runGNewsIngestion } from "./runGNewsIngestion";
import { runGuardianIngestion } from "./runGuardianIngestion";
import { runMarketauxIngestion } from "./runMarketauxIngestion";
import { runCurrentsIngestion } from "./runCurrentsIngestion";
import type { IngestionResult } from "./types";

export interface ConnectorRunSummary extends IngestionResult {
  connector: string;
  error: string | null;
}

const CONNECTORS: Array<{
  name: string;
  run: (trigger: "manual" | "cron") => Promise<IngestionResult>;
}> = [
  { name: "finnhub", run: runFinnhubIngestion },
  { name: "gnews", run: runGNewsIngestion },
  { name: "guardian", run: runGuardianIngestion },
  { name: "marketaux", run: runMarketauxIngestion },
  { name: "currents", run: runCurrentsIngestion },
];

/**
 * Tüm haber kaynaklarını sırayla çalıştırır. Her bağlayıcı kendi
 * `ingestion_runs` kaydını tutar; biri hata verirse (kota, eksik anahtar,
 * ağ hatası) diğerlerini durdurmaz.
 */
export async function runAllIngestions(trigger: "manual" | "cron"): Promise<ConnectorRunSummary[]> {
  const results: ConnectorRunSummary[] = [];

  for (const connector of CONNECTORS) {
    try {
      const result = await connector.run(trigger);
      results.push({ connector: connector.name, ...result, error: null });
    } catch (err) {
      results.push({
        connector: connector.name,
        articlesSeen: 0,
        eventsCreated: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
