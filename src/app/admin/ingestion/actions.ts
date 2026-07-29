"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { runFinnhubIngestion } from "@/lib/ingestion/runFinnhubIngestion";

export async function triggerIngestion() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekir.");
  }

  await runFinnhubIngestion("manual");

  revalidatePath("/admin/ingestion");
  revalidatePath("/dashboard");
}
