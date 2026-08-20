import type { AccountView } from "@/modules/accounts/types/types";
import type { CategoryView } from "@/modules/categories/types/types";
import type {
  AccountDB,
  EffectiveCategoryDB,
  MovementDB,
} from "@/modules/shared/types/global.types";

export type MovementApi = {
  id: MovementDB["id"];
  amount: MovementDB["amount"];
  description: MovementDB["description"];
  balance_after: MovementDB["balance_after"];
  type: MovementDB["type"];
  done_at: MovementDB["done_at"];
  from: MovementDB["from"];
  transfer_group_id?: MovementDB["transfer_group_id"];
  fullAccount?: AccountDB;
  fullToAccount?: AccountDB;
  category?: MovementDB["category"];
  fullCategory?: EffectiveCategoryDB;
};

type BaseMovementView = {
  id: number;
  account: AccountView;
  description: string;
  amount: number;
  doneAt: string;
  balanceAfter: number;
};

type TransferView = BaseMovementView & {
  type: "transfer";
  category: CategoryView;
  toAccount?: AccountView;
  transferGroupId?: string | null;
};

type ExpenseView = BaseMovementView & {
  type: "expense";
  category: CategoryView;
};

type IncomeView = BaseMovementView & {
  type: "income";
  category: CategoryView;
};

export type MovementView = TransferView | ExpenseView | IncomeView;
