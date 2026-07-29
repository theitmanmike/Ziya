import { NextResponse, type NextRequest } from "next/server";
import { runAllIngestions } from "@/lib/ingestion/runAllIngestions";

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
    const results = await runAllIngestions("cron");
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
