import { createClient } from "@/lib/supabase/server";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { createSource, deleteSource, updateSource } from "./actions";

export const dynamic = "force-dynamic";

const inputClass = "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm";

export default async function AdminSourcesPage() {
  const supabase = await createClient();
  const { data: sources } = await supabase
    .from("sources")
    .select("id, name, type, trust_score, created_at")
    .order("trust_score", { ascending: false });

  return (
    <div>
      <h2 className="text-lg font-semibold">Kaynaklar (Haber Kanalları)</h2>
      <p className="mt-1 text-sm text-muted">
        Her olayın kaynağı buradan seçilir. Güven skoru (0-100),{" "}
        <code>compute_source_accuracy</code> ve gürültü filtresinin doğrudan girdisidir.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold">Yeni Kaynak Ekle</h3>
        <form action={createSource} className="mt-3 grid gap-3 sm:grid-cols-4 sm:items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium">Ad</label>
            <input name="name" required className={`mt-1 ${inputClass}`} placeholder="Bloomberg" />
          </div>
          <div>
            <label className="block text-xs font-medium">Tür</label>
            <input name="type" required className={`mt-1 ${inputClass}`} placeholder="resmi" />
          </div>
          <div>
            <label className="block text-xs font-medium">Güven Skoru</label>
            <input
              name="trustScore"
              type="number"
              min={0}
              max={100}
              required
              className={`mt-1 ${inputClass}`}
              placeholder="97"
            />
          </div>
          <div className="sm:col-span-4">
            <button
              type="submit"
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {(sources ?? []).map((source) => (
          <form
            key={source.id}
            action={updateSource}
            className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-5 sm:items-end"
          >
            <input type="hidden" name="id" value={source.id} />
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted">Ad</label>
              <input
                name="name"
                defaultValue={source.name}
                required
                className={`mt-1 ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Tür</label>
              <input
                name="type"
                defaultValue={source.type}
                required
                className={`mt-1 ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Güven Skoru</label>
              <input
                name="trustScore"
                type="number"
                min={0}
                max={100}
                defaultValue={source.trust_score}
                required
                className={`mt-1 ${inputClass}`}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-hover"
              >
                Kaydet
              </button>
              <ConfirmSubmitButton
                formAction={deleteSource}
                message={`"${source.name}" kaynağını silmek istediğinize emin misiniz?`}
                className="rounded-md border border-negative px-3 py-1.5 text-xs font-medium text-negative hover:bg-negative-bg"
              >
                Sil
              </ConfirmSubmitButton>
            </div>
          </form>
        ))}
        {(sources ?? []).length === 0 && <p className="text-sm text-muted">Henüz kaynak yok.</p>}
      </div>
    </div>
  );
}
