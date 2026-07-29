// Ziya — Embedding backfill scripti
// Event Memory'deki embedding'i eksik olaylar için OpenAI text-embedding-3-small
// ile vektör üretir ve `events.embedding` sütununu doldurur.
//
// Kullanım: npm run embeddings:backfill
// Gerekli ortam değişkenleri (.env.local): NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY

import { createClient } from "@supabase/supabase-js";

const EMBEDDING_MODEL = "text-embedding-3-small";

async function createEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY tanımlı değil (.env.local kontrol edin).");
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI embedding isteği başarısız (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
  return json.data[0].embedding;
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tanımlı değil (.env.local kontrol edin)."
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: events, error } = await supabase
    .from("events")
    .select("id, event_code, category, headline, summary")
    .is("embedding", null);

  if (error) {
    throw new Error(`Olaylar okunamadı: ${error.message}`);
  }

  if (!events || events.length === 0) {
    console.log("Embedding'i eksik olay yok.");
    return;
  }

  console.log(`${events.length} olay için embedding üretilecek...`);

  for (const event of events) {
    const input = [event.category, event.headline, event.summary].filter(Boolean).join("\n");
    const embedding = await createEmbedding(input);

    const { error: updateError } = await supabase
      .from("events")
      .update({ embedding: `[${embedding.join(",")}]` })
      .eq("id", event.id);

    if (updateError) {
      throw new Error(`${event.event_code} güncellenemedi: ${updateError.message}`);
    }

    console.log(`  ✓ ${event.event_code} — ${event.headline}`);
  }

  console.log(`Tamamlandı: ${events.length} olay için embedding üretildi.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
