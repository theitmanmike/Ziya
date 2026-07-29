import "server-only";
import { createClient } from "@/lib/supabase/server";

const MIN_RESOLVED_COUNT = 3;
const NOISE_TRUST_THRESHOLD = 30;
const NOISE_ACCURACY_THRESHOLD = 50;

export interface SourceAccuracy {
  confirmedCount: number;
  falseCount: number;
  resolvedCount: number;
  /** null when resolvedCount < MIN_RESOLVED_COUNT — insufficient data, not a guess. */
  accuracyPct: number | null;
}

interface SourceAccuracyRow {
  confirmed_count: number;
  false_count: number;
  resolved_count: number;
  accuracy_pct: number | null;
}

/** Bir kaynağın, sonuçlanmış geçmiş olaylarındaki gerçek (hesaplanmış) doğruluk oranı. */
export async function computeSourceAccuracy(sourceId: string): Promise<SourceAccuracy> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("compute_source_accuracy", { p_source_id: sourceId })
    .single<SourceAccuracyRow>();

  if (error) {
    throw new Error(`Kaynak doğruluğu hesaplanamadı: ${error.message}`);
  }

  const resolvedCount = data.resolved_count ?? 0;
  const sufficientData = resolvedCount >= MIN_RESOLVED_COUNT;

  return {
    confirmedCount: data.confirmed_count ?? 0,
    falseCount: data.false_count ?? 0,
    resolvedCount,
    accuracyPct: sufficientData ? data.accuracy_pct : null,
  };
}

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
