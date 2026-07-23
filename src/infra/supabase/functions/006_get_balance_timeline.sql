CREATE OR REPLACE FUNCTION public.get_balance_timeline(from_date timestamp with time zone, to_date timestamp with time zone, bucket text, account_filter bigint DEFAULT NULL::bigint)
RETURNS TABLE(bucket_date timestamp with time zone, balance numeric)
LANGUAGE sql
STABLE
AS $function$
WITH buckets AS (
  SELECT generate_series(
    date_trunc(bucket, from_date),
    date_trunc(bucket, to_date),
    CAST('1 ' || bucket AS interval)
  ) AS bucket_date
),
accounts AS (
  SELECT id, balance
  FROM public.account
  WHERE (account_filter IS NULL OR id = account_filter)
),
expanded AS (
  SELECT
    b.bucket_date,
    a.id AS account_id,
    a.balance AS current_account_balance
  FROM buckets b
  CROSS JOIN accounts a
),
balances AS (
  SELECT
    e.bucket_date,
    e.account_id,
    COALESCE(
      -- 1. Intenta obtener el saldo del último movimiento anterior a la fecha del bucket
      (
        SELECT m.balance_after
        FROM public.movement m
        WHERE m."from" = e.account_id
          AND m.done_at < e.bucket_date + CAST('1 ' || bucket AS interval)
        ORDER BY m.done_at DESC, m.id DESC
        LIMIT 1
      ),
      -- 2. Si no hay movimientos anteriores, toma el saldo base de la tabla `account`
      e.current_account_balance,
      -- 3. Fallback final por seguridad
      0
    ) AS balance
  FROM expanded e
)
SELECT
  b.bucket_date,
  SUM(b.balance)::numeric AS balance
FROM balances b
GROUP BY b.bucket_date
ORDER BY b.bucket_date ASC;
$function$;