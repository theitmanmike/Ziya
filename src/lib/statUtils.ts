import type { MarketOffset, PredictionHorizon } from "@/lib/supabase/types";

export const OFFSET_TO_HORIZON: Partial<Record<MarketOffset, PredictionHorizon>> = {
  "T0+24h": "24s",
  "T0+1w": "1h",
};

export const MIN_SAMPLE_COUNT = 2;

export interface LivePrediction {
  offsetLabel: MarketOffset;
  horizon: PredictionHorizon;
  sampleCount: number;
  /** null when sampleCount < MIN_SAMPLE_COUNT — insufficient data, not a fabricated guess. */
  expectedChangeLow: number | null;
  expectedChangeHigh: number | null;
  confidence: number | null;
}

export interface ChangeStatsRow {
  avg_change: number | null;
  min_change: number | null;
  max_change: number | null;
  stddev_change: number | null;
  sample_count: number;
}

/**
 * Örnek sayısı ve yayılıma (stddev) dayalı basit, deterministik bir
 * sezgisel formülle güven skoru ve aralık üretir — bir ML modeli değildir.
 * `compute_category_prediction` ve `compute_category_relation_prediction`
 * çıktıları için ortak dönüşüm.
 */
export function toLivePrediction(offsetLabel: MarketOffset, row: ChangeStatsRow): LivePrediction {
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

const NOISE_TRUST_THRESHOLD = 30;
const NOISE_ACCURACY_THRESHOLD = 50;

/**
 * Gürültü filtresi: düşük güven skorlu VE (doğruluk geçmişi zayıf ya da henüz
 * kanıtlanmamış) kaynaklardan gelen olayları işaretler. Kural tabanlı bir
 * sezgiseldir, ML modeli değildir — bkz. Proje Dosyası.md Bölüm 6.2.
 */
export function isNoiseFlagged(trustScore: number, accuracyPct: number | null): boolean {
  return (
    trustScore < NOISE_TRUST_THRESHOLD &&
    (accuracyPct === null || accuracyPct < NOISE_ACCURACY_THRESHOLD)
  );
}
