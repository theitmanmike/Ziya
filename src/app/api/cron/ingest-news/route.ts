import { NextResponse, type NextRequest } from "next/server";
import { runFinnhubIngestion } from "@/lib/ingestion/runFinnhubIngestion";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Vercel Cron tarafından çağrılır (bkz. vercel.json "crons"). Vercel,
 * zamanlanmış isteklere otomatik olarak `Authorization: Bearer $CRON_SECRET`
 * ekler — bu header'ı doğrulayarak yalnızca Vercel'in tetikleyebilmesini
 * sağlıyoruz.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  try {
    const result = await runFinnhubIngestion("cron");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
