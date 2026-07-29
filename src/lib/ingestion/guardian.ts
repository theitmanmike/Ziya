import "server-only";
import { resolveApiKey } from "@/lib/secrets";
import type { NormalizedArticle } from "./types";

interface GuardianResult {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: { trailText?: string };
}

/** Guardian genel bir gazete API'sidir — `query` olarak şirket adı verilmeli. */
export async function fetchGuardianArticles(query: string): Promise<NormalizedArticle[]> {
  const apiKey = await resolveApiKey("GUARDIAN_API_KEY");
  if (!apiKey) {
    throw new Error("GUARDIAN_API_KEY tanımlı değil.");
  }

  const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&order-by=newest&page-size=5&show-fields=trailText&api-key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Guardian isteği başarısız (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { response?: { results?: GuardianResult[] } };

  return (json.response?.results ?? []).map((result) => ({
    externalId: result.id.replace(/\//g, "-"),
    headline: result.webTitle,
    summary: result.fields?.trailText ?? null,
    url: result.webUrl,
    sourceName: "The Guardian",
    occurredAt: result.webPublicationDate,
  }));
}
