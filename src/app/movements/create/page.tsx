import AddMovementForm from "@/components/movements/AddMovementForm";
import { getAccounts } from "@/services/accounts";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/services/categories";
import { createClient } from "@/utils/supabase-server";

export default async function AddMovementPage() {
  const supabase = createClient();
  const [accounts, expCategories, incCategories] = await Promise.all([
    getAccounts(supabase),
    getExpenseCategories(supabase),
    getIncomeCategories(supabase),
  ]);

  return (
    <main className="mx-5 sm:w-[32rem] sm:self-center">
      <AddMovementForm
        accounts={accounts}
        expenseCategories={expCategories}
        incomeCategories={incCategories}
      />
    </main>
  );
}
