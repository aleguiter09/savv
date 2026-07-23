
CREATE OR REPLACE FUNCTION public.delete_movement_with_balance(p_movement_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_previous public.movement%rowtype;
begin
  if v_user_id is null then
    raise exception 'Unauthenticated';
  end if;

  select *
  into v_previous
  from public.movement m
  where m.id = p_movement_id
    and m.user_id = v_user_id
  for update;

  if not found then
    raise exception 'Movement % not found for current user', p_movement_id;
  end if;

  update public.account
  set balance = balance - v_previous.amount
  where id = v_previous."from"
    and user_id = v_user_id;

  delete from public.movement
  where id = p_movement_id
    and user_id = v_user_id;

  perform public.recalculate_balance_after_for_account(v_user_id, v_previous."from");
end;
$function$
