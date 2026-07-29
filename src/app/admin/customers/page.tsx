import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { updateCustomer } from "./actions";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = { member: "Üye", admin: "Admin" };
const TIER_LABELS: Record<string, string> = { free: "Free", pro: "Pro", kurumsal: "Kurumsal" };

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, subscription_tier, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-lg font-semibold">Müşteriler</h2>
      <p className="mt-1 text-sm text-muted">
        Tüm kayıtlı kullanıcılar. Rol ve paket seviyesi yalnızca buradan değiştirilebilir —
        kullanıcılar kendi rollerini/paketlerini değiştiremez.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-hover text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">E-posta</th>
              <th className="px-3 py-2 font-medium">Kayıt Tarihi</th>
              <th className="px-3 py-2 font-medium">Rol</th>
              <th className="px-3 py-2 font-medium">Paket</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(customers ?? []).map((customer) => (
              <tr key={customer.id}>
                <td className="px-3 py-2">
                  <div className="font-medium">{customer.email}</div>
                  {customer.full_name && (
                    <div className="text-xs text-muted">{customer.full_name}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-muted">{formatDateTime(customer.created_at)}</td>
                <td colSpan={2} className="px-3 py-2">
                  <form
                    action={updateCustomer}
                    className="flex flex-wrap items-center gap-2"
                    id={`customer-form-${customer.id}`}
                  >
                    <input type="hidden" name="id" value={customer.id} />
                    <select
                      name="role"
                      defaultValue={customer.role}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <select
                      name="subscriptionTier"
                      defaultValue={customer.subscription_tier}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      {Object.entries(TIER_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-surface-hover"
                    >
                      Kaydet
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(customers ?? []).length === 0 && (
          <p className="p-4 text-sm text-muted">Henüz kayıtlı kullanıcı yok.</p>
        )}
      </div>
    </div>
  );
}
