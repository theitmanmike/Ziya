// Ziya — Veritabanı tipleri
// supabase/migrations/0001_init_schema.sql ile birebir uyumlu olmalıdır.
// Gerçek Supabase projesine bağlandıktan sonra `supabase gen types typescript`
// ile otomatik üretime geçirilebilir.

export type SentimentLabel = "pozitif" | "negatif" | "notr";
export type EventStatus = "rumor" | "unverified" | "confirmed" | "false";
export type AssetRelation = "birincil" | "rakip" | "tedarikci" | "sektor_paydasi";
export type MarketOffset = "T0-1h" | "T0" | "T0+24h" | "T0+1w";
export type VolumeState = "stabil" | "ani_hacim_artisi" | "yuksek" | "trend_olusumu";
export type PredictionHorizon = "1s" | "24s" | "1h";
export type ProfileRole = "member" | "admin";
export type SubscriptionTier = "free" | "pro" | "kurumsal";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface Source {
  id: string;
  name: string;
  type: string;
  trust_score: number;
  created_at: string;
}

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  market: string;
  currency: string;
  created_at: string;
}

export interface EventRow {
  id: string;
  event_code: string;
  occurred_at: string;
  source_id: string;
  category: string;
  headline: string;
  summary: string | null;
  sentiment_label: SentimentLabel;
  sentiment_score: number | null;
  status: EventStatus;
  created_at: string;
}

export interface EventAsset {
  event_id: string;
  asset_id: string;
  relation: AssetRelation;
}

export interface MarketContext {
  id: string;
  event_id: string;
  asset_id: string;
  offset_label: MarketOffset;
  captured_at: string | null;
  price: number;
  change_pct: number | null;
  volume_state: VolumeState | null;
}

export interface Prediction {
  id: string;
  event_id: string;
  asset_id: string;
  horizon: PredictionHorizon;
  expected_change_low: number;
  expected_change_high: number;
  confidence: number;
  basis_event_count: number;
  method: string;
}

export interface Outcome {
  id: string;
  prediction_id: string;
  actual_change_pct: number | null;
  measured_at: string | null;
  absolute_error: number | null;
}

export interface RumorTracking {
  id: string;
  event_id: string;
  stage: EventStatus;
  source_accuracy_score: number | null;
  note: string | null;
  updated_at: string;
}

/** Dashboard/detay sayfalarında kullanılan, ilişkileri açılmış olay görünümü. */
export interface EventWithRelations extends EventRow {
  source: Source;
  assets: Array<{ asset: Asset; relation: AssetRelation }>;
  market_context: Array<MarketContext & { asset: Asset }>;
  predictions: Array<Prediction & { asset: Asset }>;
  rumor_tracking: RumorTracking[];
}
