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
