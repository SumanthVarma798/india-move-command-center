create extension if not exists pgcrypto with schema extensions;

create table if not exists public.shared_dashboard_state (
  id text primary key default 'main' check (id = 'main'),
  password_hash text not null,
  data jsonb,
  updated_at timestamptz not null default now()
);

alter table public.shared_dashboard_state enable row level security;

revoke all on public.shared_dashboard_state from anon, authenticated;

insert into public.shared_dashboard_state (id, password_hash, data)
values ('main', '$2a$06$ZXoNL8wVUbCdlh/sE/t7a./zI5BVeVxEgRS1f14g4JCGyilxeII6a', null)
on conflict (id) do nothing;

create or replace function public.get_shared_dashboard(shared_password text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  dashboard_data jsonb;
begin
  select data
    into dashboard_data
    from public.shared_dashboard_state
   where id = 'main'
     and password_hash = extensions.crypt(shared_password, password_hash);

  if not found then
    raise exception 'Invalid dashboard password' using errcode = '28000';
  end if;

  return dashboard_data;
end;
$$;

create or replace function public.save_shared_dashboard(shared_password text, dashboard_data jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_at timestamptz;
begin
  update public.shared_dashboard_state
     set data = dashboard_data,
         updated_at = now()
   where id = 'main'
     and password_hash = extensions.crypt(shared_password, password_hash)
  returning updated_at into saved_at;

  if not found then
    raise exception 'Invalid dashboard password' using errcode = '28000';
  end if;

  return saved_at;
end;
$$;

grant execute on function public.get_shared_dashboard(text) to anon, authenticated;
grant execute on function public.save_shared_dashboard(text, jsonb) to anon, authenticated;
