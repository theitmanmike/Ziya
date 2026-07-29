-- Ziya — Admin panelinden yönetilebilir API anahtarları (şifreli)
-- Bkz: TODO.md Faz 7.1
--
-- Anahtarlar asla düz metin olarak saklanmaz. pgcrypto (pgp_sym_encrypt/decrypt)
-- ile, uygulamanın SECRETS_ENCRYPTION_KEY ortam değişkeninde tuttuğu bir
-- passphrase kullanılarak şifrelenir — passphrase'in kendisi hiçbir zaman
-- veritabanına yazılmaz. Admin panelinde değerler yalnızca YAZILABİLİR;
-- kaydedildikten sonra tekrar düz metin olarak gösterilmez (şifre alanı deseni).

create table if not exists api_credentials (
  key text primary key, -- örn. 'FINNHUB_API_KEY'
  encrypted_value bytea not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id)
);

comment on table api_credentials is 'Admin panelinden (/admin/settings) girilen API anahtarları — pgcrypto ile şifreli. Şifre çözme yalnızca sunucu tarafı, SECRETS_ENCRYPTION_KEY bilen kodla mümkündür.';

alter table api_credentials enable row level security;
create policy "api_credentials_select_admin" on api_credentials for select using (is_admin());
-- Yazma politikası yok — yalnızca aşağıdaki SECURITY DEFINER fonksiyonlar üzerinden yazılır.

create or replace function set_api_credential(
  p_key text,
  p_value text,
  p_passphrase text,
  p_updated_by uuid
)
returns void
language sql
security definer
set search_path = public, extensions
as $$
  insert into api_credentials (key, encrypted_value, updated_at, updated_by)
  values (p_key, pgp_sym_encrypt(p_value, p_passphrase), now(), p_updated_by)
  on conflict (key) do update set
    encrypted_value = excluded.encrypted_value,
    updated_at = excluded.updated_at,
    updated_by = excluded.updated_by;
$$;

create or replace function get_api_credential(p_key text, p_passphrase text)
returns text
language sql
security definer
set search_path = public, extensions
stable
as $$
  select pgp_sym_decrypt(encrypted_value, p_passphrase)
  from api_credentials
  where key = p_key;
$$;

-- Yalnızca postgres/service_role çağırabilir — anon/authenticated'in passphrase
-- tahmin ederek çağırmasını engellemek için (savunma katmanı, esas koruma
-- passphrase'in gizliliği).
revoke execute on function set_api_credential(text, text, text, uuid) from public, anon, authenticated;
revoke execute on function get_api_credential(text, text) from public, anon, authenticated;
