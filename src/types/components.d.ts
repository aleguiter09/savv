import { Account, Category, Movement } from "./database";

export type FinanceItemProps = {
  date: string;
  items: Movement[];
  amount: number;
};

export type AddMovementFormProps = {
  accounts: Account[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  defaultAcc: number;
};

export type EditMovementFormProps = {
  accounts: Account[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  movement: Movement;
};

export type SelectAccountProps = {
  accounts: Account[];
  defaultAcc: number;
  containerClassName?: string;
};
