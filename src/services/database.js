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
