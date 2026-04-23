create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values
  ('disaster-covers', 'disaster-covers', false),
  ('incident-attachments', 'incident-attachments', false)
on conflict (id) do update
set public = excluded.public;

create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select role
  from public.user_profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

alter table storage.objects enable row level security;

drop policy if exists "management can read disaster covers" on storage.objects;
create policy "management can read disaster covers"
on storage.objects
for select
using (
  bucket_id = 'disaster-covers'
  and public.current_app_role() in ('admin', 'dispatcher', 'line_manager')
);

drop policy if exists "admins can manage disaster covers" on storage.objects;
create policy "admins can manage disaster covers"
on storage.objects
for all
using (
  bucket_id = 'disaster-covers'
  and public.current_app_role() = 'admin'
)
with check (
  bucket_id = 'disaster-covers'
  and public.current_app_role() = 'admin'
);

drop policy if exists "management can read incident attachments" on storage.objects;
create policy "management can read incident attachments"
on storage.objects
for select
using (
  bucket_id = 'incident-attachments'
  and public.current_app_role() in ('admin', 'dispatcher', 'line_manager')
);

drop policy if exists "management can manage incident attachments" on storage.objects;
create policy "management can manage incident attachments"
on storage.objects
for all
using (
  bucket_id = 'incident-attachments'
  and public.current_app_role() in ('admin', 'dispatcher', 'line_manager')
)
with check (
  bucket_id = 'incident-attachments'
  and public.current_app_role() in ('admin', 'dispatcher', 'line_manager')
);
