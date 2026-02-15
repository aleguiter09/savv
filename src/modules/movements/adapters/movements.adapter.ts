import { getDefaultAccountId } from "@/modules/accounts/services/accounts";
import { type MovementsPageProps } from "../pages/MovementsPage";
import { Movement } from "@/modules/shared/types/global.types";
import { MovementDetailProps } from "../ui/MovementDetail/MovementDetail";

export async function parseMovementsSearchParams(
  searchParams: MovementsPageProps,
): Promise<{
  accountId: string;
  categoryId: string;
  from: Date;
  to: Date;
}> {
  const { from, to, account, category } = searchParams;

  const defaultAcc = await getDefaultAccountId();
  const defaultAccountId = defaultAcc === "0" ? "all" : defaultAcc.toString();
  const accountId = account ?? defaultAccountId;

  const categoryId = category ?? "all";

  const parsedFrom = from
    ? new Date(from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const parsedTo = to ? new Date(to) : new Date();

  return { accountId, categoryId, from: parsedFrom, to: parsedTo };
}

export function parseMovementDetails(movement: Movement): MovementDetailProps {
  return {
    id: movement.id as number,
    done_at: movement.done_at,
    amount: movement.amount ?? 0,
    comment: movement.comment ?? "",
    type: movement.type,
    categoryTitle: movement.fullCategory?.title ?? "transfer",
    categoryIcon: movement.fullCategory?.icon ?? "transfer",
    categoryColor: movement.fullCategory?.color ?? "gray",
    accountName: movement.fullAccount?.name ?? "",
  };
}
