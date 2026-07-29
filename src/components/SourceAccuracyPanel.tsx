import { Badge } from "@/components/Badge";
import { isNoiseFlagged, type SourceAccuracy } from "@/lib/sources";

export function SourceAccuracyPanel({
  trustScore,
  accuracy,
}: {
  trustScore: number;
  accuracy: SourceAccuracy;
}) {
  const flagged = isNoiseFlagged(trustScore, accuracy.accuracyPct);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
      {accuracy.accuracyPct !== null ? (
        <span>
          Kaynak doğruluk geçmişi:{" "}
          <strong className="text-foreground">%{accuracy.accuracyPct}</strong> (
          {accuracy.confirmedCount}/{accuracy.resolvedCount} sonuçlanmış olay doğrulandı)
        </span>
      ) : (
        <span>
          Kaynak doğruluk geçmişi: yeterli veri yok ({accuracy.resolvedCount} sonuçlanmış olay — en
          az 3 gerekir)
        </span>
      )}
      {flagged && <Badge tone="warning">Yüksek Yanlış Olasılığı</Badge>}
    </div>
  );
}
