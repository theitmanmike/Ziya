import { ChangeValue } from "@/components/ChangeValue";
import { formatPrice, OFFSET_LABELS, VOLUME_STATE_LABELS } from "@/lib/format";
import type { MarketContext } from "@/lib/supabase/types";

const OFFSET_ORDER = ["T0-1h", "T0", "T0+24h", "T0+1w"];

export function MarketContextTable({
  rows,
  currency,
}: {
  rows: MarketContext[];
  currency: string;
}) {
  const sorted = [...rows].sort(
    (a, b) => OFFSET_ORDER.indexOf(a.offset_label) - OFFSET_ORDER.indexOf(b.offset_label)
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead className="bg-surface-hover text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Zaman Dilimi</th>
            <th className="px-3 py-2 font-medium">Fiyat</th>
            <th className="px-3 py-2 font-medium">Değişim</th>
            <th className="px-3 py-2 font-medium">Piyasa Durumu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((row) => (
            <tr key={row.id}>
              <td className="px-3 py-2 font-medium">
                {OFFSET_LABELS[row.offset_label] ?? row.offset_label}
              </td>
              <td className="px-3 py-2 tabular-nums">{formatPrice(row.price, currency)}</td>
              <td className="px-3 py-2">
                <ChangeValue value={row.change_pct} />
              </td>
              <td className="px-3 py-2 text-muted">
                {row.volume_state
                  ? (VOLUME_STATE_LABELS[row.volume_state] ?? row.volume_state)
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
