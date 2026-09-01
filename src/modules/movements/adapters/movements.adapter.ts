import type { MovementsPageProps } from "../pages/MovementsPage";
import type { MovementsDayGroupProps } from "../ui/MovementsList/MovementsDayGroup";
import type { MovementApi, MovementView } from "../types/types";

export const MOVEMENTS_PAGE_SIZE = 30;

type JoinField<T> = T | T[] | null | undefined;

function unwrapJoin<T>(value: JoinField<T> | unknown): T | undefined {
  if (Array.isArray(value)) {
    return value[0] as T;
  }

  return (value ?? undefined) as T | undefined;
}

export function mapMovementApiRow(
  item: Record<string, unknown>,
): MovementApi {
  return {
    ...item,
    fullCategory: unwrapJoin(item.fullCategory),
    fullAccount: unwrapJoin(item.fullAccount),
    fullToAccount: unwrapJoin(item.fullToAccount),
  } as MovementApi;
}

export function mapMovementApiRows(
  data: Array<Record<string, unknown>> | null,
): MovementApi[] {
  if (!data) {
    return [];
  }

  return data.map(mapMovementApiRow);
}

export async function parseMovementsSearchParams(
  searchParams: MovementsPageProps,
): Promise<{
  accountId: string;
  categoryId: string;
  from: Date;
  to: Date;
  page: number;
}> {
  const { from, to, account, category, page } = searchParams;

  const accountId = account ?? "all";
  const categoryId = category ?? "all";
  const parsedPage = Math.max(1, Number(page) || 1);

  const parsedFrom = from
    ? new Date(from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const parsedTo = to ? new Date(to) : new Date();

  return {
    accountId,
    categoryId,
    from: parsedFrom,
    to: parsedTo,
    page: parsedPage,
  };
}

export const getMovementsByDay = (
  movements: MovementApi[],
): MovementsDayGroupProps[] => {
  const items: MovementsDayGroupProps[] = [];

  movements.forEach((m) => {
    const dateKey = m.done_at.slice(0, 10);
    const currentDate = items.find((item) => item.date === dateKey);
    if (currentDate) {
      currentDate.items.push(adaptMovementItem(m));
      currentDate.amount += m.amount;
    } else {
      items.push({
        date: dateKey,
        items: [adaptMovementItem(m)],
        amount: m.amount,
      });
    }
  });

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};

const adaptAccount = (account?: MovementApi["fullAccount"]) => ({
  id: account?.id.toString() ?? "",
  name: account?.name ?? "",
  balance: account?.balance ?? 0,
});

export const adaptMovementItem = (movement: MovementApi): MovementView => {
  if (movement.type === "transfer") {
    return {
      id: movement.id,
      doneAt: movement.done_at,
      amount: movement.amount ?? 0,
      description: movement.description ?? "",
      type: movement.type,
      balanceAfter: movement.balance_after ?? 0,
      applied: movement.applied ?? true,
      seriesId: movement.series_id ?? null,
      installmentIndex: movement.installment_index ?? null,
      account: adaptAccount(movement.fullAccount),
      toAccount: movement.fullToAccount
        ? adaptAccount(movement.fullToAccount)
        : undefined,
      transferGroupId: movement.transfer_group_id ?? null,
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
    applied: movement.applied ?? true,
    seriesId: movement.series_id ?? null,
    installmentIndex: movement.installment_index ?? null,
    account: adaptAccount(movement.fullAccount),
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
