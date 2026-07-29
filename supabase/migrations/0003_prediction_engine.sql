-- Ziya — Tahmin Motoru (Impact Engine, kural tabanlı MVP sürümü)
-- Bkz: Proje Dosyası.md Bölüm 6.1 ve 6.3
--
-- Embedding henüz üretilmediği için (Faz 5) benzer olay eşleştirmesi vektörel
-- değil, kategori eşleşmesiyle yapılır: "bu kategorideki geçmiş olaylarda
-- piyasa ortalama nasıl tepki verdi?" `match_events` (0002) devreye girdiğinde
-- bu fonksiyon, kategori filtresini vektörel benzerlik sırasıyla
-- değiştirecek şekilde genişletilebilir.

create or replace function compute_category_prediction(
  p_category text,
  p_offset_label text,
  p_exclude_event_id uuid default null
)
returns table (
  avg_change numeric,
  min_change numeric,
  max_change numeric,
  stddev_change numeric,
  sample_count integer
)
language sql
stable
as $$
  select
    avg(mc.change_pct)::numeric(7,3),
    min(mc.change_pct)::numeric(7,3),
    max(mc.change_pct)::numeric(7,3),
    coalesce(stddev_samp(mc.change_pct), 0)::numeric(7,3),
    count(*)::integer
  from market_context mc
  join event_assets ea
    on ea.event_id = mc.event_id
   and ea.asset_id = mc.asset_id
   and ea.relation = 'birincil'
  join events e on e.id = mc.event_id
  where e.category = p_category
    and mc.offset_label = p_offset_label
    and mc.change_pct is not null
    and (p_exclude_event_id is null or e.id <> p_exclude_event_id);
$$;

comment on function compute_category_prediction is
  'Aynı kategorideki geçmiş olayların birincil varlığındaki fiyat değişiminin '
  'istatistiklerini döndürür (avg/min/max/stddev/örnek sayısı). Kategori '
  'başına yeterli örnek yoksa sample_count 0 veya 1 döner — bu durumda '
  'çağıran kod "yeterli veri yok" göstermelidir, uydurma bir aralık değil.';
