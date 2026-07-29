-- Ziya — Paketler (Pricing Tiers), admin panelinden yönetilebilir
-- Bkz: Proje Dosyası.md Bölüm 2.3, TODO.md Faz 7

create table if not exists pricing_tiers (
  id text primary key, -- 'free' | 'pro' | 'kurumsal'
  name text not null,
  audience text not null,
  price_label text not null,
  cta_label text not null,
  cta_href text not null default '/signup',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

comment on table pricing_tiers is '/pricing sayfasındaki paket kartları — admin panelinden (/admin/pricing) düzenlenir.';

create table if not exists pricing_tier_features (
  id uuid primary key default gen_random_uuid(),
  tier_id text not null references pricing_tiers(id) on delete cascade,
  feature text not null,
  sort_order integer not null default 0
);

alter table pricing_tiers enable row level security;
alter table pricing_tier_features enable row level security;

create policy "pricing_tiers_select_all" on pricing_tiers for select using (true);
create policy "pricing_tier_features_select_all" on pricing_tier_features for select using (true);

-- Not: Yazma politikası yok — diğer admin yazmaları gibi (bkz. rumor_tracking,
-- 0001'deki not) yalnızca service_role (admin server action'ları) üzerinden yazılır.

-- Mevcut /pricing sayfasındaki 3 paketin seed'i
insert into pricing_tiers (id, name, audience, price_label, cta_label, cta_href, sort_order) values
  ('free', 'Free', 'Bireysel yatırımcılar', '0 ₺ / ay', 'Ücretsiz Başla', '/signup', 1),
  ('pro', 'Pro', 'Portföy yöneticileri, fon ekipleri', 'Yakında', 'Yakında', '/pricing', 2),
  ('kurumsal', 'Kurumsal', 'Algoritmik trading ekipleri, finansal medya', 'Bize Ulaşın', 'Yakında', '/pricing', 3)
on conflict (id) do nothing;

insert into pricing_tier_features (tier_id, feature, sort_order) values
  ('free', 'Olay akışına tam erişim', 1),
  ('free', 'Piyasa bağlamı matrisi (fiyat/hacim/volatilite)', 2),
  ('free', 'Kayıtlı ilk tahminler', 3),
  ('pro', 'Free''deki her şey', 1),
  ('pro', 'Canlı hesaplanan tahminler (kategori eşleşmesi)', 2),
  ('pro', 'Zincirleme etki analizi (rakip/tedarikçi/sektör paydaşı)', 3),
  ('pro', 'Kaynak doğruluk geçmişi ve gürültü filtresi detayları', 4),
  ('kurumsal', 'Pro''daki her şey', 1),
  ('kurumsal', 'REST API erişimi', 2),
  ('kurumsal', 'Webhook desteği', 3),
  ('kurumsal', 'Öncelikli destek', 4);
