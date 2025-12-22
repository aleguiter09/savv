export type YearMonth = { year: number; month: number };

export type CategoryIcons = {
  [key: string]: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type FormState<T> = {
  errors?: T;
  message?: string | null;
};

export type FormAccountState = FormState<{
  name?: string[];
  balance?: string[];
  default?: string[];
}>;

export type FormCategoryState = FormState<{
  title?: string[];
  icon?: string[];
  color?: string[];
  parent_id?: string[];
}>;

export type FormMovementState = FormState<{
  amount?: string[];
  comment?: string[];
  done_at?: string[];
  category?: string[];
  from?: string[];
  where?: string[];
}>;

export type ResetFormUserState = FormState<{
  email?: string[];
}>;

export type UpdatePasswordFormUserState = FormState<{
  password?: string[];
  confirmPassword?: string[];
}>;

export type CategoryIds = "all" | "incomes" | "expenses" | number;

export type AccountIds = "all" | number;

export type ServerActionResponse = {
  success: boolean;
  error?: string;
};
