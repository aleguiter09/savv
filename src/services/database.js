export const getMovements = async (supabase) => {
  const response = await supabase.from("movement").select();
  return response.data ? response.data : [];
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
