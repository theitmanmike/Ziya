import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server Component / Route Handler / Server Action içinden çağrılır.
 * Kullanıcı oturumuna bağlı, anon key ile çalışır — RLS aktiftir.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component içinden çağrıldığında cookie set edilemez;
            // oturum yenilemesi middleware/proxy katmanında ele alınır.
          }
        },
      },
    }
  );
}

/**
 * Yalnızca güvenilir sunucu tarafı işlemler için (seed, cron, webhook).
 * Service role key RLS'yi bypass eder — asla client koduna sızdırılmamalı.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
