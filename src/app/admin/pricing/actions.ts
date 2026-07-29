"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

export async function updatePricingTier(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekir.");
  }

  const id = formData.get("id");
  const name = formData.get("name");
  const audience = formData.get("audience");
  const priceLabel = formData.get("priceLabel");
  const ctaLabel = formData.get("ctaLabel");
  const ctaHref = formData.get("ctaHref");
  const isActive = formData.get("isActive") === "on";
  const featuresRaw = formData.get("features");

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof audience !== "string" ||
    typeof priceLabel !== "string" ||
    typeof ctaLabel !== "string" ||
    typeof ctaHref !== "string" ||
    typeof featuresRaw !== "string"
  ) {
    throw new Error("Geçersiz form verisi.");
  }

  const features = featuresRaw
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const admin = createAdminClient();

  const { error: tierError } = await admin
    .from("pricing_tiers")
    .update({
      name: name.trim(),
      audience: audience.trim(),
      price_label: priceLabel.trim(),
      cta_label: ctaLabel.trim(),
      cta_href: ctaHref.trim() || "/signup",
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (tierError) {
    throw new Error(`Paket güncellenemedi: ${tierError.message}`);
  }

  const { error: deleteError } = await admin
    .from("pricing_tier_features")
    .delete()
    .eq("tier_id", id);

  if (deleteError) {
    throw new Error(`Özellikler güncellenemedi: ${deleteError.message}`);
  }

  if (features.length > 0) {
    const { error: insertError } = await admin.from("pricing_tier_features").insert(
      features.map((feature, index) => ({
        tier_id: id,
        feature,
        sort_order: index,
      }))
    );

    if (insertError) {
      throw new Error(`Özellikler eklenemedi: ${insertError.message}`);
    }
  }

  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
}
