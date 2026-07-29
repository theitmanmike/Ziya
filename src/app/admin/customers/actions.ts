"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProfileRole, SubscriptionTier } from "@/lib/supabase/types";

const ROLES: ProfileRole[] = ["member", "admin"];
const TIERS: SubscriptionTier[] = ["free", "pro", "kurumsal"];

export async function updateCustomer(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekir.");
  }

  const id = formData.get("id");
  const role = formData.get("role");
  const subscriptionTier = formData.get("subscriptionTier");

  if (typeof id !== "string") {
    throw new Error("Geçersiz form verisi.");
  }
  if (typeof role !== "string" || !ROLES.includes(role as ProfileRole)) {
    throw new Error("Geçersiz rol.");
  }
  if (
    typeof subscriptionTier !== "string" ||
    !TIERS.includes(subscriptionTier as SubscriptionTier)
  ) {
    throw new Error("Geçersiz paket seviyesi.");
  }

  if (id === currentUser.id && role !== "admin") {
    throw new Error("Kendi admin yetkinizi kaldıramazsınız.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role, subscription_tier: subscriptionTier })
    .eq("id", id);

  if (error) {
    throw new Error(`Müşteri güncellenemedi: ${error.message}`);
  }

  revalidatePath("/admin/customers");
}
