CREATE OR REPLACE FUNCTION public.get_balance_timeline(from_date timestamp with time zone, to_date timestamp with time zone, bucket text, account_filter bigint DEFAULT NULL::bigint)
 RETURNS TABLE(bucket_date timestamp with time zone, balance numeric)
 LANGUAGE sql
AS $function$with buckets as (
  select generate_series(
    date_trunc(bucket, from_date),
    date_trunc(bucket, to_date),
    ('1 ' || bucket)::interval
  ) as bucket_date
),
accounts as (
  select id
  from account
  where (account_filter is null or id = account_filter)
),
expanded as (
  select
    b.bucket_date,
    a.id as account_id
  from buckets b
  cross join accounts a
),
balances as (
  select
    e.bucket_date,
    e.account_id,
    coalesce((
      select m.balance_after
      from movement m
      where m."from" = e.account_id
        and m.done_at < e.bucket_date + ('1 ' || bucket)::interval
      order by m.done_at desc, m.id desc
      limit 1
    ), 0) as balance
  from expanded e
)
select
  bucket_date,
  sum(balance) as balance
from balances
group by bucket_date
order by bucket_date;$function$
