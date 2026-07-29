-- Ziya — Kaynak Doğruluk Hesaplama (Rumor Engine)
-- Bkz: Proje Dosyası.md Bölüm 6.2
--
-- Bir kaynağın "Rumor Accuracy" skoru: o kaynaktan çıkan ve sonuçlanmış
-- (confirmed/false) olayların ne kadarının doğrulandığı. `rumor`/`unverified`
-- aşamasındaki olaylar henüz sonuçlanmadığı için sayıma dahil edilmez.

create or replace function compute_source_accuracy(p_source_id uuid)
returns table (
  confirmed_count integer,
  false_count integer,
  resolved_count integer,
  accuracy_pct numeric
)
language sql
stable
as $$
  select
    count(*) filter (where status = 'confirmed')::integer as confirmed_count,
    count(*) filter (where status = 'false')::integer as false_count,
    count(*) filter (where status in ('confirmed', 'false'))::integer as resolved_count,
    case
      when count(*) filter (where status in ('confirmed', 'false')) = 0 then null
      else round(
        100.0 * count(*) filter (where status = 'confirmed')
        / count(*) filter (where status in ('confirmed', 'false')),
        2
      )
    end as accuracy_pct
  from events
  where source_id = p_source_id;
$$;

comment on function compute_source_accuracy is
  'Bir kaynağın sonuçlanmış (confirmed/false) olaylarındaki doğruluk yüzdesini '
  'döndürür. resolved_count 0 ise accuracy_pct null döner — çağıran kod bunu '
  '"yeterli veri yok" olarak göstermelidir, %0 veya varsayılan bir değer değil.';
