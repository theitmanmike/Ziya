-- Ziya — Benzer Olay Arama (Similar Event Retrieval)
-- Bkz: Proje Dosyası.md Bölüm 6.3

-- Yaklaşık en yakın komşu (ANN) indeksi. Veri arttıkça (>1000 satır) yeniden
-- oluşturulması (REINDEX) önerilir; lists değeri satır sayısının karekökü
-- civarında ayarlanmalıdır (bkz. pgvector belgeleri).
create index if not exists idx_events_embedding
  on events using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Bir olayın embedding'ine göre en benzer geçmiş olayları döndürür.
-- Kendisini ve embedding'i null olan olayları hariç tutar.
create or replace function match_events(
  query_embedding vector(1536),
  match_count int default 10,
  exclude_event_id uuid default null
)
returns table (
  id uuid,
  event_code text,
  headline text,
  category text,
  occurred_at timestamptz,
  similarity float
)
language sql
stable
as $$
  select
    e.id,
    e.event_code,
    e.headline,
    e.category,
    e.occurred_at,
    1 - (e.embedding <=> query_embedding) as similarity
  from events e
  where e.embedding is not null
    and (exclude_event_id is null or e.id <> exclude_event_id)
  order by e.embedding <=> query_embedding
  limit match_count;
$$;

comment on function match_events is 'Vektör kosinüs benzerliğine göre en yakın geçmiş olayları döndürür. exclude_event_id, olayın kendisini sonuçlardan hariç tutmak için kullanılır.';
