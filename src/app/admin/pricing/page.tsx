import { createClient } from "@/lib/supabase/server";
import { updatePricingTier } from "./actions";
import type { PricingTierWithFeatures } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const inputClass = "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm";

export default async function AdminPricingPage() {
  const supabase = await createClient();
  const { data: tiers } = await supabase
    .from("pricing_tiers")
    .select("*, features:pricing_tier_features(*)")
    .order("sort_order");

  const sortedTiers = (tiers as unknown as PricingTierWithFeatures[] | null) ?? [];

  return (
    <div>
      <h2 className="text-lg font-semibold">Paketler</h2>
      <p className="mt-1 text-sm text-muted">
        <code>/pricing</code> sayfasındaki paket kartlarını buradan düzenleyin. Gerçek ödeme
        (Stripe) henüz bağlanmadı — bu yalnızca paket içeriğini yönetir.
      </p>

      <div className="mt-6 space-y-4">
        {sortedTiers.map((tier) => (
          <form
            key={tier.id}
            action={updatePricingTier}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <input type="hidden" name="id" value={tier.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted">Paket Adı</label>
                <input
                  name="name"
                  defaultValue={tier.name}
                  required
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">Hedef Kitle</label>
                <input
                  name="audience"
                  defaultValue={tier.audience}
                  required
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">Fiyat Etiketi</label>
                <input
                  name="priceLabel"
                  defaultValue={tier.price_label}
                  required
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">CTA Metni</label>
                <input
                  name="ctaLabel"
                  defaultValue={tier.cta_label}
                  required
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted">CTA Hedefi</label>
                <input
                  name="ctaHref"
                  defaultValue={tier.cta_href}
                  required
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div className="flex items-end gap-2">
                <input
                  id={`active-${tier.id}`}
                  type="checkbox"
                  name="isActive"
                  defaultChecked={tier.is_active}
                  className="h-4 w-4"
                />
                <label htmlFor={`active-${tier.id}`} className="text-sm">
                  Aktif (fiyatlandırma sayfasında görünsün)
                </label>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-muted">
                Özellikler (her satıra bir tane)
              </label>
              <textarea
                name="features"
                rows={4}
                defaultValue={tier.features
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((f) => f.feature)
                  .join("\n")}
                className={`mt-1 ${inputClass}`}
              />
            </div>
            <button
              type="submit"
              className="mt-3 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground"
            >
              Kaydet
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
