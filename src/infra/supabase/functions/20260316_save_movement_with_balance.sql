create or replace function public.recalculate_balance_after_for_account(
  p_user_id uuid,
  p_account_id integer
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
  v_effect numeric := 0;
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

  select coalesce(
    sum(
      case
        when m.type = 'income' and m."from" = p_account_id then m.amount
        when m.type = 'expense' and m."from" = p_account_id then -m.amount
        when m.type = 'transfer' and m."from" = p_account_id then -m.amount
        when m.type = 'transfer' and m."where" = p_account_id then m.amount
        else 0
      end
    ),
    0
  )
  into v_total_effect
  from public.movement m
  where m.user_id = p_user_id
    and (
      m."from" = p_account_id
      or (m.type = 'transfer' and m."where" = p_account_id)
    );

  v_opening_balance := v_current_balance - v_total_effect;
  v_running_balance := v_opening_balance;

  for v_row in
    select m.id, m.type, m.amount, m."from", m."where"
    from public.movement m
    where m.user_id = p_user_id
      and (
        m."from" = p_account_id
        or (m.type = 'transfer' and m."where" = p_account_id)
      )
    order by m.done_at asc, m.id asc
  loop
    v_effect := 0;

    if v_row.type = 'income' and v_row."from" = p_account_id then
      v_effect := v_row.amount;
    elsif v_row.type = 'expense' and v_row."from" = p_account_id then
      v_effect := -v_row.amount;
    elsif v_row.type = 'transfer' then
      if v_row."from" = p_account_id then
        v_effect := -v_row.amount;
      elsif v_row."where" = p_account_id then
        v_effect := v_row.amount;
      end if;
    end if;

    v_running_balance := v_running_balance + v_effect;

    if v_row."from" = p_account_id then
      update public.movement
      set balance_after = v_running_balance
      where id = v_row.id
        and user_id = p_user_id;
    end if;
  end loop;
end;
$$;

create or replace function public.save_movement_with_balance(
  p_movement_id integer,
  p_amount numeric,
  p_description text,
  p_done_at timestamptz,
  p_type public."movementType",
  p_from integer,
  p_where integer default null,
  p_category integer default null
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
  v_new_where integer := null;
  v_new_category integer := null;
  v_account_id integer;
  v_old_effect numeric := 0;
  v_new_effect numeric := 0;
  v_affected_accounts integer[] := '{}';
begin
  if v_user_id is null then
    raise exception 'Unauthenticated';
  end if;

  if p_type = 'transfer' then
    if p_where is null then
      raise exception 'where is required for transfer';
    end if;

    if p_where = p_from then
      raise exception 'transfer source and destination must be different';
    end if;

    v_new_where := p_where;
    v_new_category := null;
  else
    if p_category is null then
      raise exception 'category is required for income/expense';
    end if;

    v_new_where := null;
    v_new_category := p_category;
  end if;

  perform 1
  from public.account a
  where a.id = p_from
    and a.user_id = v_user_id;

  if not found then
    raise exception 'Invalid source account for current user';
  end if;

  if p_type = 'transfer' then
    perform 1
    from public.account a
    where a.id = p_where
      and a.user_id = v_user_id;

    if not found then
      raise exception 'Invalid destination account for current user';
    end if;
  end if;

  if p_movement_id > 0 then
    select *
    into v_previous
    from public.movement m
    where m.id = p_movement_id
      and m.user_id = v_user_id
    for update;

    if not found then
      raise exception 'Movement % not found for current user', p_movement_id;
    end if;

    update public.movement
    set amount = p_amount,
        description = p_description,
        done_at = p_done_at,
        type = p_type,
        "from" = p_from,
        "where" = v_new_where,
        category = v_new_category,
        updated_at = now()
    where id = p_movement_id
      and user_id = v_user_id
    returning id into v_target_movement_id;
  else
    insert into public.movement (
      amount,
      description,
      done_at,
      type,
      "from",
      "where",
      category,
      user_id,
      balance_after
    )
    values (
      p_amount,
      p_description,
      p_done_at,
      p_type,
      p_from,
      v_new_where,
      v_new_category,
      v_user_id,
      null
    )
    returning id into v_target_movement_id;
  end if;

  for v_account_id in
    select distinct acc_id
    from unnest(
      array_remove(
        array[
          case when p_movement_id > 0 then v_previous."from" else null end,
          case
            when p_movement_id > 0 and v_previous.type = 'transfer'
              then v_previous."where"
            else null
          end,
          p_from,
          case when p_type = 'transfer' then p_where else null end
        ],
        null
      )
    ) as acc_id
  loop
    v_old_effect := 0;
    v_new_effect := 0;

    if p_movement_id > 0 then
      if v_previous.type = 'income' and v_previous."from" = v_account_id then
        v_old_effect := v_previous.amount;
      elsif v_previous.type = 'expense' and v_previous."from" = v_account_id then
        v_old_effect := -v_previous.amount;
      elsif v_previous.type = 'transfer' then
        if v_previous."from" = v_account_id then
          v_old_effect := -v_previous.amount;
        elsif v_previous."where" = v_account_id then
          v_old_effect := v_previous.amount;
        end if;
      end if;
    end if;

    if p_type = 'income' and p_from = v_account_id then
      v_new_effect := p_amount;
    elsif p_type = 'expense' and p_from = v_account_id then
      v_new_effect := -p_amount;
    elsif p_type = 'transfer' then
      if p_from = v_account_id then
        v_new_effect := -p_amount;
      elsif p_where = v_account_id then
        v_new_effect := p_amount;
      end if;
    end if;

    update public.account
    set balance = balance + (v_new_effect - v_old_effect)
    where id = v_account_id
      and user_id = v_user_id;

    v_affected_accounts := array_append(v_affected_accounts, v_account_id);
  end loop;

  for v_account_id in
    select distinct acc_id
    from unnest(v_affected_accounts) as acc_id
  loop
    perform public.recalculate_balance_after_for_account(v_user_id, v_account_id);
  end loop;

  return v_target_movement_id;
end;
$$;

create or replace function public.delete_movement_with_balance(
  p_movement_id integer
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_previous public.movement%rowtype;
  v_account_id integer;
  v_effect numeric := 0;
  v_affected_accounts integer[] := '{}';
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

  for v_account_id in
    select distinct acc_id
    from unnest(
      array_remove(
        array[
          v_previous."from",
          case
            when v_previous.type = 'transfer' then v_previous."where"
            else null
          end
        ],
        null
      )
    ) as acc_id
  loop
    v_effect := 0;

    if v_previous.type = 'income' and v_previous."from" = v_account_id then
      v_effect := v_previous.amount;
    elsif v_previous.type = 'expense' and v_previous."from" = v_account_id then
      v_effect := -v_previous.amount;
    elsif v_previous.type = 'transfer' then
      if v_previous."from" = v_account_id then
        v_effect := -v_previous.amount;
      elsif v_previous."where" = v_account_id then
        v_effect := v_previous.amount;
      end if;
    end if;

    update public.account
    set balance = balance - v_effect
    where id = v_account_id
      and user_id = v_user_id;

    v_affected_accounts := array_append(v_affected_accounts, v_account_id);
  end loop;

  delete from public.movement
  where id = p_movement_id
    and user_id = v_user_id;

  for v_account_id in
    select distinct acc_id
    from unnest(v_affected_accounts) as acc_id
  loop
    perform public.recalculate_balance_after_for_account(v_user_id, v_account_id);
  end loop;
end;
$$;