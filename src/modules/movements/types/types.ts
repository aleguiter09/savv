import type { AccountView } from "@/modules/accounts/types/types";
import type { CategoryView } from "@/modules/categories/types/types";
import type {
  AccountDB,
  EffectiveCategoryDB,
  MovementDB,
  MovementTypes,
} from "@/modules/shared/types/global.types";

export type MovementApi = {
  id: MovementDB["id"];
  from: MovementDB["from"];
  amount: MovementDB["amount"];
  description: MovementDB["description"];
  balance_after: MovementDB["balance_after"];
  type: MovementDB["type"];
  done_at: MovementDB["done_at"];
  fullAccount?: AccountDB;
  category?: MovementDB["category"];
  where?: MovementDB["where"];
  fullCategory?: EffectiveCategoryDB;
};

export type MovementView = {
  id: number;
  account: AccountView;
  description: string;
  amount: number;
  type: MovementTypes;
  doneAt: string;
  category: CategoryView;
  where?: AccountView;
};
