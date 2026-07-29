import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Google gibi OAuth sağlayıcıları giriş sonrası buraya `?code=...` ile
 * yönlendirir (bkz. `AuthForm`'daki `signInWithOAuth` çağrısı). Kod, oturum
 * çerezlerine çevrilir ve kullanıcı hedef sayfaya yönlendirilir.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("OAuth code exchange failed:", error.status, error.message);
  } else {
    console.error("OAuth callback reached without a code param:", request.url);
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
