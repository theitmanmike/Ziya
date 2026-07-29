import "server-only";
import { resolveApiKey } from "@/lib/secrets";
import type { NormalizedArticle } from "./types";

interface GNewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: { name: string; url: string };
}

/**
 * GNews'ün arama sözdizimi (`q`) noktalama işaretlerine (virgül, nokta, parantez)
 * sözdizimi hatasıyla tepki veriyor — "Tesla, Inc." gibi ham şirket adları
 * `syntax error` döndürür. Yalnızca harf/rakam/boşluk bırakılarak temizlenir.
 */
function toSearchQuery(companyName: string): string {
  return companyName
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * GNews şirket tickerlarını değil şirket adlarını arar (`query` olarak
 * `assets.name` verilmeli) — genel haber API'leri ticker sembollerini
 * doğal metinde nadiren geçirir.
 */
export async function fetchGNewsArticles(query: string): Promise<NormalizedArticle[]> {
  const apiKey = await resolveApiKey("GNEWS_API_KEY");
  if (!apiKey) {
    throw new Error("GNEWS_API_KEY tanımlı değil.");
  }

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(toSearchQuery(query))}&lang=en&max=5&apikey=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`GNews isteği başarısız (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { articles?: GNewsArticle[] };

  return (json.articles ?? []).map((article) => ({
    externalId: Buffer.from(article.url).toString("base64url").slice(0, 80),
    headline: article.title,
    summary: article.description,
    url: article.url,
    sourceName: article.source?.name || "GNews",
    occurredAt: article.publishedAt,
  }));
}
