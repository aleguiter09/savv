import type { MovementsPageProps } from "../pages/MovementsPage";
import type { MovementItemProps } from "../ui/MovementsList/MovementItem";
import type { MovementApi, MovementView } from "../types/types";
import { getDefaultAccountId } from "@/modules/accounts/services/accounts";

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

export const getMovementsByDay = (
  movements: MovementApi[],
): MovementItemProps[] => {
  const items: MovementItemProps[] = [];

  movements.forEach((m) => {
    const currentDate = items.find((item) => item.date === m.done_at);
    if (currentDate) {
      currentDate.items.push(adaptMovementItem(m));
      currentDate.amount += m.amount;
    } else {
      items.push({
        date: m.done_at,
        items: [adaptMovementItem(m)],
        amount: m.amount,
      });
    }
  });

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

export const adaptMovementItem = (movement: MovementApi): MovementView => {
  if (movement.type === "transfer") {
    return {
      id: movement.id,
      doneAt: movement.done_at,
      amount: movement.amount ?? 0,
      description: movement.description ?? "",
      type: movement.type,
      balanceAfter: movement.balance_after ?? 0,
      account: {
        id: movement.fullAccount?.id.toString() ?? "",
        name: movement.fullAccount?.name ?? "",
        balance: movement.fullAccount?.balance ?? 0,
        isDefault: movement.fullAccount?.is_default ?? false,
      },
      category: {
        id: "",
        title: "transfer",
        icon: "transfer",
        color: "gray",
        isGlobal: true,
        isCustomName: false,
        parentId: "",
        isHidden: false,
      },
    };
  }

  return {
    id: movement.id,
    doneAt: movement.done_at,
    amount: movement.amount ?? 0,
    description: movement.description ?? "",
    type: movement.type,
    balanceAfter: movement.balance_after ?? 0,
    account: {
      id: movement.fullAccount?.id.toString() ?? "",
      name: movement.fullAccount?.name ?? "",
      balance: movement.fullAccount?.balance ?? 0,
      isDefault: movement.fullAccount?.is_default ?? false,
    },
    category: {
      id: movement.fullCategory?.id?.toString() ?? "",
      title: movement.fullCategory?.title ?? "transfer",
      icon: movement.fullCategory?.icon ?? "transfer",
      color: movement.fullCategory?.color ?? "gray",
      isGlobal: movement.fullCategory?.is_global ?? false,
      isCustomName: movement.fullCategory?.is_custom_name ?? false,
      parentId: movement.fullCategory?.parent_id?.toString() ?? "",
      isHidden: movement.fullCategory?.is_hidden ?? false,
    },
  };
};
