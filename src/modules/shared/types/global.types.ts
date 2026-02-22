import { Tables, Enums } from "./database.types";

export type MovementTypes = Enums<"movementType">;
export type CategoryColors = Enums<"categoryColors">;

type MovementDB = Tables<"movement">;
type CategoryDB = Tables<"category">;
type AccountDB = Tables<"account">;
type UserCategoryDB = Tables<"user_category">;
type EffectiveCategoryDB = Tables<"effective_categories">;

export type Movement = {
  id?: MovementDB["id"];
  from: MovementDB["from"];
  amount: MovementDB["amount"];
  comment: MovementDB["comment"];
  category?: MovementDB["category"];
  type: MovementDB["type"];
  done_at: MovementDB["done_at"];
  where?: MovementDB["where"];
  fullCategory?: Category;
  fullAccount?: Account;
};

export type Category = {
  id?: CategoryDB["id"];
  title: CategoryDB["title"];
  icon: CategoryDB["icon"];
  color: CategoryDB["color"];
  user_id?: CategoryDB["user_id"];
  parent_id?: CategoryDB["parent_id"];
};

export type UserCategory = {
  id?: UserCategoryDB["id"];
  user_id?: UserCategoryDB["user_id"];
  category_id: UserCategoryDB["category_id"];
  is_hidden?: UserCategoryDB["is_hidden"];
  custom_name: UserCategoryDB["custom_name"];
  custom_icon: UserCategoryDB["custom_icon"];
  custom_color: UserCategoryDB["custom_color"];
};

export type Account = {
  id?: AccountDB["id"];
  name: AccountDB["name"];
  balance: AccountDB["balance"];
  is_default?: AccountDB["is_default"];
};

export type EffectiveCategory = {
  id: EffectiveCategoryDB["id"];
  title: EffectiveCategoryDB["title"];
  icon: EffectiveCategoryDB["icon"];
  color: EffectiveCategoryDB["color"];
  parent_id: EffectiveCategoryDB["parent_id"];
  is_hidden: EffectiveCategoryDB["is_hidden"];
  is_global: EffectiveCategoryDB["is_global"];
  is_custom_name: EffectiveCategoryDB["is_custom_name"];
};
