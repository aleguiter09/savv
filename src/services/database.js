export const getMovements = async (supabase) => {
  const { data } = await supabase.from("movement").select();
  if (data) {
    const movements = [];
    for (const d of data) {
      const mov = await getCategorieById(supabase, d.category);

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

  return data;
};

export const getCategorieById = async (supabase, id) => {
  const { data } = await supabase
    .from("category")
    .select("id, color, title, icon, for")
    .eq("id", id)
    .single();

  return data;
};
