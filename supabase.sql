-- 1) Invitaciones
create table if not exists invites (
  id bigserial primary key,
  email text not null,
  token text not null unique,
  used boolean default false,
  created_at timestamptz default now()
);

-- 2) Perfil del usuario autenticado
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null,
  created_at timestamptz default now()
);

-- 3) Watchlist de cada usuario
create table if not exists watchlist_items (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  type text not null check (type in ('serie', 'pelicula')),
  category text not null default 'pendiente',
  created_at timestamptz default now()
);

-- 4) Comentarios sobre un item concreto de otro usuario
create table if not exists comments (
  id bigserial primary key,
  owner_user_id uuid not null references profiles(id) on delete cascade,
  target_user_id uuid not null references profiles(id) on delete cascade,
  item_id bigint not null references watchlist_items(id) on delete cascade,
  comment text not null,
  created_at timestamptz default now()
);

-- RLS básico
alter table profiles enable row level security;
alter table watchlist_items enable row level security;
alter table comments enable row level security;

create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert_self" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_self" on profiles for update using (auth.uid() = id);

create policy "watchlist_select" on watchlist_items for select using (true);
create policy "watchlist_insert_self" on watchlist_items for insert with check (auth.uid() = user_id);
create policy "watchlist_update_self" on watchlist_items for update using (auth.uid() = user_id);
create policy "watchlist_delete_self" on watchlist_items for delete using (auth.uid() = user_id);

create policy "comments_select" on comments for select using (true);
create policy "comments_insert_self" on comments for insert with check (auth.uid() = owner_user_id);
create policy "comments_update_self" on comments for update using (auth.uid() = owner_user_id);
create policy "comments_delete_self" on comments for delete using (auth.uid() = owner_user_id);
