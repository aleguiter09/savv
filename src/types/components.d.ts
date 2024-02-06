import { AccountDB, MovementDB } from "./database";

export type FinanceItemProps = {
  date: string;
  items: MovementDB[];
  amount: number;
};

export type AddMovementFormProps = {
  accounts: AccountDB[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  defaultAcc: number;
};

export type SelectAccountProps = {
  accounts: AccountDB[];
  defaultAcc: number;
};

export type BalanceProps = {
  account: number;
};
