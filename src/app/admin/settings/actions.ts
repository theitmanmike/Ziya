"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { setApiCredential, API_CREDENTIAL_KEYS, type ApiCredentialKey } from "@/lib/secrets";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekir.");
  }
  return user;
}

function isKnownKey(key: string): key is ApiCredentialKey {
  return (API_CREDENTIAL_KEYS as readonly string[]).includes(key);
}

export async function saveApiCredential(formData: FormData) {
  const user = await requireAdmin();

  const key = formData.get("key");
  const value = formData.get("value");

  if (typeof key !== "string" || !isKnownKey(key)) {
    throw new Error("Geçersiz anahtar adı.");
  }
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Boş değer kaydedilemez.");
  }

  await setApiCredential(key, value.trim(), user.id);

  revalidatePath("/admin/settings");
}
