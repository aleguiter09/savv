import Icon from "@/components/common/Icon";
import EditMovementForm from "@/components/movements/EditMovement/EditMovementForm";
import { getAccounts } from "@/services/accounts";
import {
  getExpenseCategories,
  getIncomeCategories,
} from "@/services/categories";
import { getMovementById } from "@/services/movements";
import { createClient } from "@/utils/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditMovementPage({
  params,
}: Readonly<{
  params: { id: string };
  searchParams: { confirm: string };
}>) {
  const id = params.id;
  const supabase = await createClient();
  const movement = await getMovementById(supabase, Number(id));

  if (!movement) {
    notFound();
  }

  const [accounts, expCategories, incCategories] = await Promise.all([
    getAccounts(supabase),
    getExpenseCategories(supabase),
    getIncomeCategories(supabase),
  ]);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Link href={`/movements/${id}`}>
          <Icon color="stone" icon="arrow-left" />
        </Link>
        <h4 className="font-medium">Edit Movement</h4>
        <span></span>
      </div>
      <EditMovementForm
        accounts={accounts}
        expenseCategories={expCategories}
        incomeCategories={incCategories}
        movement={movement}
      />
    </>
  );
}
