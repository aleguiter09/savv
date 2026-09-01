import type { AccountDB } from "@/modules/shared/types/global.types";
import type { BudgetView } from "@/modules/budgets/types/types";
import type { CategoryView } from "@/modules/categories/types/types";
import type {
  MovementApi,
  MovementView,
} from "@/modules/movements/types/types";

export const FIXED_TODAY = new Date("2026-08-15T12:00:00.000Z");

function accountDb(
  overrides: Partial<AccountDB> & Pick<AccountDB, "id" | "name" | "balance">,
): AccountDB {
  return {
    created_at: "2026-01-01T00:00:00.000Z",
    user_id: "user-test",
    ...overrides,
  };
}

export function expenseMovementApi(
  overrides: Partial<MovementApi> = {},
): MovementApi {
  return {
    id: 1,
    amount: -45.5,
    description: "Supermercado",
    balance_after: 954.5,
    type: "expense",
    done_at: "2026-08-10T10:00:00.000Z",
    from: 1,
    applied: true,
    fullCategory: {
      id: 10,
      title: "Comida",
      icon: "shopping-cart",
      color: "green",
      parent_id: 20,
      is_global: true,
      is_custom_name: false,
      is_hidden: false,
    },
    fullAccount: accountDb({ id: 1, name: "Cuenta principal", balance: 954.5 }),
    ...overrides,
  };
}

export function transferMovementApi(
  overrides: Partial<MovementApi> = {},
): MovementApi {
  return {
    id: 2,
    amount: -500,
    description: "Ahorro mensual",
    balance_after: 500,
    type: "transfer",
    done_at: "2026-08-12T10:00:00.000Z",
    from: 1,
    applied: true,
    transfer_group_id: "tg-001",
    fullAccount: accountDb({ id: 1, name: "Cuenta principal", balance: 500 }),
    fullToAccount: accountDb({ id: 2, name: "Ahorros", balance: 1500 }),
    ...overrides,
  };
}

export function transferLegOut(overrides: Record<string, unknown> = {}) {
  return {
    id: 10,
    from: 1,
    amount: -500,
    description: "Ahorro mensual",
    done_at: "2026-08-12T10:00:00.000Z",
    balance_after: 500,
    applied: true,
    fullAccount: { id: 1, name: "Cuenta principal", balance: 500 },
    ...overrides,
  };
}

export function transferLegIn(overrides: Record<string, unknown> = {}) {
  return {
    id: 11,
    from: 2,
    amount: 500,
    description: "Ahorro mensual",
    done_at: "2026-08-12T10:00:00.000Z",
    balance_after: 1500,
    applied: true,
    fullAccount: { id: 2, name: "Ahorros", balance: 1500 },
    ...overrides,
  };
}

export function expenseMovementView(
  overrides: Partial<MovementView> = {},
): MovementView {
  return {
    id: 1,
    doneAt: "2026-08-10T10:00:00.000Z",
    amount: -45.5,
    description: "Supermercado",
    type: "expense",
    balanceAfter: 954.5,
    applied: true,
    account: { id: "1", name: "Cuenta principal", balance: 954.5 },
    category: {
      id: "10",
      title: "Comida",
      icon: "shopping-cart",
      color: "green",
      parentId: "20",
      isHidden: false,
      isGlobal: true,
      isCustomName: false,
    },
    ...overrides,
  } as MovementView;
}

export function categoryView(
  overrides: Partial<CategoryView> = {},
): CategoryView {
  return {
    id: "10",
    title: "Comida",
    icon: "shopping-cart",
    color: "green",
    parentId: "20",
    isHidden: false,
    isGlobal: true,
    isCustomName: false,
    ...overrides,
  };
}

export function budgetView(overrides: Partial<BudgetView> = {}): BudgetView {
  return {
    id: "1",
    categoryId: "10",
    amount: 300,
    categoryTitle: "Comida",
    categoryIcon: "shopping-cart",
    categoryColor: "green",
    isGlobal: true,
    isCustomName: false,
    ...overrides,
  };
}

export const validOnceExpensePayload = {
  type: "expense" as const,
  schedule: "once" as const,
  amount: 45.5,
  description: "Supermercado",
  done_at: "2026-08-10T12:00:00.000Z",
  from: 1,
  category: 10,
};

export const validIncomePayload = {
  type: "income" as const,
  amount: 1500,
  description: "Nómina",
  done_at: "2026-08-01T12:00:00.000Z",
  from: 1,
  category: 60,
};

export const validTransferPayload = {
  type: "transfer" as const,
  amount: 500,
  description: "Ahorro mensual",
  done_at: "2026-08-12T12:00:00.000Z",
  from: 1,
  where: 2,
};

export const validInstallmentPayload = {
  type: "expense" as const,
  schedule: "installment" as const,
  amount: 1200,
  description: "Portátil",
  done_at: "2026-08-01T12:00:00.000Z",
  from: 1,
  category: 10,
  installment_count: 12,
};

export const validRecurringPayload = {
  type: "expense" as const,
  schedule: "recurring" as const,
  amount: 50,
  description: "Gimnasio",
  done_at: "2026-08-01T12:00:00.000Z",
  from: 1,
  category: 10,
  frequency: "monthly" as const,
  end_date: "2027-08-01T12:00:00.000Z",
};
