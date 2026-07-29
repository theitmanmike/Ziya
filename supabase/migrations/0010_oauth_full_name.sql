-- Ziya — Google ile giriş desteği
-- Bkz: TODO.md Faz 6

-- Google (ve ileride eklenebilecek diğer OAuth sağlayıcıları) kullanıcının
-- adını `raw_user_meta_data` içinde farklı anahtarlarda verir
-- ('full_name' ya da 'name'). E-posta/şifre ile kayıtta bu alan boştur.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;
