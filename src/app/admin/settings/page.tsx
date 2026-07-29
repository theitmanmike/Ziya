import { Badge } from "@/components/Badge";
import { listConfiguredCredentialKeys, type ApiCredentialKey } from "@/lib/secrets";
import { saveApiCredential } from "./actions";

export const dynamic = "force-dynamic";

const CREDENTIAL_META: Record<ApiCredentialKey, { label: string; usedFor: string }> = {
  OPENAI_API_KEY: {
    label: "OpenAI",
    usedFor: "Embedding üretimi — benzer olay araması (match_events)",
  },
  FINNHUB_API_KEY: {
    label: "Finnhub",
    usedFor: "Piyasa verisi ve şirket haberleri (haber çekme motoru)",
  },
  ALPHA_VANTAGE_API_KEY: {
    label: "Alpha Vantage",
    usedFor: "Yedek piyasa verisi",
  },
  NEWSAPI_API_KEY: {
    label: "NewsAPI",
    usedFor: "Genel haber akışı",
  },
  GNEWS_API_KEY: {
    label: "GNews",
    usedFor: "Genel haber akışı",
  },
  GUARDIAN_API_KEY: {
    label: "The Guardian",
    usedFor: "Genel haber akışı",
  },
  MARKETAUX_API_TOKEN: {
    label: "Marketaux",
    usedFor: "Finans odaklı haber akışı",
  },
  CURRENTS_API_KEY: {
    label: "Currents",
    usedFor: "Genel haber akışı",
  },
};

export default async function AdminSettingsPage() {
  const configured = await listConfiguredCredentialKeys();

  return (
    <div>
      <h2 className="text-lg font-semibold">Ayarlar — API Anahtarları</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Buradan kaydedilen anahtarlar veritabanında şifreli olarak saklanır (pgcrypto) ve ortam
        değişkenlerinin önüne geçer. Güvenlik nedeniyle kaydedilmiş bir değer buradan tekrar
        görüntülenemez — yalnızca yeni bir değer girip üzerine yazabilirsiniz. Alan boş bırakılırsa
        sistem, tanımlıysa <code>.env</code> değerini kullanmaya devam eder.
      </p>

      <div className="mt-6 space-y-3">
        {(Object.keys(CREDENTIAL_META) as ApiCredentialKey[]).map((key) => {
          const meta = CREDENTIAL_META[key];
          const dbStatus = configured[key];
          const envConfigured = Boolean(process.env[key]);

          return (
            <form
              key={key}
              action={saveApiCredential}
              className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-5 sm:items-end"
            >
              <input type="hidden" name="key" value={key} />
              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{meta.label}</span>
                  {dbStatus.configuredInDb ? (
                    <Badge tone="positive">Veritabanında kayıtlı</Badge>
                  ) : envConfigured ? (
                    <Badge tone="info">.env üzerinden aktif</Badge>
                  ) : (
                    <Badge tone="neutral">Tanımlı değil</Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted">{meta.usedFor}</p>
                {dbStatus.updatedAt && (
                  <p className="mt-1 text-xs text-muted">
                    Son güncelleme: {new Date(dbStatus.updatedAt).toLocaleString("tr-TR")}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted" htmlFor={`${key}-value`}>
                  Yeni değer
                </label>
                <input
                  id={`${key}-value`}
                  name="value"
                  type="password"
                  autoComplete="off"
                  placeholder="••••••••••••••••"
                  className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground sm:w-auto"
                >
                  Kaydet
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
