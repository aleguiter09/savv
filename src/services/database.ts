export const getMovementsByMonthAndYear = async (supabase, year, month) => {
  const initialDate = new Date(year, month).toISOString();
  const partialDate = new Date(year, month + 1, 1);
  const finishDate = new Date(partialDate - 1).toISOString();
  const { data } = await supabase
    .from("movement")
    .select()
    .gte("done_at", initialDate)
    .lte("done_at", finishDate);

  if (data) {
    const movements = [];
    for (const d of data) {
      const mov = await getCategoryById(supabase, d.category);

      d.fullCategory = mov;
      movements.push(d);
    }

    return data;
  }
  return [];
};

export const insertMovement = async (supabase, movement) => {
  return await supabase.from("movement").insert(movement);
};

export const deleteMovement = async (supabase, movementId) => {
  return await supabase.from("movement").delete().eq("id", movementId);
};

export const updateMovement = async (supabase, movement, movementId) => {
  return await supabase.from("movement").update(movement).eq("id", movementId);
};

export const getCategories = async (supabase) => {
  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for");

  const expCategories = data.filter((c) => c.for === "expense");
  const incCategories = data.filter((c) => c.for === "income");

  return { expCategories, incCategories };
};

export const getCategoryById = async (supabase, id) => {
  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for")
    .eq("id", id)
    .single();

  return data;
};

export const getBalanceByMonthYear = async (supabase, month, year) => {
  const { data } = await supabase
    .from("balance_by_month")
    .select("total_incomes, total_expenses, current_total")
    .eq("month", month)
    .eq("year", year)
    .single();

  return data ?? { total_expenses: 0, total_incomes: 0, current_total: 0 };
};

export const upsertBalanceByMonthYear = async (
  supabase,
  month,
  year,
  amount,
  type,
) => {
  const { data } = await supabase
    .from("balance_by_month")
    .select()
    .eq("month", month)
    .eq("year", year);

  if (data.length > 0) {
    const balance = data[0];
    if (type === "expense") {
      balance.total_expenses += amount;
      balance.current_total -= amount;
    } else {
      balance.total_incomes += amount;
      balance.current_total += amount;
    }

    await updateBalanceByMonthYear(supabase, balance, balance.id);
    if (year !== new Date().getFullYear() || month !== new Date().getMonth()) {
      await updateForwardBalance(supabase, month, year, amount, type);
    }
    return;
  } else {
    const total_expenses = type === "expense" ? amount : 0;
    const total_incomes = type === "income" ? amount : 0;
    let current_total = total_incomes - total_expenses;

    let previousMonthBalance;
    if (month === 0) {
      previousMonthBalance = await getBalanceByMonthYear(
        supabase,
        11,
        year - 1,
      );
    } else {
      previousMonthBalance = await getBalanceByMonthYear(
        supabase,
        month - 1,
        year,
      );
    }

    const newBalance = {
      month,
      year,
      total_expenses,
      total_incomes,
      current_total: current_total + previousMonthBalance.current_total,
    };

    await insertBalanceByMonthYear(supabase, newBalance);
    if (year !== new Date().getFullYear() || month !== new Date().getMonth()) {
      await updateForwardBalance(supabase, month, year, amount, type);
    }
  }
};

export const insertBalanceByMonthYear = async (supabase, newBalance) => {
  return await supabase.from("balance_by_month").insert(newBalance);
};

export const updateBalanceByMonthYear = async (
  supabase,
  balance,
  balanceId,
) => {
  return await supabase
    .from("balance_by_month")
    .update(balance)
    .eq("id", balanceId);
};

export const updateForwardBalance = async (
  supabase,
  month,
  year,
  amount,
  type,
) => {
  const monthsDiff =
    Math.abs(year - new Date().getFullYear()) * 12 +
    Math.abs(month - new Date().getMonth());

  let currentMonth = month;
  let currentYear = year;
  for (let i = 0; i < monthsDiff; i++) {
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear += 1;
    } else {
      currentMonth += 1;
    }

    const { data } = await supabase
      .from("balance_by_month")
      .select()
      .eq("month", currentMonth)
      .eq("year", currentYear);

    if (data.length > 0) {
      const balance = data[0];
      if (type === "expense") {
        balance.current_total -= amount;
      } else {
        balance.current_total += amount;
      }

      await updateBalanceByMonthYear(supabase, balance, balance.id);
    }
  }
};
