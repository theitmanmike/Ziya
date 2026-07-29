import "server-only";
import { resolveApiKey } from "@/lib/secrets";
import type { NormalizedArticle } from "./types";

interface MarketauxArticle {
  uuid: string;
  title: string;
  description: string | null;
  url: string;
  published_at: string;
  source: string;
}

/**
 * Marketaux finans odaklı bir haber API'sidir, ticker sembolü ile arama
 * yapar — ücretsiz plan ayda 100 istekle sınırlıdır (bkz. TODO.md Faz 7.1),
 * bu yüzden günlük cron'da hızla tükenebilir.
 */
export async function fetchMarketauxArticles(ticker: string): Promise<NormalizedArticle[]> {
  const apiToken = await resolveApiKey("MARKETAUX_API_TOKEN");
  if (!apiToken) {
    throw new Error("MARKETAUX_API_TOKEN tanımlı değil.");
  }

  const url = `https://api.marketaux.com/v1/news/all?symbols=${encodeURIComponent(ticker)}&language=en&limit=5&api_token=${apiToken}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Marketaux isteği başarısız (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: MarketauxArticle[] };

  return (json.data ?? []).map((article) => ({
    externalId: article.uuid,
    headline: article.title,
    summary: article.description,
    url: article.url,
    sourceName: article.source || "Marketaux",
    occurredAt: article.published_at,
  }));
}
