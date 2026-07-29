import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { EventCard } from "@/components/EventCard";
import { getCurrentUser } from "@/lib/auth";
import { getEvents } from "@/lib/events";
import type { EventWithRelations } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const FEATURED_CODES = ["EVT-2026-0112-004731", "EVT-2026-0206-118842", "EVT-2026-0520-556213"];

const FEATURES = [
  {
    title: "Event Memory",
    description:
      "Her haber, o anki fiyat/hacim/volatilite bağlamıyla birlikte kalıcı olarak hafızaya kaydedilir — gelecekteki benzer olaylar için referans noktası olur.",
  },
  {
    title: "Rumor Engine",
    description:
      'Reddit, X ve forumlardan gelen doğrulanmamış iddiaları etiketler; kaynağın gerçek doğruluk geçmişini hesaplar. "Sallama" iddialar güven skoruyla açığa çıkar.',
  },
  {
    title: "Zincirleme Etki",
    description:
      "Bir olay yalnızca birincil şirketi değil; rakiplerini, tedarikçilerini ve sektör paydaşlarını nasıl etkiler — kategori bazlı istatistiklerle gösterir.",
  },
  {
    title: "Canlı Hesaplanan Tahmin",
    description:
      "Geçmişteki benzer olayların ortalama piyasa tepkisinden, güven skoru ve aralığıyla birlikte gerçek zamanlı tahmin üretir — yeterli veri yoksa dürüstçe söyler.",
  },
];

const STEPS = [
  { title: "Olay Algılanır", description: "Haber kaynağı güven skoruyla birlikte kaydedilir." },
  {
    title: "Bağlam Toplanır",
    description: "Olay öncesi/sonrası fiyat, hacim ve volatilite anlık toplanır.",
  },
  {
    title: "Geçmişle Karşılaştırılır",
    description: "Event Memory'deki benzer olaylar aranır, istatistikleri çıkarılır.",
  },
  {
    title: "Tahmin Yayınlanır",
    description: "Kısa/orta vadeli beklenti, güven skoru ve dayanak sayısıyla sunulur.",
  },
];

export default async function ShowcasePage() {
  const user = process.env.NEXT_PUBLIC_SUPABASE_URL ? await getCurrentUser() : null;
  if (user) {
    redirect("/dashboard");
  }

  let featuredEvents: EventWithRelations[] = [];
  try {
    const events = await getEvents(20);
    featuredEvents = FEATURED_CODES.map((code) => events.find((e) => e.event_code === code)).filter(
      (e): e is EventWithRelations => Boolean(e)
    );
  } catch {
    featuredEvents = [];
  }

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="flex justify-center">
            <LogoMark size={64} />
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Piyasa haberine{" "}
            <span className="bg-gradient-to-r from-brand to-info bg-clip-text text-transparent">
              ışık tutan
            </span>{" "}
            yapay zekâ ajanı
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Ziya, piyasaya düşen her haberi geçmişteki binlerce benzer olayla karşılaştırır,
            söylentiyi gerçekten ayırır ve olası fiyat etkisini güven skoruyla birlikte sunar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90"
            >
              Ücretsiz Kayıt Ol
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-surface-hover"
            >
              Olay Akışını İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Nasıl Çalışır</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                {i + 1}
              </div>
              <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-xs text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gerçek senaryo vitrini */}
      {featuredEvents.length > 0 && (
        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Gerçek Senaryolarla Çalışıyor
              </h2>
              <p className="mt-2 text-sm text-muted">
                Demo değil — bunlar canlı veritabanındaki gerçek olay kayıtları.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Özellik vitrini */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Sıradan Bir Haber Akışı Değil
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Paketler özeti */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Bireysel Yatırımcıdan Kurumsal Ekiplere
          </h2>
          <p className="mt-2 text-sm text-muted">
            Free ile başlayın, ihtiyacınız büyüdükçe Pro veya Kurumsal&apos;a geçin.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90"
          >
            Paketleri İncele
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Bugün başlayın</h2>
        <p className="mt-2 text-sm text-muted">
          Kredi kartı gerekmez. Bir dakikada hesap oluşturun, olay akışını hemen görün.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90"
        >
          Ücretsiz Kayıt Ol
        </Link>
      </section>
    </div>
  );
}
