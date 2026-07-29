import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { updateMyProfile } from "./actions";

export const dynamic = "force-dynamic";

const TIER_LABELS: Record<string, string> = { free: "Free", pro: "Pro", kurumsal: "Kurumsal" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, created_at")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Hesabım</h1>

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">E-posta</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Paket</dt>
            <dd>
              <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground">
                {TIER_LABELS[user.subscriptionTier] ?? user.subscriptionTier}
              </span>
            </dd>
          </div>
          {profile?.created_at && (
            <div className="flex items-center justify-between">
              <dt className="text-muted">Üyelik Tarihi</dt>
              <dd>{formatDateTime(profile.created_at)}</dd>
            </div>
          )}
        </dl>
      </div>

      <form
        action={updateMyProfile}
        className="mt-6 rounded-xl border border-border bg-surface p-5"
      >
        <h2 className="text-sm font-semibold">Profil Bilgileri</h2>
        <div className="mt-3">
          <label className="block text-xs font-medium text-muted">Ad Soyad</label>
          <input
            name="fullName"
            defaultValue={profile?.full_name ?? ""}
            placeholder="Ad Soyad"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
        >
          Kaydet
        </button>
      </form>

      <p className="mt-6 text-xs text-muted">
        Paket seviyeniz veya hesap rolünüz burada değiştirilemez — ilgili taleplerinizi bize iletin.
      </p>
    </div>
  );
}
