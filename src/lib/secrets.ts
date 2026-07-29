import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/** Bilinen API anahtarı adları — admin panelindeki ayarlar formuyla birebir eşleşir. */
export const API_CREDENTIAL_KEYS = [
  "OPENAI_API_KEY",
  "FINNHUB_API_KEY",
  "ALPHA_VANTAGE_API_KEY",
  "NEWSAPI_API_KEY",
  "GNEWS_API_KEY",
  "GUARDIAN_API_KEY",
  "MARKETAUX_API_TOKEN",
  "CURRENTS_API_KEY",
] as const;

export type ApiCredentialKey = (typeof API_CREDENTIAL_KEYS)[number];

function passphrase(): string {
  const value = process.env.SECRETS_ENCRYPTION_KEY;
  if (!value) {
    throw new Error("SECRETS_ENCRYPTION_KEY tanımlı değil.");
  }
  return value;
}

/** Admin panelinden girilen bir API anahtarını şifreli olarak kaydeder. */
export async function setApiCredential(
  key: ApiCredentialKey,
  value: string,
  updatedBy: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.rpc("set_api_credential", {
    p_key: key,
    p_value: value,
    p_passphrase: passphrase(),
    p_updated_by: updatedBy,
  });

  if (error) {
    throw new Error(`Anahtar kaydedilemedi: ${error.message}`);
  }
}

/** Veritabanında şifreli saklanan bir anahtarın çözülmüş değerini döner; yoksa null. */
export async function getApiCredential(key: ApiCredentialKey): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("get_api_credential", {
    p_key: key,
    p_passphrase: passphrase(),
  });

  if (error) {
    throw new Error(`Anahtar okunamadı: ${error.message}`);
  }

  return (data as string | null) ?? null;
}

/**
 * Bir API anahtarını çözer: önce admin panelinden kaydedilmiş veritabanı
 * değerine bakar, yoksa ortam değişkenine düşer. İngestion ve embedding gibi
 * tüm dış servis çağrıları bu fonksiyon üzerinden anahtar almalıdır.
 */
export async function resolveApiKey(key: ApiCredentialKey): Promise<string | null> {
  const stored = await getApiCredential(key);
  if (stored) return stored;
  return process.env[key] ?? null;
}

/** Hangi anahtarların veritabanında kayıtlı olduğunu (değerlerini açığa çıkarmadan) listeler. */
export async function listConfiguredCredentialKeys(): Promise<
  Record<ApiCredentialKey, { configuredInDb: boolean; updatedAt: string | null }>
> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("api_credentials").select("key, updated_at");

  if (error) {
    throw new Error(`Anahtar listesi okunamadı: ${error.message}`);
  }

  const byKey = new Map((data ?? []).map((row) => [row.key, row.updated_at as string]));

  return Object.fromEntries(
    API_CREDENTIAL_KEYS.map((key) => [
      key,
      { configuredInDb: byKey.has(key), updatedAt: byKey.get(key) ?? null },
    ])
  ) as Record<ApiCredentialKey, { configuredInDb: boolean; updatedAt: string | null }>;
}
