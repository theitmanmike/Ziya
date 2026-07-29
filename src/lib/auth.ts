import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface CurrentUser {
  id: string;
  email: string;
  role: "member" | "admin";
  subscriptionTier: "free" | "pro" | "kurumsal";
}

/** Server Component'lerden çağrılır. Giriş yapılmamışsa null döner. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, subscription_tier")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: profile.role,
    subscriptionTier: profile.subscription_tier,
  };
}
