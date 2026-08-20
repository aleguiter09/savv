create or replace function public.save_movement_with_balance(
  p_movement_id bigint,
  p_amount numeric,
  p_description text,
  p_done_at timestamptz,
  p_type public."movementType",
  p_from bigint,
  p_where bigint default null,
  p_category bigint default null
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_previous public.movement%rowtype;
  v_out_leg public.movement%rowtype;
  v_in_leg public.movement%rowtype;
  v_target_movement_id integer;
  v_signed_amount numeric;
  v_group_id uuid;
  v_abs_amount numeric;
  v_old_from bigint;
  v_old_where bigint;
begin
  if v_user_id is null then
    raise exception 'Unauthenticated';
  end if;

  perform 1
  from public.account a
  where a.id = p_from and a.user_id = v_user_id;

  if not found then
    raise exception 'Invalid source account for current user';
  end if;

  if p_movement_id = 0 then
    -- CREATE

    if p_type = 'transfer' then
      if p_where is null then
        raise exception 'p_where is required for transfer creation';
      end if;
      if p_where = p_from then
        raise exception 'Transfer source and destination must be different';
      end if;

      perform 1
      from public.account a
      where a.id = p_where and a.user_id = v_user_id;

      if not found then
        raise exception 'Invalid destination account for current user';
      end if;

      v_group_id := gen_random_uuid();
      v_abs_amount := abs(p_amount);

      insert into public.movement (amount, description, done_at, type, "from", category, user_id, balance_after, transfer_group_id)
      values (-v_abs_amount, p_description, p_done_at, p_type, p_from, null, v_user_id, null, v_group_id)
      returning id into v_target_movement_id;

      insert into public.movement (amount, description, done_at, type, "from", category, user_id, balance_after, transfer_group_id)
      values (v_abs_amount, p_description, p_done_at, p_type, p_where, null, v_user_id, null, v_group_id);

      update public.account set balance = balance - v_abs_amount where id = p_from and user_id = v_user_id;
      update public.account set balance = balance + v_abs_amount where id = p_where and user_id = v_user_id;

      perform public.recalculate_balance_after_for_account(v_user_id, p_from);
      perform public.recalculate_balance_after_for_account(v_user_id, p_where);

      return v_target_movement_id;
    end if;

    if p_category is null then
      raise exception 'p_category is required for income/expense';
    end if;

    v_signed_amount := case when p_type = 'expense' then -abs(p_amount) else abs(p_amount) end;

    insert into public.movement (amount, description, done_at, type, "from", category, user_id, balance_after)
    values (v_signed_amount, p_description, p_done_at, p_type, p_from, p_category, v_user_id, null)
    returning id into v_target_movement_id;

    update public.account set balance = balance + v_signed_amount where id = p_from and user_id = v_user_id;
    perform public.recalculate_balance_after_for_account(v_user_id, p_from);

    return v_target_movement_id;

  else
    -- UPDATE

    select *
    into v_previous
    from public.movement m
    where m.id = p_movement_id and m.user_id = v_user_id
    for update;

    if not found then
      raise exception 'Movement % not found for current user', p_movement_id;
    end if;

    if p_type = 'transfer' then
      if v_previous.type <> 'transfer' then
        raise exception 'Cannot change movement type to transfer';
      end if;

      if v_previous.transfer_group_id is null then
        raise exception 'Cannot edit legacy transfer without transfer_group_id';
      end if;

      if p_where is null then
        raise exception 'p_where is required for transfer update';
      end if;
      if p_where = p_from then
        raise exception 'Transfer source and destination must be different';
      end if;

      perform 1
      from public.account a
      where a.id = p_where and a.user_id = v_user_id;

      if not found then
        raise exception 'Invalid destination account for current user';
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

      v_abs_amount := abs(p_amount);
      v_old_from := v_out_leg."from";
      v_old_where := v_in_leg."from";

      -- Revert previous balances
      update public.account
      set balance = balance - v_out_leg.amount
      where id = v_old_from and user_id = v_user_id;

      update public.account
      set balance = balance - v_in_leg.amount
      where id = v_old_where and user_id = v_user_id;

      update public.movement
      set amount      = -v_abs_amount,
          description = p_description,
          done_at     = p_done_at,
          type        = 'transfer',
          "from"      = p_from,
          category    = null,
          updated_at  = now()
      where id = v_out_leg.id
        and user_id = v_user_id
      returning id into v_target_movement_id;

      update public.movement
      set amount      = v_abs_amount,
          description = p_description,
          done_at     = p_done_at,
          type        = 'transfer',
          "from"      = p_where,
          category    = null,
          updated_at  = now()
      where id = v_in_leg.id
        and user_id = v_user_id;

      -- Apply new balances
      update public.account
      set balance = balance - v_abs_amount
      where id = p_from and user_id = v_user_id;

      update public.account
      set balance = balance + v_abs_amount
      where id = p_where and user_id = v_user_id;

      perform public.recalculate_balance_after_for_account(v_user_id, v_old_from);
      if v_old_where <> v_old_from then
        perform public.recalculate_balance_after_for_account(v_user_id, v_old_where);
      end if;
      if p_from <> v_old_from and p_from <> v_old_where then
        perform public.recalculate_balance_after_for_account(v_user_id, p_from);
      end if;
      if p_where <> v_old_from and p_where <> v_old_where and p_where <> p_from then
        perform public.recalculate_balance_after_for_account(v_user_id, p_where);
      end if;

      return v_target_movement_id;
    end if;

    if v_previous.type = 'transfer' then
      raise exception 'Cannot change transfer type to income/expense';
    end if;

    if p_type = 'expense' then
      v_signed_amount := -abs(p_amount);
    else
      v_signed_amount := abs(p_amount);
    end if;

    if p_category is null then
      raise exception 'p_category is required for income/expense';
    end if;

    update public.movement
    set amount      = v_signed_amount,
        description = p_description,
        done_at     = p_done_at,
        type        = p_type,
        "from"      = p_from,
        category    = p_category,
        updated_at  = now()
    where id = p_movement_id
      and user_id = v_user_id
    returning id into v_target_movement_id;

    update public.account
    set balance = balance - v_previous.amount
    where id = v_previous."from" and user_id = v_user_id;

    update public.account
    set balance = balance + v_signed_amount
    where id = p_from and user_id = v_user_id;

    perform public.recalculate_balance_after_for_account(v_user_id, v_previous."from");
    if v_previous."from" != p_from then
      perform public.recalculate_balance_after_for_account(v_user_id, p_from);
    end if;

    return v_target_movement_id;
  end if;
end;
$$;
