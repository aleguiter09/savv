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
      date_trunc('month', now() at time zone 'utc') as start_at,
      (date_trunc('month', now() at time zone 'utc') + interval '1 month' - interval '1 millisecond') as end_at
  ),
  spending as (
    select
      m.category,
      coalesce(sum(abs(m.amount)), 0) as total
    from public.movement m
    cross join month_bounds mb
    where m.type = 'expense'
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
    coalesce(ec.color, c.color)::public."categoryColors" as category_color,
    b.amount as budget_amount,
    coalesce(s.total, 0) as spent_amount,
    case 
      when b.amount = 0 then 0
      else round(((coalesce(s.total, 0) / b.amount) * 100)::numeric, 1)
    end as progress_percent,
    coalesce(s.total, 0) > b.amount as is_over_budget
  from public.category_budget b
  join public.category c on c.id = b.category_id
  left join public.effective_categories ec on ec.id = b.category_id
  left join spending s on s.category = b.category_id
  order by progress_percent desc, category_title asc;
$$;