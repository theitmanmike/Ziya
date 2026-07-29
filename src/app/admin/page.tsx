import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS } from "@/lib/format";
import { addRumorStage } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-semibold">Yetkiniz yok</h1>
        <p className="mt-2 text-sm text-muted">Bu sayfa yalnızca admin kullanıcılar içindir.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, event_code, headline, status")
    .order("occurred_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Paneli</h1>
      <p className="mt-1 text-sm text-muted">Giriş: {user.email}</p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Söylenti Durumu Ekle</h2>
        <p className="mt-1 text-sm text-muted">
          Bir olaya yeni bir söylenti yaşam döngüsü aşaması (rumor_tracking) ekler.
        </p>

        <div className="mt-4 space-y-3">
          {(events ?? []).map((event) => (
            <details key={event.id} className="rounded-lg border border-border bg-surface p-4">
              <summary className="cursor-pointer text-sm font-medium">
                {event.headline}{" "}
                <span className="text-xs text-muted">
                  ({STATUS_LABELS[event.status] ?? event.status})
                </span>
              </summary>
              <form action={addRumorStage} className="mt-3 space-y-3">
                <input type="hidden" name="eventId" value={event.id} />
                <div>
                  <label className="block text-xs font-medium">Aşama</label>
                  <select
                    name="stage"
                    required
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="rumor">Söylenti</option>
                    <option value="unverified">Doğrulanmamış</option>
                    <option value="confirmed">Doğrulanmış</option>
                    <option value="false">Yanlış</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium">
                    Kaynak Doğruluk Skoru (opsiyonel, %)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="sourceAccuracyScore"
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium">Not</label>
                  <textarea
                    name="note"
                    rows={2}
                    className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground"
                >
                  Ekle
                </button>
              </form>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
