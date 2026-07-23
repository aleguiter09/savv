CREATE OR REPLACE FUNCTION public.get_accounts_balance_at(target_date timestamp without time zone)
 RETURNS TABLE("from" bigint, balance numeric)
 LANGUAGE sql
AS $function$
  SELECT DISTINCT ON (m."from")
    m."from",
    m.balance_after
  FROM movement m
  WHERE m.done_at <= target_date
  ORDER BY m."from", m.done_at DESC;
$function$
