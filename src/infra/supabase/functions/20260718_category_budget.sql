-- Presupuestos mensuales recurrentes por categoría
-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.category_budget (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id bigint not null references public.category (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint category_budget_user_category_unique unique (user_id, category_id)
);

create index if not exists category_budget_user_id_idx
  on public.category_budget (user_id);

create index if not exists category_budget_category_id_idx
  on public.category_budget (category_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists category_budget_set_updated_at on public.category_budget;

create trigger category_budget_set_updated_at
before update on public.category_budget
for each row
execute function public.set_updated_at();

alter table public.category_budget enable row level security;

drop policy if exists "category_budget_select_own" on public.category_budget;
drop policy if exists "category_budget_insert_own" on public.category_budget;
drop policy if exists "category_budget_update_own" on public.category_budget;
drop policy if exists "category_budget_delete_own" on public.category_budget;

create policy "category_budget_select_own"
on public.category_budget
for select
to authenticated
using (auth.uid() = user_id);

create policy "category_budget_insert_own"
on public.category_budget
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.effective_categories ec
    where ec.id = category_id
      and coalesce(ec.is_hidden, false) = false
  )
);

create policy "category_budget_update_own"
on public.category_budget
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.effective_categories ec
    where ec.id = category_id
      and coalesce(ec.is_hidden, false) = false
  )
);

create policy "category_budget_delete_own"
on public.category_budget
for delete
to authenticated
using (auth.uid() = user_id);

-- RPC para el widget del dashboard: presupuesto vs gasto del mes en curso
create or replace function public.get_category_budget_progress(
  p_account_id bigint default null
)
returns table (
  budget_id bigint,
  category_id bigint,
  category_title text,
  category_icon text,
  category_color public."categoryColors",
  budget_amount numeric,
  spent_amount numeric,
  progress_percent numeric,
  is_over_budget boolean
)
language sql
security invoker
stable
set search_path = public
as $$
  with month_bounds as (
    select
      date_trunc('month', timezone('utc', now())) as start_at,
      (
        date_trunc('month', timezone('utc', now()))
        + interval '1 month'
        - interval '1 millisecond'
      ) as end_at
  ),
  spending as (
    select
      m.category,
      coalesce(sum(abs(m.amount)), 0) as total
    from public.movement m
    cross join month_bounds mb
    where m.user_id = auth.uid()
      and m.type = 'expense'
      and m.done_at >= mb.start_at
      and m.done_at <= mb.end_at
      and (p_account_id is null or m."from" = p_account_id)
    group by m.category
  )
  select
    b.id as budget_id,
    b.category_id,
    coalesce(ec.title, c.title) as category_title,
    coalesce(ec.icon, c.icon) as category_icon,
    coalesce(ec.color, c.color) as category_color,
    b.amount as budget_amount,
    coalesce(s.total, 0) as spent_amount,
    round((coalesce(s.total, 0) / b.amount) * 100, 1) as progress_percent,
    coalesce(s.total, 0) > b.amount as is_over_budget
  from public.category_budget b
  join public.category c on c.id = b.category_id
  left join public.effective_categories ec on ec.id = b.category_id
  left join spending s on s.category = b.category_id
  where b.user_id = auth.uid()
  order by progress_percent desc, category_title asc;
$$;

grant select, insert, update, delete on public.category_budget to authenticated;
grant execute on function public.get_category_budget_progress(bigint) to authenticated;
