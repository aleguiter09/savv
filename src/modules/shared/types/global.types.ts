import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { Tables, Enums } from "./database.types";
import type { LucideProps } from "lucide-react";

export type MovementTypes = Enums<"movementType">;
export type CategoryColors = Enums<"categoryColors">;

export type MovementDB = Tables<"movement">;
export type CategoryDB = Tables<"category">;
export type AccountDB = Tables<"account">;
export type UserCategoryDB = Tables<"user_category">;
export type EffectiveCategoryDB = Tables<"effective_categories">;

export type YearMonth = { year: number; month: number };

export type CategoryIcons = {
  [key: string]: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type ServerActionResponse = {
  success: boolean;
  error?: string;
};
