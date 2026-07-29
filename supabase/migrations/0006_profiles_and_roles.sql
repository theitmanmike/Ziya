-- Ziya — Üyelik, Rol ve Paket Sistemi Temeli
-- Bkz: Proje Dosyası.md Bölüm 2.3 (Hedef Kitle)
--
-- profiles: her auth.users satırına karşılık gelen, uygulamaya özgü profil.
-- role: yetkilendirme (member/admin). subscription_tier: paket seviyesi.
-- İlk admin kullanıcısı elle atanır (bkz. README.md "İlk Admin Kullanıcısı").

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('member', 'admin')),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'kurumsal')),
  created_at timestamptz not null default now()
);

comment on table profiles is 'Her kullanıcı için rol (member/admin) ve paket seviyesi (free/pro/kurumsal).';

-- ============================================================
-- Yeni kullanıcı kaydolduğunda otomatik profil oluşturma
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Admin kontrolü — RLS politikalarında özyinelemeyi önlemek için
-- security definer fonksiyon üzerinden yapılır (Supabase'in önerdiği desen).
-- ============================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- RLS — kullanıcı yalnızca kendi profilini, admin herkesi görebilir.
-- Doğrudan insert/update politikası yok: satırlar yalnızca trigger
-- (kayıt anı) ve admin fonksiyonları (ileride) üzerinden değişir —
-- kullanıcıların kendi role/subscription_tier'ını değiştirmesini engeller.
-- ============================================================
alter table profiles enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_select_admin" on profiles for select using (is_admin());
