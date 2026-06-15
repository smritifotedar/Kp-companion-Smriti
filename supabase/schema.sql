-- ============================================================================
--  Kashmiri Pandit Community Hub — database schema (run in Supabase SQL editor)
--  Safe to re-run: uses IF NOT EXISTS / drop-and-create for policies & triggers.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Profiles (1:1 with auth.users) ──────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  full_name text,
  bio text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare uname text;
begin
  uname := coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), split_part(new.email, '@', 1));
  if exists (select 1 from public.profiles where username = uname) then
    uname := uname || '_' || substr(replace(new.id::text,'-',''), 1, 4);
  end if;
  insert into public.profiles (id, username, full_name)
  values (new.id, uname, nullif(trim(new.raw_user_meta_data->>'full_name'), ''));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Posts ───────────────────────────────────────────────────────────────────
do $$ begin
  create type public.post_type as enum ('question', 'discussion', 'story');
exception when duplicate_object then null; end $$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type public.post_type not null default 'discussion',
  category text not null default 'General Discussion',
  title text not null,
  content text not null,
  best_comment_id uuid,
  like_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts(created_at desc);
create index if not exists posts_category_idx on public.posts(category);
create index if not exists posts_type_idx on public.posts(type);

-- ── Comments (one level of nesting via parent_id) ────────────────────────────
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  like_count int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments(post_id);

-- ── Likes ────────────────────────────────────────────────────────────────────
create table if not exists public.post_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create table if not exists public.comment_likes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, comment_id)
);

-- ── Counter triggers ─────────────────────────────────────────────────────────
create or replace function public.f_post_comment_count() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id; end if;
  return null;
end; $$;
drop trigger if exists trg_post_comment_count on public.comments;
create trigger trg_post_comment_count after insert or delete on public.comments
  for each row execute function public.f_post_comment_count();

create or replace function public.f_post_like_count() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then update public.posts set like_count = like_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id; end if;
  return null;
end; $$;
drop trigger if exists trg_post_like_count on public.post_likes;
create trigger trg_post_like_count after insert or delete on public.post_likes
  for each row execute function public.f_post_like_count();

create or replace function public.f_comment_like_count() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then update public.comments set like_count = like_count + 1 where id = new.comment_id;
  elsif tg_op = 'DELETE' then update public.comments set like_count = greatest(like_count - 1, 0) where id = old.comment_id; end if;
  return null;
end; $$;
drop trigger if exists trg_comment_like_count on public.comment_likes;
create trigger trg_comment_like_count after insert or delete on public.comment_likes
  for each row execute function public.f_comment_like_count();

create or replace function public.f_touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_posts_touch on public.posts;
create trigger trg_posts_touch before update on public.posts
  for each row execute function public.f_touch_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.comment_likes enable row level security;

drop policy if exists p_profiles_select on public.profiles;
create policy p_profiles_select on public.profiles for select using (true);
drop policy if exists p_profiles_update on public.profiles;
create policy p_profiles_update on public.profiles for update using (auth.uid() = id);

drop policy if exists p_posts_select on public.posts;
create policy p_posts_select on public.posts for select using (true);
drop policy if exists p_posts_insert on public.posts;
create policy p_posts_insert on public.posts for insert with check (auth.uid() = author_id);
drop policy if exists p_posts_update on public.posts;
create policy p_posts_update on public.posts for update using (auth.uid() = author_id);
drop policy if exists p_posts_delete on public.posts;
create policy p_posts_delete on public.posts for delete using (auth.uid() = author_id);

drop policy if exists p_comments_select on public.comments;
create policy p_comments_select on public.comments for select using (true);
drop policy if exists p_comments_insert on public.comments;
create policy p_comments_insert on public.comments for insert with check (auth.uid() = author_id);
drop policy if exists p_comments_update on public.comments;
create policy p_comments_update on public.comments for update using (auth.uid() = author_id);
drop policy if exists p_comments_delete on public.comments;
create policy p_comments_delete on public.comments for delete using (auth.uid() = author_id);

drop policy if exists p_post_likes_select on public.post_likes;
create policy p_post_likes_select on public.post_likes for select using (true);
drop policy if exists p_post_likes_insert on public.post_likes;
create policy p_post_likes_insert on public.post_likes for insert with check (auth.uid() = user_id);
drop policy if exists p_post_likes_delete on public.post_likes;
create policy p_post_likes_delete on public.post_likes for delete using (auth.uid() = user_id);

drop policy if exists p_comment_likes_select on public.comment_likes;
create policy p_comment_likes_select on public.comment_likes for select using (true);
drop policy if exists p_comment_likes_insert on public.comment_likes;
create policy p_comment_likes_insert on public.comment_likes for insert with check (auth.uid() = user_id);
drop policy if exists p_comment_likes_delete on public.comment_likes;
create policy p_comment_likes_delete on public.comment_likes for delete using (auth.uid() = user_id);

-- Done. (Future phases: events, photos with Storage, reports/moderation, badges.)
