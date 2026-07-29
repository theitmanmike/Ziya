import "server-only";
import { resolveApiKey } from "@/lib/secrets";

export interface FinnhubArticle {
  category: string;
  datetime: number; // unix seconds
  headline: string;
  id: number;
  related: string;
  source: string;
  summary: string;
  url: string;
}

/** Bir hissenin son N günlük gerçek haber akışını Finnhub'dan çeker. */
export async function fetchFinnhubCompanyNews(
  ticker: string,
  fromDate: string,
  toDate: string
): Promise<FinnhubArticle[]> {
  const apiKey = await resolveApiKey("FINNHUB_API_KEY");
  if (!apiKey) {
    throw new Error("FINNHUB_API_KEY tanımlı değil.");
  }

  const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(ticker)}&from=${fromDate}&to=${toDate}&token=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Finnhub isteği başarısız (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as unknown;
  return Array.isArray(json) ? (json as FinnhubArticle[]) : [];
}
