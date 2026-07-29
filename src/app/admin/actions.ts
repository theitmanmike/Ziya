"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Bir olaya yeni bir söylenti yaşam döngüsü aşaması ekler.
 * Daha önce TODO.md'de "auth/admin yüzeyi gerektiriyor" diye ertelenen
 * `rumor_tracking` durum geçiş mekanizmasının ilk gerçek karşılığıdır.
 */
export async function addRumorStage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekir.");
  }

  const eventId = formData.get("eventId");
  const stage = formData.get("stage");
  const note = formData.get("note");
  const accuracyRaw = formData.get("sourceAccuracyScore");

  if (typeof eventId !== "string" || typeof stage !== "string") {
    throw new Error("Geçersiz form verisi.");
  }

  const admin = createAdminClient();
  const { error } = await admin.from("rumor_tracking").insert({
    event_id: eventId,
    stage,
    note: typeof note === "string" && note.trim() ? note.trim() : null,
    source_accuracy_score:
      typeof accuracyRaw === "string" && accuracyRaw.trim() ? Number(accuracyRaw) : null,
  });

  if (error) {
    throw new Error(`Söylenti aşaması eklenemedi: ${error.message}`);
  }

  revalidatePath("/admin");
}
