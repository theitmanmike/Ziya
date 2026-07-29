import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AssetRelation, MarketOffset } from "@/lib/supabase/types";
import {
  OFFSET_TO_HORIZON,
  toLivePrediction,
  type ChangeStatsRow,
  type LivePrediction,
} from "@/lib/statUtils";

/**
 * Zincirleme etki tahmini: aynı kategorideki geçmiş olaylarda, verilen
 * ilişki tipindeki (rakip/tedarikci/sektor_paydasi) varlıkların ortalama
 * nasıl tepki verdiğini hesaplar. `computeLivePredictions` ile aynı
 * istatistiksel yöntemi kullanır, yalnızca "birincil" yerine ilişki
 * tipine göre filtreler — bkz. Proje Dosyası.md Bölüm 4, Senaryo 5.
 */
export async function computeChainEffect(
  category: string,
  relation: AssetRelation,
  excludeEventId: string
): Promise<LivePrediction[]> {
  const supabase = await createClient();

  const results = await Promise.all(
    (Object.keys(OFFSET_TO_HORIZON) as MarketOffset[]).map(async (offsetLabel) => {
      const { data, error } = await supabase
        .rpc("compute_category_relation_prediction", {
          p_category: category,
          p_relation: relation,
          p_offset_label: offsetLabel,
          p_exclude_event_id: excludeEventId,
        })
        .single<ChangeStatsRow>();

      if (error) {
        throw new Error(`Zincirleme etki hesaplanamadı (${offsetLabel}): ${error.message}`);
      }

      return toLivePrediction(offsetLabel, data);
    })
  );

  return results;
}
