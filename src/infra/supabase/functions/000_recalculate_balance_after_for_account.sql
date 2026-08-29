CREATE OR REPLACE FUNCTION public.recalculate_balance_after_for_account(
  p_user_id uuid,
  p_account_id bigint
)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
declare
  v_current_balance numeric;
  v_total_effect numeric := 0;
  v_opening_balance numeric := 0;
  v_running_balance numeric := 0;
  v_row record;
begin
  select a.balance
  into v_current_balance
  from public.account a
  where a.id = p_account_id
    and a.user_id = p_user_id
  for update;

  if not found then
    raise exception 'Account % not found for current user', p_account_id;
  end if;

  select coalesce(sum(m.amount), 0)
  into v_total_effect
  from public.movement m
  where m.user_id = p_user_id
    and m."from" = p_account_id
    and m.applied = true;

  v_opening_balance := v_current_balance - v_total_effect;
  v_running_balance := v_opening_balance;

  update public.movement
  set balance_after = null
  where user_id = p_user_id
    and "from" = p_account_id
    and applied = false;

  for v_row in
    select m.id, m.amount
    from public.movement m
    where m.user_id = p_user_id
      and m."from" = p_account_id
      and m.applied = true
    order by m.done_at asc, m.id asc
  loop
    v_running_balance := v_running_balance + v_row.amount;

    update public.movement
    set balance_after = v_running_balance
    where id = v_row.id
      and user_id = p_user_id;
  end loop;
end;
$function$;
