import { EventCard } from "@/components/EventCard";
import { getEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <SetupNeeded reason="env" />;
  }

  let events: Awaited<ReturnType<typeof getEvents>> = [];
  let loadError: string | null = null;
  try {
    events = await getEvents(20);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Bilinmeyen hata";
  }

  if (loadError) {
    return <SetupNeeded reason="db" detail={loadError} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Olay Akışı</h1>
        <p className="mt-1 text-sm text-muted">
          Piyasaya düşen her olay, geçmişteki benzerleriyle karşılaştırılarak burada listelenir.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          Henüz kayıtlı olay yok. <code className="text-foreground">supabase/seed.sql</code> dosyasını
          çalıştırarak demo verilerini yükleyebilirsiniz.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

function SetupNeeded({ reason, detail }: { reason: "env" | "db"; detail?: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-warning bg-warning-bg p-6">
        <h1 className="text-lg font-semibold text-warning">Kurulum tamamlanmadı</h1>
        {reason === "env" ? (
          <p className="mt-2 text-sm text-foreground">
            Supabase ortam değişkenleri (<code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) tanımlı değil. <code>.env.example</code>{" "}
            dosyasını <code>.env.local</code> olarak kopyalayıp Supabase Dashboard → Settings → API
            sayfasındaki bilgileri girin.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-foreground">
              Veritabanına bağlanılamadı veya şema henüz oluşturulmadı.{" "}
              <code>supabase/migrations/</code> altındaki SQL dosyalarını Supabase SQL Editor&apos;de
              sırayla çalıştırın, ardından <code>supabase/seed.sql</code> ile demo verilerini yükleyin.
            </p>
            {detail && (
              <p className="mt-3 rounded-md bg-surface px-3 py-2 font-mono text-xs text-muted">
                {detail}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
