import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  EventWithRelations,
  EventRow,
  Source,
  Asset,
  AssetRelation,
  MarketContext,
  Prediction,
  RumorTracking,
} from "@/lib/supabase/types";

type RawEventRow = EventRow & {
  source: Source;
  event_assets: Array<{ relation: AssetRelation; asset: Asset }>;
  market_context: Array<MarketContext & { asset: Asset }>;
  predictions: Array<Prediction & { asset: Asset }>;
  rumor_tracking: RumorTracking[];
};

const EVENT_SELECT = `
  *,
  source:sources(*),
  event_assets(relation, asset:assets(*)),
  market_context(*, asset:assets(*)),
  predictions(*, asset:assets(*)),
  rumor_tracking(*)
`;

function toEventWithRelations(row: RawEventRow): EventWithRelations {
  return {
    ...row,
    assets: row.event_assets.map((ea) => ({ asset: ea.asset, relation: ea.relation })),
  };
}

/** Dashboard olay akışı için, en yeni olaylar önce olacak şekilde listeler. */
export async function getEvents(limit = 20): Promise<EventWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .order("occurred_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Olaylar yüklenemedi: ${error.message}`);
  }

  return (data as unknown as RawEventRow[]).map(toEventWithRelations);
}

/** Olay detay sayfası için tekil kayıt getirir. */
export async function getEventByCode(eventCode: string): Promise<EventWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("event_code", eventCode)
    .maybeSingle();

  if (error) {
    throw new Error(`Olay yüklenemedi: ${error.message}`);
  }

  return data ? toEventWithRelations(data as unknown as RawEventRow) : null;
}
