import Icon from "@/components/common/Icon";
import AddMovementForm from "@/components/movements/AddMovement/AddMovementForm";
import { getAccounts, getDefaultAccountId } from "@/services/accounts";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/services/categories";
import { createClient } from "@/utils/supabase-server";
import Link from "next/link";

export default async function AddMovementPage() {
  const supabase = await createClient();
  const [accounts, expCategories, incCategories, defaultAcc] =
    await Promise.all([
      getAccounts(supabase),
      getExpenseCategories(supabase),
      getIncomeCategories(supabase),
      getDefaultAccountId(supabase),
    ]);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href="/">
          <Icon color="stone" icon="arrow-left" />
        </Link>
        <h4 className="font-medium">Add Movement</h4>
        <span></span>
      </div>
      <AddMovementForm
        accounts={accounts}
        expenseCategories={expCategories}
        incomeCategories={incCategories}
        defaultAcc={defaultAcc}
      />
    </>
  );
}
