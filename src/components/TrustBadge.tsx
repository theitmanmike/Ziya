import { Badge } from "@/components/Badge";

/** Kaynak güven hiyerarşisi: KAP/SEC=100, Bloomberg/Reuters=97-98, Doğrulanmış X=50-70, Reddit/Telegram=10-30 */
export function TrustBadge({ name, trustScore }: { name: string; trustScore: number }) {
  const tone = trustScore >= 90 ? "positive" : trustScore >= 50 ? "info" : "warning";
  return (
    <Badge tone={tone}>
      {name} · Güven {trustScore}/100
    </Badge>
  );
}
