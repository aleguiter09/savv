import AddMovementForm from "@/components/movements/AddMovement/AddMovementForm";
import { getAccounts, getDefaultAccountId } from "@/services/accounts";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/services/categories";
import { createClient } from "@/utils/supabase-server";

export default async function AddMovementPage() {
  const supabase = createClient();
  const [accounts, expCategories, incCategories, defaultAcc] =
    await Promise.all([
      getAccounts(supabase),
      getExpenseCategories(supabase),
      getIncomeCategories(supabase),
      getDefaultAccountId(supabase),
    ]);

  return (
    <AddMovementForm
      accounts={accounts}
      expenseCategories={expCategories}
      incomeCategories={incCategories}
      defaultAcc={defaultAcc}
    />
  );
}
