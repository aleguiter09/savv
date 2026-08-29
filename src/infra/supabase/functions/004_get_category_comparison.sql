-- Comparación de gastos por categoría: actual mes vs promedio 6 meses vs presupuesto
-- Ejecutar en el SQL Editor de Supabase

create or replace function public.get_category_comparison(
  p_account_id bigint default null
)
returns table (
  category_id bigint,
  category_title text,
  category_icon text,
  category_color public."categoryColors",
  current_month_spent numeric,
  six_month_avg numeric,
  budget_amount numeric,
  diff_vs_avg_percent numeric,
  diff_vs_budget_percent numeric
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
  six_month_bounds as (
    select
      date_trunc('month', timezone('utc', now() - interval '6 months')) as start_at,
      (
        date_trunc('month', timezone('utc', now()))
        - interval '1 millisecond'
      ) as end_at
  ),
  current_spending as (
    select
      m.category,
      coalesce(sum(abs(m.amount)), 0) as total
    from public.movement m
    cross join month_bounds mb
    where m.user_id = auth.uid()
      and m.type = 'expense'
      and m.applied = true
      and m.done_at >= mb.start_at
      and m.done_at <= mb.end_at
      and (p_account_id is null or m."from" = p_account_id)
    group by m.category
  ),
  six_month_spending as (
    select
      m.category,
      coalesce(sum(abs(m.amount)), 0) as total
    from public.movement m
    cross join six_month_bounds smb
    where m.user_id = auth.uid()
      and m.type = 'expense'
      and m.applied = true
      and m.done_at >= smb.start_at
      and m.done_at <= smb.end_at
      and (p_account_id is null or m."from" = p_account_id)
    group by m.category
  )
  select
    c.id as category_id,
    coalesce(ec.title, c.title) as category_title,
    coalesce(ec.icon, c.icon) as category_icon,
    coalesce(ec.color, c.color) as category_color,
    coalesce(cs.total, 0) as current_month_spent,
    round((coalesce(sms.total, 0) / 6)::numeric, 2) as six_month_avg,
    coalesce(b.amount, 0) as budget_amount,
    case 
      when coalesce(sms.total, 0) = 0 then 0
      else round((((coalesce(cs.total, 0) - (coalesce(sms.total, 0) / 6)) / (coalesce(sms.total, 0) / 6)) * 100)::numeric, 1)
    end as diff_vs_avg_percent,
    case 
      when b.amount is null or b.amount = 0 then null
      else round(((coalesce(cs.total, 0) / b.amount) * 100)::numeric, 1)
    end as diff_vs_budget_percent
  from public.category c
  left join public.effective_categories ec on ec.id = c.id
  left join current_spending cs on cs.category = c.id
  left join six_month_spending sms on sms.category = c.id
  left join public.category_budget b on b.category_id = c.id and b.user_id = auth.uid()
  where coalesce(ec.is_hidden, false) = false
    and (cs.total > 0 or sms.total > 0 or b.amount is not null)
  order by current_month_spent desc, category_title asc;
$$;

grant execute on function public.get_category_comparison(bigint) to authenticated;
