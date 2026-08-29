-- Applied-balance RPCs: recalculate, save, delete, apply_movement, apply_due_movements.
-- Source of truth also kept under src/infra/supabase/functions/.

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

CREATE OR REPLACE FUNCTION public.delete_movement_with_balance(p_movement_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
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

    if v_out_leg.applied then
      update public.account
      set balance = balance - v_out_leg.amount
      where id = v_from_account
        and user_id = v_user_id;

      update public.account
      set balance = balance - v_in_leg.amount
      where id = v_where_account
        and user_id = v_user_id;
    end if;

    delete from public.movement
    where transfer_group_id = v_previous.transfer_group_id
      and user_id = v_user_id;

    perform public.recalculate_balance_after_for_account(v_user_id, v_from_account);
    if v_where_account <> v_from_account then
      perform public.recalculate_balance_after_for_account(v_user_id, v_where_account);
    end if;

    return;
  end if;

  if v_previous.applied then
    update public.account
    set balance = balance - v_previous.amount
    where id = v_previous."from"
      and user_id = v_user_id;
  end if;

  delete from public.movement
  where id = p_movement_id
    and user_id = v_user_id;

  perform public.recalculate_balance_after_for_account(v_user_id, v_previous."from");
end;
$function$;
create or replace function public.save_movement_with_balance(
  p_movement_id bigint,
  p_amount numeric,
  p_description text,
  p_done_at timestamptz,
  p_type public."movementType",
  p_from bigint,
  p_where bigint default null,
  p_category bigint default null,
  p_applied boolean default true,
  p_series_id bigint default null,
  p_installment_index integer default null
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

  if p_series_id is not null then
    perform 1
    from public.movement_series s
    where s.id = p_series_id and s.user_id = v_user_id;

    if not found then
      raise exception 'Invalid series for current user';
    end if;
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

      insert into public.movement (
        amount, description, done_at, type, "from", category, user_id,
        balance_after, transfer_group_id, applied, series_id, installment_index
      )
      values (
        -v_abs_amount, p_description, p_done_at, p_type, p_from, null, v_user_id,
        null, v_group_id, p_applied, p_series_id, p_installment_index
      )
      returning id into v_target_movement_id;

      insert into public.movement (
        amount, description, done_at, type, "from", category, user_id,
        balance_after, transfer_group_id, applied, series_id, installment_index
      )
      values (
        v_abs_amount, p_description, p_done_at, p_type, p_where, null, v_user_id,
        null, v_group_id, p_applied, p_series_id, p_installment_index
      );

      if p_applied then
        update public.account set balance = balance - v_abs_amount where id = p_from and user_id = v_user_id;
        update public.account set balance = balance + v_abs_amount where id = p_where and user_id = v_user_id;
        perform public.recalculate_balance_after_for_account(v_user_id, p_from);
        perform public.recalculate_balance_after_for_account(v_user_id, p_where);
      end if;

      return v_target_movement_id;
    end if;

    if p_category is null then
      raise exception 'p_category is required for income/expense';
    end if;

    v_signed_amount := case when p_type = 'expense' then -abs(p_amount) else abs(p_amount) end;

    insert into public.movement (
      amount, description, done_at, type, "from", category, user_id,
      balance_after, applied, series_id, installment_index
    )
    values (
      v_signed_amount, p_description, p_done_at, p_type, p_from, p_category, v_user_id,
      null, p_applied, p_series_id, p_installment_index
    )
    returning id into v_target_movement_id;

    if p_applied then
      update public.account set balance = balance + v_signed_amount where id = p_from and user_id = v_user_id;
      perform public.recalculate_balance_after_for_account(v_user_id, p_from);
    end if;

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

      -- Revert previous balances only if they were applied
      if v_out_leg.applied then
        update public.account
        set balance = balance - v_out_leg.amount
        where id = v_old_from and user_id = v_user_id;

        update public.account
        set balance = balance - v_in_leg.amount
        where id = v_old_where and user_id = v_user_id;
      end if;

      update public.movement
      set amount      = -v_abs_amount,
          description = p_description,
          done_at     = p_done_at,
          type        = 'transfer',
          "from"      = p_from,
          category    = null,
          applied     = p_applied,
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
          applied     = p_applied,
          updated_at  = now()
      where id = v_in_leg.id
        and user_id = v_user_id;

      if p_applied then
        update public.account
        set balance = balance - v_abs_amount
        where id = p_from and user_id = v_user_id;

        update public.account
        set balance = balance + v_abs_amount
        where id = p_where and user_id = v_user_id;
      end if;

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

    if v_previous.applied then
      update public.account
      set balance = balance - v_previous.amount
      where id = v_previous."from" and user_id = v_user_id;
    end if;

    update public.movement
    set amount      = v_signed_amount,
        description = p_description,
        done_at     = p_done_at,
        type        = p_type,
        "from"      = p_from,
        category    = p_category,
        applied     = p_applied,
        updated_at  = now()
    where id = p_movement_id
      and user_id = v_user_id
    returning id into v_target_movement_id;

    if p_applied then
      update public.account
      set balance = balance + v_signed_amount
      where id = p_from and user_id = v_user_id;
    end if;

    perform public.recalculate_balance_after_for_account(v_user_id, v_previous."from");
    if v_previous."from" != p_from then
      perform public.recalculate_balance_after_for_account(v_user_id, p_from);
    end if;

    return v_target_movement_id;
  end if;
end;
$$;
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
-- Daily job: apply due unapplied movements and enqueue next recurring occurrence.
-- Intended to be called with the service role (auth.uid() may be null).

CREATE OR REPLACE FUNCTION public.add_frequency_interval(
  p_date date,
  p_frequency text
)
RETURNS date
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE p_frequency
    WHEN 'weekly' THEN (p_date + interval '7 days')::date
    WHEN 'biweekly' THEN (p_date + interval '14 days')::date
    WHEN 'monthly' THEN (p_date + interval '1 month')::date
    WHEN 'yearly' THEN (p_date + interval '1 year')::date
    ELSE p_date
  END;
$$;

CREATE OR REPLACE FUNCTION public.apply_due_movements()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_today date := (timezone('utc', now()))::date;
  v_row record;
  v_series public.movement_series%rowtype;
  v_next_date date;
  v_applied_count integer := 0;
  v_out_leg public.movement%rowtype;
  v_in_leg public.movement%rowtype;
begin
  for v_row in
    select m.*
    from public.movement m
    where m.applied = false
      and (m.done_at at time zone 'utc')::date <= v_today
      and (
        m.type <> 'transfer'
        or m.amount < 0
        or m.transfer_group_id is null
      )
    order by m.done_at asc, m.id asc
    for update of m skip locked
  loop
    if v_row.type = 'transfer' and v_row.transfer_group_id is not null then
      select * into v_out_leg
      from public.movement m
      where m.transfer_group_id = v_row.transfer_group_id
        and m.amount < 0
      for update;

      select * into v_in_leg
      from public.movement m
      where m.transfer_group_id = v_row.transfer_group_id
        and m.amount > 0
      for update;

      if v_out_leg.applied then
        continue;
      end if;

      update public.movement
      set applied = true, updated_at = now()
      where transfer_group_id = v_row.transfer_group_id;

      update public.account
      set balance = balance + v_out_leg.amount
      where id = v_out_leg."from" and user_id = v_out_leg.user_id;

      update public.account
      set balance = balance + v_in_leg.amount
      where id = v_in_leg."from" and user_id = v_in_leg.user_id;

      perform public.recalculate_balance_after_for_account(v_out_leg.user_id, v_out_leg."from");
      if v_in_leg."from" <> v_out_leg."from" then
        perform public.recalculate_balance_after_for_account(v_in_leg.user_id, v_in_leg."from");
      end if;
    else
      if v_row.applied then
        continue;
      end if;

      update public.movement
      set applied = true, updated_at = now()
      where id = v_row.id;

      update public.account
      set balance = balance + v_row.amount
      where id = v_row."from" and user_id = v_row.user_id;

      perform public.recalculate_balance_after_for_account(v_row.user_id, v_row."from");
    end if;

    v_applied_count := v_applied_count + 1;

    if v_row.series_id is null then
      continue;
    end if;

    select * into v_series
    from public.movement_series s
    where s.id = v_row.series_id
    for update;

    if not found or v_series.status <> 'active' then
      continue;
    end if;

    if v_series.kind = 'installment' then
      if v_row.installment_index is not null
         and v_series.installment_count is not null
         and v_row.installment_index >= v_series.installment_count then
        update public.movement_series
        set status = 'completed', updated_at = now()
        where id = v_series.id;
      end if;
      continue;
    end if;

    -- recurring: create exactly one next occurrence if still in range
    v_next_date := public.add_frequency_interval(
      (v_row.done_at at time zone 'utc')::date,
      v_series.frequency
    );

    if v_series.end_date is not null and v_next_date > v_series.end_date then
      update public.movement_series
      set status = 'completed', updated_at = now()
      where id = v_series.id;
      continue;
    end if;

    -- Avoid duplicate next row if one already exists unapplied/future
    if exists (
      select 1
      from public.movement m
      where m.series_id = v_series.id
        and m.applied = false
        and m.id <> v_row.id
    ) then
      continue;
    end if;

    insert into public.movement (
      amount, description, done_at, type, "from", category, user_id,
      balance_after, applied, series_id
    )
    values (
      v_series.amount * -1,
      v_series.description,
      v_next_date::timestamptz,
      'expense',
      v_series."from",
      v_series.category,
      v_series.user_id,
      null,
      false,
      v_series.id
    );
  end loop;

  return v_applied_count;
end;
$$;

REVOKE ALL ON FUNCTION public.apply_due_movements() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_due_movements() TO service_role;
