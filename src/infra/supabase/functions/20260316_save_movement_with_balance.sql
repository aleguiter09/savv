create or replace function public.recalculate_balance_after_for_account(
  p_user_id uuid,
  p_account_id bigint
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
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
    and m."from" = p_account_id;

  v_opening_balance := v_current_balance - v_total_effect;
  v_running_balance := v_opening_balance;

  for v_row in
    select m.id, m.amount
    from public.movement m
    where m.user_id = p_user_id
      and m."from" = p_account_id
    order by m.done_at asc, m.id asc
  loop
    v_running_balance := v_running_balance + v_row.amount;

    update public.movement
    set balance_after = v_running_balance
    where id = v_row.id
      and user_id = p_user_id;
  end loop;
end;
$$;

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
  v_target_movement_id integer;
  v_signed_amount numeric;
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

      insert into public.movement (amount, description, done_at, type, "from", category, user_id, balance_after)
      values (-abs(p_amount), p_description, p_done_at, p_type, p_from, null, v_user_id, null)
      returning id into v_target_movement_id;

      insert into public.movement (amount, description, done_at, type, "from", category, user_id, balance_after)
      values (abs(p_amount), p_description, p_done_at, p_type, p_where, null, v_user_id, null);

      update public.account set balance = balance - abs(p_amount) where id = p_from and user_id = v_user_id;
      update public.account set balance = balance + abs(p_amount) where id = p_where and user_id = v_user_id;

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
    -- UPDATE: always edits a single movement row

    select *
    into v_previous
    from public.movement m
    where m.id = p_movement_id and m.user_id = v_user_id
    for update;

    if not found then
      raise exception 'Movement % not found for current user', p_movement_id;
    end if;

    if p_type = 'expense' then
      v_signed_amount := -abs(p_amount);
    elsif p_type = 'income' then
      v_signed_amount := abs(p_amount);
    else
      v_signed_amount := case when v_previous.amount < 0 then -abs(p_amount) else abs(p_amount) end;
    end if;

    if p_type in ('expense', 'income') and p_category is null then
      raise exception 'p_category is required for income/expense';
    end if;

    update public.movement
    set amount      = v_signed_amount,
        description = p_description,
        done_at     = p_done_at,
        type        = p_type,
        "from"      = p_from,
        category    = case when p_type = 'transfer' then null else p_category end,
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

create or replace function public.delete_movement_with_balance(
  p_movement_id bigint
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
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
$$;