-- Ziya — Zincirleme Etki Hesaplama (Chain Effect)
-- Bkz: Proje Dosyası.md Bölüm 4 (Senaryo 5) ve Bölüm 6.3
--
-- compute_category_prediction (0003) yalnızca 'birincil' varlığa bakar.
-- Bu fonksiyon aynı mantığı ilişki tipine (rakip/tedarikci/sektor_paydasi)
-- göre genelleştirir: "bu kategorideki olaylarda, [rakip/tedarikçi/sektör
-- paydaşı] konumundaki varlıklar ortalama nasıl tepki verdi?"

create or replace function compute_category_relation_prediction(
  p_category text,
  p_relation text,
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
   and ea.relation = p_relation
  join events e on e.id = mc.event_id
  where e.category = p_category
    and mc.offset_label = p_offset_label
    and mc.change_pct is not null
    and (p_exclude_event_id is null or e.id <> p_exclude_event_id);
$$;

comment on function compute_category_relation_prediction is
  'compute_category_prediction ile aynı istatistiği, sabit "birincil" yerine '
  'verilen ilişki tipi (rakip/tedarikci/sektor_paydasi) için hesaplar. '
  'Zincirleme etki tahmininin temelidir.';
