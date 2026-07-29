-- Ziya — Başlangıç Şeması
-- Olay Odaklı Hisse Senedi Etki Tahmin Ajanı
-- Bkz: Proje Dosyası.md Bölüm 5 (Veri Modeli) ve Bölüm 8 (Sistem Mimarisi)

create extension if not exists pgcrypto;
create extension if not exists vector;

-- ============================================================
-- SOURCES — Haber/veri kaynakları ve güven hiyerarşisi
-- ============================================================
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null, -- 'KAP', 'SEC', 'Bloomberg', 'Reuters', 'X (Doğrulanmış)', 'Reddit', vb.
  trust_score smallint not null check (trust_score between 0 and 100),
  created_at timestamptz not null default now()
);

comment on table sources is 'Kaynak güven hiyerarşisi: KAP/SEC=100, Bloomberg/Reuters=97-98, Doğrulanmış X=50-70, Reddit/Telegram=10-30';

-- ============================================================
-- ASSETS — Hisse senedi / varlık evreni
-- ============================================================
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  ticker text not null unique,
  name text not null,
  market text not null, -- 'NASDAQ', 'NYSE', 'BIST', vb.
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

-- ============================================================
-- EVENTS — Olay Kaydı (Event Object)
-- ============================================================
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_code text not null unique, -- örn. 'EVT-2026-0112-004731'
  occurred_at timestamptz not null,
  source_id uuid not null references sources(id),
  category text not null, -- 'Kapasite Yatırımı', 'Temettü', 'CEO Değişimi', 'Dava', 'Regülasyon', vb.
  headline text not null,
  summary text,
  sentiment_label text not null check (sentiment_label in ('pozitif', 'negatif', 'notr')),
  sentiment_score numeric(4,3), -- -1.000 ile 1.000 arası
  status text not null default 'confirmed' check (status in ('rumor', 'unverified', 'confirmed', 'false')),
  embedding vector(1536), -- benzer olay araması için (OpenAI text-embedding-3-small boyutu)
  created_at timestamptz not null default now()
);

create index if not exists idx_events_occurred_at on events (occurred_at desc);
create index if not exists idx_events_status on events (status);
create index if not exists idx_events_category on events (category);

comment on table events is 'Her haberin, algılandığı andaki bağlamla birlikte mühürlenmiş kalıcı kaydı (Event Memory).';

-- ============================================================
-- EVENT_ASSETS — Olay ile varlık(lar) arasındaki ilişki (n:n)
-- ============================================================
create table if not exists event_assets (
  event_id uuid not null references events(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  relation text not null default 'birincil' check (relation in ('birincil', 'rakip', 'tedarikci', 'sektor_paydasi')),
  primary key (event_id, asset_id)
);

comment on table event_assets is 'Zincirleme etki analizi için olay–varlık ilişkisi (Senaryo 5: Nvidia → TSM/AMD/SMCI).';

-- ============================================================
-- MARKET_CONTEXT — Olay etrafındaki fiyat/hacim/volatilite matrisi
-- ============================================================
create table if not exists market_context (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  offset_label text not null check (offset_label in ('T0-1h', 'T0', 'T0+24h', 'T0+1w')),
  captured_at timestamptz,
  price numeric(18,4) not null,
  change_pct numeric(7,3),
  volume_state text, -- 'stabil', 'ani_hacim_artisi', 'yuksek', 'trend_olusumu'
  created_at timestamptz not null default now()
);

create index if not exists idx_market_context_event on market_context (event_id);

-- ============================================================
-- PREDICTIONS — Kısa/orta/uzun vade tahmin çıktıları
-- ============================================================
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  asset_id uuid not null references assets(id) on delete cascade,
  horizon text not null check (horizon in ('1s', '24s', '1h')), -- 1 saat / 24 saat / 1 hafta
  expected_change_low numeric(7,3) not null,
  expected_change_high numeric(7,3) not null,
  confidence smallint not null check (confidence between 0 and 100),
  basis_event_count integer not null default 0,
  method text not null default 'benzer_olay_ortalamasi',
  created_at timestamptz not null default now()
);

create index if not exists idx_predictions_event on predictions (event_id);

-- ============================================================
-- OUTCOMES — Gerçekleşen sonuç ve tahmin hatası (RL döngüsü girdisi)
-- ============================================================
create table if not exists outcomes (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references predictions(id) on delete cascade,
  actual_change_pct numeric(7,3),
  measured_at timestamptz,
  absolute_error numeric(7,3),
  created_at timestamptz not null default now()
);

-- ============================================================
-- RUMOR_TRACKING — Söylenti yaşam döngüsü
-- ============================================================
create table if not exists rumor_tracking (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  stage text not null check (stage in ('rumor', 'unverified', 'confirmed', 'false')),
  source_accuracy_score numeric(5,2), -- örn. 87.00 (%)
  note text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_rumor_tracking_event on rumor_tracking (event_id);

-- ============================================================
-- ROW LEVEL SECURITY — Herkese açık okuma, yazma yalnızca servis rolü
-- ============================================================
alter table sources enable row level security;
alter table assets enable row level security;
alter table events enable row level security;
alter table event_assets enable row level security;
alter table market_context enable row level security;
alter table predictions enable row level security;
alter table outcomes enable row level security;
alter table rumor_tracking enable row level security;

create policy "public_read_sources" on sources for select using (true);
create policy "public_read_assets" on assets for select using (true);
create policy "public_read_events" on events for select using (true);
create policy "public_read_event_assets" on event_assets for select using (true);
create policy "public_read_market_context" on market_context for select using (true);
create policy "public_read_predictions" on predictions for select using (true);
create policy "public_read_outcomes" on outcomes for select using (true);
create policy "public_read_rumor_tracking" on rumor_tracking for select using (true);

-- Not: INSERT/UPDATE/DELETE politikası tanımlanmadı — yazma işlemleri yalnızca
-- Supabase service_role anahtarı (RLS'yi bypass eder) üzerinden, sunucu tarafı
-- kod ile yapılmalıdır (bkz. src/lib/supabase/server.ts).
