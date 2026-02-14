import { getDefaultAccountId } from "@/modules/accounts/services/accounts";
import { type MovementsPageProps } from "../pages/MovementsPage";

export async function parseMovementsSearchParams(
  searchParams: MovementsPageProps["searchParams"],
): Promise<{
  accountId: string;
  categoryId: string;
  from: Date;
  to: Date;
}> {
  const defaultAcc = await getDefaultAccountId();

  const accountId =
    searchParams.account ?? (defaultAcc === 0 ? "all" : defaultAcc.toString());

  const categoryId = searchParams.category ?? "all";

  const from = searchParams.from
    ? new Date(searchParams.from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const to = searchParams.to ? new Date(searchParams.to) : new Date();

  return { accountId, categoryId, from, to };
}
