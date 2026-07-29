import "server-only";
import { resolveApiKey } from "@/lib/secrets";
import type { NormalizedArticle } from "./types";

interface CurrentsArticle {
  id: string;
  title: string;
  description: string | null;
  url: string;
  published: string; // "YYYY-MM-DD HH:mm:ss +0000"
}

/** Currents genel bir haber API'sidir — `query` olarak şirket adı verilmeli. */
export async function fetchCurrentsArticles(query: string): Promise<NormalizedArticle[]> {
  const apiKey = await resolveApiKey("CURRENTS_API_KEY");
  if (!apiKey) {
    throw new Error("CURRENTS_API_KEY tanımlı değil.");
  }

  const url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Currents isteği başarısız (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { news?: CurrentsArticle[] };

  return (json.news ?? []).slice(0, 5).map((article) => ({
    externalId: article.id,
    headline: article.title,
    summary: article.description,
    url: article.url,
    sourceName: "Currents",
    occurredAt: new Date(article.published).toISOString(),
  }));
}
