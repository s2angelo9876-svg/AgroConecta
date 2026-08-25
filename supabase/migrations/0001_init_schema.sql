-- ===========================================================
-- AgroConecta - Esquema inicial
-- Aplicar en orden: 0001, 0002, 0003
-- ===========================================================

create extension if not exists pgcrypto;

-- ===== profiles (extiende auth.users) =====
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  dni_encrypted bytea,
  phone text,
  avatar_url text,
  role text not null default 'comprador'
    check (role in ('agricultor', 'comprador', 'admin')),
  created_at timestamptz not null default now()
);

-- ===== farmer_profiles =====
create table if not exists public.farmer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  farm_name text,
  location text,
  lat double precision,
  lng double precision,
  rating numeric(2,1) not null default 0,
  reviews_count int not null default 0,
  verified boolean not null default false,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'rejected')),
  member_since date not null default current_date,
  bio text
);

-- ===== verification_docs =====
create table if not exists public.verification_docs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  doc_type text not null check (doc_type in ('ppa', 'recibo_agua')),
  file_path text not null,
  file_size_bytes int,
  mime_type text,
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'rejected')),
  reviewer_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists verification_docs_user_id_idx on public.verification_docs(user_id);

-- ===== products =====
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'kg',
  price numeric not null check (price >= 0),
  harvest_date date,
  quality text check (quality in ('Premium', 'Primera', 'Segunda')),
  location text,
  description text,
  image_url text,
  status text not null default 'active'
    check (status in ('active', 'paused', 'deleted')),
  views int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists products_farmer_id_idx on public.products(farmer_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_location_idx on public.products(location);
create index if not exists products_created_at_idx on public.products(created_at desc);

-- ===== favorites =====
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ===== conversations =====
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  buyer_id uuid not null references public.profiles(id),
  farmer_id uuid not null references public.profiles(id),
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(product_id, buyer_id, farmer_id)
);
create index if not exists conversations_buyer_idx on public.conversations(buyer_id);
create index if not exists conversations_farmer_idx on public.conversations(farmer_id);

-- ===== messages =====
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  text text not null check (length(text) > 0 and length(text) <= 4000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id, created_at);

-- ===== reviews =====
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  text text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_farmer_id_idx on public.reviews(farmer_id);

-- ===== notifications =====
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  data jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on public.notifications(user_id, read, created_at desc);

-- ===== demands =====
create table if not exists public.demands (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  product_name text not null,
  quantity numeric not null,
  max_price numeric,
  delivery_location text,
  delivery_date date,
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now()
);

-- ===== matches =====
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  demand_id uuid not null references public.demands(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  score numeric not null default 1,
  created_at timestamptz not null default now(),
  unique(demand_id, product_id)
);

-- ===== orders =====
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  buyer_id uuid not null references public.profiles(id),
  quantity numeric not null,
  amount numeric not null,
  payment_provider text,
  payment_id text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

-- ===== CMS: faqs =====
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== CMS: testimonials =====
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  content text not null,
  avatar_url text,
  rating int not null default 5 check (rating between 1 and 5),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== CMS: site_settings =====
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- ===== Trigger: crear perfil automáticamente al registrarse =====
create or replace function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
  user_name text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'comprador');
  if user_role not in ('agricultor', 'comprador', 'admin') then
    user_role := 'comprador';
  end if;
  user_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    split_part(new.email, '@', 1)
  );
  insert into public.profiles (id, full_name, role)
  values (new.id, user_name, user_role);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();