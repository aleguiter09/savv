CREATE OR REPLACE FUNCTION public.get_accounts_balance_at(
  target_date timestamp with time zone
)
RETURNS TABLE("from" bigint, balance numeric)
LANGUAGE sql
STABLE
AS $function$
  SELECT 
    a.id AS "from",
    COALESCE(
      m.balance_after,
      a.balance,
      0
    )::numeric AS balance
  FROM public.account a
  LEFT JOIN LATERAL (
    SELECT m_inner.balance_after
    FROM public.movement m_inner
    WHERE m_inner."from" = a.id
      AND m_inner.done_at <= target_date
    ORDER BY m_inner.done_at DESC, m_inner.id DESC
    LIMIT 1
  ) m ON true;
$function$;