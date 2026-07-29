export function formatPct(value: number | null, opts: { withSign?: boolean } = {}): string {
  if (value === null || Number.isNaN(value)) return "—";
  const { withSign = true } = opts;
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatPrice(value: number, currency: string): string {
  return value.toLocaleString("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  });
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / (1000 * 60));
  if (Math.abs(diffMin) < 1) return "az önce";
  if (Math.abs(diffMin) < 60) return `${Math.abs(diffMin)} dk ${diffMin > 0 ? "önce" : "sonra"}`;
  const diffH = Math.round(diffMin / 60);
  if (Math.abs(diffH) < 24) return `${Math.abs(diffH)} sa ${diffH > 0 ? "önce" : "sonra"}`;
  const diffD = Math.round(diffH / 24);
  return `${Math.abs(diffD)} gün ${diffD > 0 ? "önce" : "sonra"}`;
}

export const HORIZON_LABELS: Record<string, string> = {
  "1s": "1 Saat",
  "24s": "24 Saat",
  "1h": "1 Hafta",
};

export const OFFSET_LABELS: Record<string, string> = {
  "T0-1h": "1 Saat Önce",
  T0: "Olay Anı",
  "T0+24h": "24 Saat Sonra",
  "T0+1w": "1 Hafta Sonra",
};

export const VOLUME_STATE_LABELS: Record<string, string> = {
  stabil: "Stabil",
  ani_hacim_artisi: "Ani Hacim Artışı",
  yuksek: "Yüksek Hacim",
  trend_olusumu: "Trend Oluşumu",
};

export const STATUS_LABELS: Record<string, string> = {
  rumor: "Söylenti",
  unverified: "Doğrulanmamış",
  confirmed: "Doğrulanmış",
  false: "Yanlış",
};

export const RELATION_LABELS: Record<string, string> = {
  birincil: "Birincil",
  rakip: "Rakip",
  tedarikci: "Tedarikçi",
  sektor_paydasi: "Sektör Paydaşı",
};
