CREATE OR REPLACE FUNCTION public.delete_movement_with_balance(p_movement_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_previous public.movement%rowtype;
  v_out_leg public.movement%rowtype;
  v_in_leg public.movement%rowtype;
  v_from_account bigint;
  v_where_account bigint;
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

  if v_previous.type = 'transfer' then
    if v_previous.transfer_group_id is null then
      raise exception 'Cannot delete legacy transfer without transfer_group_id';
    end if;

    select *
    into v_out_leg
    from public.movement m
    where m.transfer_group_id = v_previous.transfer_group_id
      and m.user_id = v_user_id
      and m.amount < 0
    for update;

    if not found then
      raise exception 'Transfer out leg not found for group %', v_previous.transfer_group_id;
    end if;

    select *
    into v_in_leg
    from public.movement m
    where m.transfer_group_id = v_previous.transfer_group_id
      and m.user_id = v_user_id
      and m.amount > 0
    for update;

    if not found then
      raise exception 'Transfer in leg not found for group %', v_previous.transfer_group_id;
    end if;

    v_from_account := v_out_leg."from";
    v_where_account := v_in_leg."from";

    update public.account
    set balance = balance - v_out_leg.amount
    where id = v_from_account
      and user_id = v_user_id;

    update public.account
    set balance = balance - v_in_leg.amount
    where id = v_where_account
      and user_id = v_user_id;

    delete from public.movement
    where transfer_group_id = v_previous.transfer_group_id
      and user_id = v_user_id;

    perform public.recalculate_balance_after_for_account(v_user_id, v_from_account);
    if v_where_account <> v_from_account then
      perform public.recalculate_balance_after_for_account(v_user_id, v_where_account);
    end if;

    return;
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
