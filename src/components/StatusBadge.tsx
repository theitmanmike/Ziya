import { Badge } from "@/components/Badge";
import { STATUS_LABELS } from "@/lib/format";
import type { EventStatus } from "@/lib/supabase/types";

const STATUS_TONE: Record<EventStatus, "positive" | "negative" | "warning" | "info"> = {
  confirmed: "positive",
  false: "negative",
  rumor: "warning",
  unverified: "info",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>;
}
