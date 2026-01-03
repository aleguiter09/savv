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

export type CategoryIds = "all" | "incomes" | "expenses" | number;

export type AccountIds = "all" | number;

export type ServerActionResponse = {
  success: boolean;
  error?: string;
};
