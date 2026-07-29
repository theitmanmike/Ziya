"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekir.");
  }
}

function parseTrustScore(raw: FormDataEntryValue | null): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error("Güven skoru 0-100 arasında bir sayı olmalıdır.");
  }
  return value;
}

export async function createSource(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name");
  const type = formData.get("type");
  const trustScore = parseTrustScore(formData.get("trustScore"));

  if (typeof name !== "string" || !name.trim() || typeof type !== "string" || !type.trim()) {
    throw new Error("Kaynak adı ve türü zorunludur.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("sources")
    .insert({ name: name.trim(), type: type.trim(), trust_score: trustScore });

  if (error) {
    throw new Error(`Kaynak eklenemedi: ${error.message}`);
  }

  revalidatePath("/admin/sources");
}

export async function updateSource(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const name = formData.get("name");
  const type = formData.get("type");
  const trustScore = parseTrustScore(formData.get("trustScore"));

  if (typeof id !== "string" || typeof name !== "string" || typeof type !== "string") {
    throw new Error("Geçersiz form verisi.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("sources")
    .update({ name: name.trim(), type: type.trim(), trust_score: trustScore })
    .eq("id", id);

  if (error) {
    throw new Error(`Kaynak güncellenemedi: ${error.message}`);
  }

  revalidatePath("/admin/sources");
}

export async function deleteSource(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("Geçersiz form verisi.");
  }

  const admin = createAdminClient();
  const { error } = await admin.from("sources").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Kaynak silinemedi: bu kaynağa bağlı olaylar var. Önce o olayları kaldırın. (${error.message})`
    );
  }

  revalidatePath("/admin/sources");
}
