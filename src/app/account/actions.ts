"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Kullanıcının kendi profilini güncellemesi. Yalnızca `full_name` yazılabilir —
 * `role`/`subscription_tier` kasıtlı olarak buradan değiştirilemez (yalnızca
 * admin, bkz. src/app/admin/customers/actions.ts).
 */
export async function updateMyProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Giriş yapmanız gerekir.");
  }

  const fullName = formData.get("fullName");
  if (typeof fullName !== "string") {
    throw new Error("Geçersiz form verisi.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ full_name: fullName.trim() || null })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Profil güncellenemedi: ${error.message}`);
  }

  revalidatePath("/account");
}
