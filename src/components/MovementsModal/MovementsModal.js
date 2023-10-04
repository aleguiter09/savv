import { createClient } from "@/utils/supabase-server";
import { getCategories } from "@/services/database";
import MovementsModalClient from "./MovementsModalClient";

export default async function MovementsModal() {
  const supabase = createClient();
  const { expCategories, incCategories } = await getCategories(supabase);

  return (
    <MovementsModalClient
      expenseCategories={expCategories}
      incomeCategories={incCategories}
    />
  );
}
