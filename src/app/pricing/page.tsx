import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PricingTierWithFeatures } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: tiers } = await supabase
    .from("pricing_tiers")
    .select("*, features:pricing_tier_features(*)")
    .eq("is_active", true)
    .order("sort_order");

  const sortedTiers = (tiers as unknown as PricingTierWithFeatures[] | null) ?? [];

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
        {sortedTiers.map((tier) => {
          const isActionable = tier.cta_href !== "/pricing";
          return (
            <div
              key={tier.id}
              className="flex flex-col rounded-xl border border-border bg-surface p-5"
            >
              <h2 className="text-lg font-semibold">{tier.name}</h2>
              <p className="mt-1 text-xs text-muted">{tier.audience}</p>
              <p className="mt-4 text-2xl font-semibold tabular-nums">{tier.price_label}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {tier.features
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((feature) => (
                    <li key={feature.id} className="flex items-start gap-2">
                      <span className="mt-1 text-positive">✓</span>
                      <span>{feature.feature}</span>
                    </li>
                  ))}
              </ul>
              {isActionable ? (
                <Link
                  href={tier.cta_href}
                  className="mt-6 block rounded-lg bg-brand px-4 py-2 text-center text-sm font-medium text-brand-foreground hover:opacity-90"
                >
                  {tier.cta_label}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground opacity-40"
                >
                  {tier.cta_label}
                </button>
              )}
            </div>
          );
        })}
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
