import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MarketOffset, PredictionHorizon } from "@/lib/supabase/types";

const OFFSET_TO_HORIZON: Partial<Record<MarketOffset, PredictionHorizon>> = {
  "T0+24h": "24s",
  "T0+1w": "1h",
};

const MIN_SAMPLE_COUNT = 2;

export interface LivePrediction {
  offsetLabel: MarketOffset;
  horizon: PredictionHorizon;
  sampleCount: number;
  /** null when sampleCount < MIN_SAMPLE_COUNT — insufficient data, not a fabricated guess. */
  expectedChangeLow: number | null;
  expectedChangeHigh: number | null;
  confidence: number | null;
}

interface CategoryPredictionRow {
  avg_change: number | null;
  min_change: number | null;
  max_change: number | null;
  stddev_change: number | null;
  sample_count: number;
}

/**
 * Kategori eşleşmesine dayalı, veritabanından canlı hesaplanan tahmin.
 * Embedding henüz yok (Faz 5), bu yüzden "benzer olay" = aynı kategori.
 * Confidence ve aralık, örnek sayısı ve yayılıma (stddev) dayalı basit,
 * deterministik bir sezgisel formülle hesaplanır — bir ML modeli değildir.
 */
export async function computeLivePredictions(
  category: string,
  excludeEventId: string
): Promise<LivePrediction[]> {
  const supabase = await createClient();

  const results = await Promise.all(
    (Object.keys(OFFSET_TO_HORIZON) as MarketOffset[]).map(async (offsetLabel) => {
      const { data, error } = await supabase
        .rpc("compute_category_prediction", {
          p_category: category,
          p_offset_label: offsetLabel,
          p_exclude_event_id: excludeEventId,
        })
        .single<CategoryPredictionRow>();

      if (error) {
        throw new Error(`Tahmin hesaplanamadı (${offsetLabel}): ${error.message}`);
      }

      return toLivePrediction(offsetLabel, data);
    })
  );

  return results;
}

function toLivePrediction(offsetLabel: MarketOffset, row: CategoryPredictionRow): LivePrediction {
  const horizon = OFFSET_TO_HORIZON[offsetLabel]!;
  const sampleCount = row.sample_count ?? 0;

  if (sampleCount < MIN_SAMPLE_COUNT || row.avg_change === null) {
    return {
      offsetLabel,
      horizon,
      sampleCount,
      expectedChangeLow: null,
      expectedChangeHigh: null,
      confidence: null,
    };
  }

  const stddev = row.stddev_change ?? 0;
  const halfWidth = Math.max(stddev, 0.5);
  // Sezgisel: daha çok örnek → daha yüksek güven, daha yüksek yayılım → daha düşük güven.
  const confidence = Math.round(clamp(55 + sampleCount * 6 - stddev * 3, 30, 95));

  return {
    offsetLabel,
    horizon,
    sampleCount,
    expectedChangeLow: round3(row.avg_change - halfWidth),
    expectedChangeHigh: round3(row.avg_change + halfWidth),
    confidence,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}
