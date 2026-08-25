-- ===========================================================
-- AgroConecta - Storage: bucket privado de documentos KYC
-- Aplicar después de 0001 y 0002
-- ===========================================================

-- Crear bucket privado para documentos de verificación
insert into storage.buckets (id, name, public)
values ('verification-docs', 'verification-docs', false)
on conflict (id) do nothing;

-- Políticas: solo el dueño sube, lee y borra; admin tiene acceso total
create policy "vd_storage_upload_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'verification-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vd_storage_select_own_or_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'verification-docs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

create policy "vd_storage_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'verification-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "vd_storage_delete_own_or_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'verification-docs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );