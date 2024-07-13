import { getAllCategories } from "@/services/categories";
import { createClient } from "@/utils/supabase-server";
import SelectCategoryClient from "./SelectCategoryClient";

export default async function SelectCategory({
  categoryId,
}: Readonly<{ categoryId: number }>) {
  const supabase = await createClient();
  const categories = await getAllCategories(supabase);

  return (
    <SelectCategoryClient
      categoryId={categoryId}
      categories={categories}
      containerClassName="w-full max-w-none"
    />
  );
}
