-- ============================================================================
--  Auth upgrade — run in Supabase SQL editor AFTER schema.sql.
--  Adds profile fields for Google/phone sign-ups and makes the auto-profile
--  trigger handle Google OAuth metadata + phone-only (no email) accounts.
-- ============================================================================

alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  uname text;
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  -- Username: explicit → email local-part → 'user'
  uname := coalesce(
    nullif(trim(meta->>'username'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'user'
  );
  if exists (select 1 from public.profiles where username = uname) then
    uname := uname || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;

  insert into public.profiles (id, username, full_name, avatar_url, phone)
  values (
    new.id,
    uname,
    coalesce(nullif(trim(meta->>'full_name'), ''), nullif(trim(meta->>'name'), '')),  -- Google sends full_name/name
    coalesce(meta->>'avatar_url', meta->>'picture'),                                  -- Google sends avatar_url/picture
    new.phone
  );
  return new;
end; $$;

-- (trigger on_auth_user_created from schema.sql already calls this function)
