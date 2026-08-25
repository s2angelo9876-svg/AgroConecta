-- ===========================================================
-- AgroConecta - Row Level Security
-- Aplicar después de 0001
-- ===========================================================

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.farmer_profiles enable row level security;
alter table public.verification_docs enable row level security;
alter table public.products enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.demands enable row level security;
alter table public.matches enable row level security;
alter table public.orders enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

-- Helper: ¿el usuario actual es admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ===== profiles =====
create policy "profiles_select_own_or_admin"
  on public.profiles for select using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_own"
  on public.profiles for insert with check (auth.uid() = id);

-- UPDATE: usuario puede actualizar su fila, pero el rol NO puede cambiar.
create policy "profiles_update_own_keep_role"
  on public.profiles for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy "profiles_update_admin"
  on public.profiles for update using (public.is_admin());

-- ===== farmer_profiles =====
create policy "farmer_profiles_select_all"
  on public.farmer_profiles for select using (true);

create policy "farmer_profiles_insert_own"
  on public.farmer_profiles for insert with check (auth.uid() = user_id);

create policy "farmer_profiles_update_own_safe"
  on public.farmer_profiles for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    -- El agricultor NO puede auto-aprobar ni cambiar status
    and verification_status = (
      select verification_status from public.farmer_profiles where user_id = auth.uid()
    )
  );

create policy "farmer_profiles_update_admin"
  on public.farmer_profiles for update using (public.is_admin());

-- ===== verification_docs =====
-- Solo el dueño ve/crea; solo el admin decide.
create policy "vd_select_own_or_admin"
  on public.verification_docs for select using (auth.uid() = user_id or public.is_admin());

create policy "vd_insert_own"
  on public.verification_docs for insert with check (auth.uid() = user_id);

create policy "vd_update_admin_only"
  on public.verification_docs for update using (public.is_admin());

-- ===== products =====
-- Lectura pública de productos activos, o propios, o admin
create policy "products_select"
  on public.products for select using (
    status = 'active' or farmer_id = auth.uid() or public.is_admin()
  );

create policy "products_insert_own"
  on public.products for insert with check (auth.uid() = farmer_id);

create policy "products_update_own"
  on public.products for update using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

create policy "products_delete_own"
  on public.products for delete using (auth.uid() = farmer_id or public.is_admin());

-- ===== favorites =====
create policy "favorites_all_own"
  on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== conversations =====
create policy "conversations_select_participants"
  on public.conversations for select using (auth.uid() = buyer_id or auth.uid() = farmer_id);

create policy "conversations_insert_participants"
  on public.conversations for insert with check (auth.uid() = buyer_id or auth.uid() = farmer_id);

create policy "conversations_update_participants"
  on public.conversations for update using (auth.uid() = buyer_id or auth.uid() = farmer_id);

-- ===== messages =====
create policy "messages_select_participants"
  on public.messages for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.buyer_id = auth.uid() or c.farmer_id = auth.uid())
    )
  );

create policy "messages_insert_sender"
  on public.messages for insert with check (auth.uid() = sender_id);

-- ===== reviews =====
create policy "reviews_select_all"
  on public.reviews for select using (true);

create policy "reviews_insert_self"
  on public.reviews for insert with check (auth.uid() = buyer_id);

-- ===== notifications =====
create policy "notifications_all_own"
  on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== demands =====
create policy "demands_select_all"
  on public.demands for select using (true);

create policy "demands_all_own"
  on public.demands for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

-- ===== matches =====
create policy "matches_select_participants"
  on public.matches for select using (
    exists (select 1 from public.demands d where d.id = demand_id and d.buyer_id = auth.uid())
    or exists (select 1 from public.products p where p.id = product_id and p.farmer_id = auth.uid())
    or public.is_admin()
  );

-- ===== orders =====
create policy "orders_select_buyer_or_admin"
  on public.orders for select using (auth.uid() = buyer_id or public.is_admin());

-- ===== CMS =====
create policy "faqs_select_published"
  on public.faqs for select using (published = true or public.is_admin());

create policy "faqs_admin_write"
  on public.faqs for all using (public.is_admin());

create policy "testimonials_select_published"
  on public.testimonials for select using (published = true or public.is_admin());

create policy "testimonials_admin_write"
  on public.testimonials for all using (public.is_admin());

create policy "settings_select_all"
  on public.site_settings for select using (true);

create policy "settings_admin_write"
  on public.site_settings for all using (public.is_admin());