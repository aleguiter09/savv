-- Apply a single unapplied movement (and its transfer pair) to account balances.
-- Optional: bump done_at to now() for "apply today" from the UI.

CREATE OR REPLACE FUNCTION public.apply_movement(
  p_movement_id bigint,
  p_set_done_at_now boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
declare
  v_user_id uuid := auth.uid();
  v_movement public.movement%rowtype;
  v_out_leg public.movement%rowtype;
  v_in_leg public.movement%rowtype;
  v_done_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'Unauthenticated';
  end if;

  select *
  into v_movement
  from public.movement m
  where m.id = p_movement_id
    and m.user_id = v_user_id
  for update;

  if not found then
    raise exception 'Movement % not found for current user', p_movement_id;
  end if;

  if v_movement.applied then
    return;
  end if;

  v_done_at := case when p_set_done_at_now then now() else v_movement.done_at end;

  if v_movement.type = 'transfer' then
    if v_movement.transfer_group_id is null then
      raise exception 'Cannot apply legacy transfer without transfer_group_id';
    end if;

    select *
    into v_out_leg
    from public.movement m
    where m.transfer_group_id = v_movement.transfer_group_id
      and m.user_id = v_user_id
      and m.amount < 0
    for update;

    select *
    into v_in_leg
    from public.movement m
    where m.transfer_group_id = v_movement.transfer_group_id
      and m.user_id = v_user_id
      and m.amount > 0
    for update;

    if not found or v_out_leg.id is null or v_in_leg.id is null then
      raise exception 'Transfer legs not found for group %', v_movement.transfer_group_id;
    end if;

    if v_out_leg.applied then
      return;
    end if;

    update public.movement
    set applied = true,
        done_at = v_done_at,
        updated_at = now()
    where transfer_group_id = v_movement.transfer_group_id
      and user_id = v_user_id;

    update public.account
    set balance = balance + v_out_leg.amount
    where id = v_out_leg."from" and user_id = v_user_id;

    update public.account
    set balance = balance + v_in_leg.amount
    where id = v_in_leg."from" and user_id = v_user_id;

    perform public.recalculate_balance_after_for_account(v_user_id, v_out_leg."from");
    if v_in_leg."from" <> v_out_leg."from" then
      perform public.recalculate_balance_after_for_account(v_user_id, v_in_leg."from");
    end if;

    return;
  end if;

  update public.movement
  set applied = true,
      done_at = v_done_at,
      updated_at = now()
  where id = p_movement_id
    and user_id = v_user_id;

  update public.account
  set balance = balance + v_movement.amount
  where id = v_movement."from" and user_id = v_user_id;

  perform public.recalculate_balance_after_for_account(v_user_id, v_movement."from");
end;
$$;
