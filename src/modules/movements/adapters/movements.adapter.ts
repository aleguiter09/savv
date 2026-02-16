import { getDefaultAccountId } from "@/modules/accounts/services/accounts";
import { Movement } from "@/modules/shared/types/global.types";
import type { MovementsPageProps } from "../pages/MovementsPage";
import type { MovementDetailProps } from "../ui/MovementDetail/MovementDetail";
import type { MovementItemProps } from "../ui/MovementsList/MovementItem";
import { MovementItemDetailProps } from "../ui/MovementsList/MovementItemDetail";

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

export const parseMovementDetails = (
  movement: Movement,
): MovementDetailProps => ({
  id: movement.id as number,
  done_at: movement.done_at,
  amount: movement.amount ?? 0,
  comment: movement.comment ?? "",
  type: movement.type,
  categoryTitle: movement.fullCategory?.title ?? "transfer",
  categoryIcon: movement.fullCategory?.icon ?? "transfer",
  categoryColor: movement.fullCategory?.color ?? "gray",
  accountName: movement.fullAccount?.name ?? "",
});

export const getMovementsByDay = (
  movements: Movement[],
): MovementItemProps[] => {
  const items: MovementItemProps[] = [];

  movements.forEach((m) => {
    const currentDate = items.find((item) => item.date === m.done_at);
    if (currentDate) {
      currentDate.items.push(adaptMovementItem(m));
      if (m.type === "expense") {
        currentDate.amount -= m.amount;
      } else {
        currentDate.amount += m.amount;
      }
    } else {
      items.push({
        date: m.done_at,
        items: [adaptMovementItem(m)],
        amount: m.type === "expense" ? -m.amount : m.amount,
      });
    }
  });

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

const adaptMovementItem = (movement: Movement): MovementItemDetailProps => ({
  id: movement.id as number,
  done_at: movement.done_at,
  amount: movement.amount ?? 0,
  comment: movement.comment ?? "",
  type: movement.type,
  translateCategory: !movement.fullCategory?.user_id,
  categoryTitle: movement.fullCategory?.title ?? "transfer",
  categoryIcon: movement.fullCategory?.icon ?? "transfer",
  categoryColor: movement.fullCategory?.color ?? "gray",
});
