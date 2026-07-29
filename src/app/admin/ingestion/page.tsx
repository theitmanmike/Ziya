import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/Badge";
import { formatDateTime } from "@/lib/format";
import { triggerIngestion } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "positive" | "negative" | "warning"> = {
  success: "positive",
  error: "negative",
  running: "warning",
};

const STATUS_LABEL: Record<string, string> = {
  success: "Başarılı",
  error: "Hata",
  running: "Çalışıyor",
};

export default async function AdminIngestionPage() {
  const supabase = await createClient();
  const { data: runs } = await supabase
    .from("ingestion_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(20);

  const { data: assets } = await supabase.from("assets").select("ticker").order("ticker");

  return (
    <div>
      <h2 className="text-lg font-semibold">Haber Çekme (Ingestion)</h2>
      <p className="mt-1 text-sm text-muted">
        5 bağlayıcıdan (Finnhub, GNews, The Guardian, Marketaux, Currents) izlenen hisseler için
        gerçek haber çeker. Her bağlayıcı kendi çalıştırma kaydını tutar — biri hata verirse (eksik
        anahtar, kota) diğerleri etkilenmez. Kategori/duygu sınıflandırması yapılmaz — her yeni olay{" "}
        <code>Genel Haber</code> kategorisi ve <code>Doğrulanmamış</code> durumuyla eklenir; kaynak,
        makalenin kendi kaynağıdır (yoksa otomatik oluşturulur, güven skoru 55 ile başlar —
        Kaynaklar sayfasından ayarlayabilirsiniz). API anahtarları{" "}
        <a href="/admin/settings" className="text-brand hover:underline">
          Ayarlar
        </a>{" "}
        sayfasından yönetilir.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>İzlenen hisseler:</span>
        {(assets ?? []).map((a) => (
          <span key={a.ticker} className="rounded-full border border-border px-2 py-0.5 font-mono">
            {a.ticker}
          </span>
        ))}
      </div>

      <form action={triggerIngestion} className="mt-4">
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
        >
          Şimdi Çek
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-hover text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Başladı</th>
              <th className="px-3 py-2 font-medium">Kaynak</th>
              <th className="px-3 py-2 font-medium">Tetikleyici</th>
              <th className="px-3 py-2 font-medium">Durum</th>
              <th className="px-3 py-2 font-medium">Görülen / Oluşturulan</th>
              <th className="px-3 py-2 font-medium">Hata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(runs ?? []).map((run) => (
              <tr key={run.id}>
                <td className="px-3 py-2">{formatDateTime(run.started_at)}</td>
                <td className="px-3 py-2 font-mono text-xs">{run.connector}</td>
                <td className="px-3 py-2 text-muted">
                  {run.trigger === "manual" ? "Manuel" : "Zamanlanmış"}
                </td>
                <td className="px-3 py-2">
                  <Badge tone={STATUS_TONE[run.status] ?? "warning"}>
                    {STATUS_LABEL[run.status] ?? run.status}
                  </Badge>
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {run.articles_seen} / {run.events_created}
                </td>
                <td className="px-3 py-2 text-xs text-negative">{run.error_message ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(runs ?? []).length === 0 && (
          <p className="p-4 text-sm text-muted">Henüz bir çalıştırma yok.</p>
        )}
      </div>
    </div>
  );
}
