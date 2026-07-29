import "server-only";
import { fetchFinnhubCompanyNews } from "./finnhub";
import { runIngestionConnector } from "./runIngestionConnector";
import type { IngestionResult } from "./types";

const LOOKBACK_DAYS = 3;
const MAX_ARTICLES_PER_ASSET = 5;

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * `assets` tablosundaki her hisse için Finnhub'dan gerçek haber çeker.
 * Kurgusal tickerlar (XHOLD, NOVA) için Finnhub boş sonuç döner — sessizce
 * atlanır, hata değildir.
 *
 * Kategori/duygu sınıflandırması yapılmıyor (gerçek bir NLP hattı yok);
 * her olay `category: "Genel Haber"`, `sentiment_label: "notr"`,
 * `status: "unverified"` ile mühürlenir — dürüstçe "işlenmemiş ham veri"
 * olarak işaretlenir.
 */
export async function runFinnhubIngestion(trigger: "manual" | "cron"): Promise<IngestionResult> {
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  return runIngestionConnector("finnhub", trigger, async (asset) => {
    const articles = await fetchFinnhubCompanyNews(
      asset.ticker,
      formatDate(fromDate),
      formatDate(toDate)
    );
    return articles.slice(0, MAX_ARTICLES_PER_ASSET);
  });
}
