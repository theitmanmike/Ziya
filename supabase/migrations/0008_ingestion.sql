-- Ziya — Gerçek Haber Çekme (Ingestion) altyapısı
-- Bkz: TODO.md Faz 7.1

-- Aynı haberi tekrar tekrar eklememek için doğal bir dedup anahtarı.
-- NULL'lar unique kısıtına takılmaz (seed verisindeki mevcut olaylar etkilenmez).
alter table events add column if not exists external_url text unique;

comment on column events.external_url is 'Otomatik çekilen haberler için kaynak makale URL''si — dedup anahtarı. Elle girilen olaylarda null.';

-- Her ingestion çalıştırmasının kaydı (gözlemlenebilirlik).
create table if not exists ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  connector text not null, -- 'finnhub' vb.
  trigger text not null default 'manual', -- 'manual' | 'cron'
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'success', 'error')),
  events_created integer not null default 0,
  articles_seen integer not null default 0,
  error_message text
);

comment on table ingestion_runs is 'Her otomatik/manuel haber çekme çalıştırmasının günlüğü — admin panelinde gösterilir.';

alter table ingestion_runs enable row level security;
create policy "ingestion_runs_select_admin" on ingestion_runs for select using (is_admin());
