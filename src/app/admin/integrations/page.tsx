import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

const INTEGRATIONS = [
  {
    name: "OpenAI (embedding)",
    envVar: "OPENAI_API_KEY",
    usedFor: "match_events benzer olay araması (Faz 5)",
  },
  {
    name: "Finnhub",
    envVar: "FINNHUB_API_KEY",
    usedFor: "Piyasa verisi + haber (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
  {
    name: "Alpha Vantage",
    envVar: "ALPHA_VANTAGE_API_KEY",
    usedFor: "Yedek piyasa verisi (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
  {
    name: "NewsAPI",
    envVar: "NEWSAPI_API_KEY",
    usedFor: "Haber akışı (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
  {
    name: "GNews",
    envVar: "GNEWS_API_KEY",
    usedFor: "Haber akışı (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
  {
    name: "The Guardian",
    envVar: "GUARDIAN_API_KEY",
    usedFor: "Haber akışı (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
  {
    name: "Marketaux",
    envVar: "MARKETAUX_API_TOKEN",
    usedFor: "Finans odaklı haber (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
  {
    name: "Currents",
    envVar: "CURRENTS_API_KEY",
    usedFor: "Haber akışı (Faz 5, entegrasyon kodu henüz yazılmadı)",
  },
];

export default function AdminIntegrationsPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold">Entegrasyon Durumu</h2>
      <p className="mt-1 text-sm text-muted">
        Salt okunur — hangi API anahtarlarının ortamda tanımlı olduğunu gösterir. Anahtarların
        kendisini değiştirmek için <code>.env.local</code> ve Vercel ortam değişkenlerini
        güncelleyin; güvenlik nedeniyle anahtarlar burada görüntülenmez veya düzenlenmez.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-surface-hover text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Servis</th>
              <th className="px-3 py-2 font-medium">Durum</th>
              <th className="px-3 py-2 font-medium">Kullanım Alanı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {INTEGRATIONS.map((integration) => {
              const configured = Boolean(process.env[integration.envVar]);
              return (
                <tr key={integration.envVar}>
                  <td className="px-3 py-2 font-medium">{integration.name}</td>
                  <td className="px-3 py-2">
                    <Badge tone={configured ? "positive" : "neutral"}>
                      {configured ? "Yapılandırılmış" : "Tanımlı Değil"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-muted">{integration.usedFor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
