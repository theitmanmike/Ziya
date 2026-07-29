/** Her bağlayıcının (Finnhub, GNews, ...) kendi API yanıtından ürettiği ortak makale şekli. */
export interface NormalizedArticle {
  /** Bağlayıcı içinde stabil ve tekil olmalı — event_code üretiminde kullanılır. */
  externalId: string;
  headline: string;
  summary: string | null;
  url: string;
  sourceName: string;
  /** ISO 8601 */
  occurredAt: string;
}

export interface IngestionResult {
  articlesSeen: number;
  eventsCreated: number;
}
