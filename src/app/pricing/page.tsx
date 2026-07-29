import Link from "next/link";

interface Tier {
  id: "free" | "pro" | "kurumsal";
  name: string;
  audience: string;
  price: string;
  features: string[];
  cta: string;
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    audience: "Bireysel yatırımcılar",
    price: "0 ₺ / ay",
    features: [
      "Olay akışına tam erişim",
      "Piyasa bağlamı matrisi (fiyat/hacim/volatilite)",
      "Kayıtlı ilk tahminler",
    ],
    cta: "Ücretsiz Başla",
  },
  {
    id: "pro",
    name: "Pro",
    audience: "Portföy yöneticileri, fon ekipleri",
    price: "Yakında",
    features: [
      "Free'deki her şey",
      "Canlı hesaplanan tahminler (kategori eşleşmesi)",
      "Zincirleme etki analizi (rakip/tedarikçi/sektör paydaşı)",
      "Kaynak doğruluk geçmişi ve gürültü filtresi detayları",
    ],
    cta: "Yakında",
  },
  {
    id: "kurumsal",
    name: "Kurumsal",
    audience: "Algoritmik trading ekipleri, finansal medya",
    price: "Bize Ulaşın",
    features: ["Pro'daki her şey", "REST API erişimi", "Webhook desteği", "Öncelikli destek"],
    cta: "Yakında",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Paketler</h1>
        <p className="mt-2 text-sm text-muted">
          Proje Dosyası&apos;ndaki hedef kitleye göre tasarlandı — bireysel yatırımcıdan kurumsal
          ekiplere.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col rounded-xl border border-border bg-surface p-5"
          >
            <h2 className="text-lg font-semibold">{tier.name}</h2>
            <p className="mt-1 text-xs text-muted">{tier.audience}</p>
            <p className="mt-4 text-2xl font-semibold tabular-nums">{tier.price}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 text-positive">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={tier.id !== "free"}
              className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {tier.id === "free" ? (
                <Link href="/signup" className="block">
                  {tier.cta}
                </Link>
              ) : (
                tier.cta
              )}
            </button>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted">
        Pro ve Kurumsal paketler için ödeme altyapısı (Stripe) henüz bağlanmadı — bu sayfa paket
        yapısını tanıtır, gerçek satın alma yakında aktif olacak. Paket seviyesi veritabanında (
        <code>profiles.subscription_tier</code>) modellenmiş durumda, ancak özelliklere erişim
        kısıtlaması (feature gating) henüz uygulanmadı.
      </p>
    </div>
  );
}
