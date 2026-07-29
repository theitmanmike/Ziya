"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthNav({ email, isAdmin }: { email: string | null; isAdmin: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!email) {
    return (
      <Link href="/login" className="hover:text-foreground">
        Giriş Yap
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAdmin && (
        <Link href="/admin" className="hover:text-foreground">
          Admin
        </Link>
      )}
      <span className="hidden text-xs sm:inline">{email}</span>
      <button type="button" onClick={handleLogout} className="hover:text-foreground">
        Çıkış Yap
      </button>
    </div>
  );
}
