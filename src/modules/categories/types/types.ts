import {
  EffectiveCategoryDB,
  UserCategoryDB,
} from "@/modules/shared/types/global.types";

export type CategoryApi = {
  id: EffectiveCategoryDB["id"];
  title: EffectiveCategoryDB["title"];
  icon: EffectiveCategoryDB["icon"];
  color: EffectiveCategoryDB["color"];
  parent_id: EffectiveCategoryDB["parent_id"];
  is_hidden: EffectiveCategoryDB["is_hidden"];
  is_global: EffectiveCategoryDB["is_global"];
  is_custom_name: EffectiveCategoryDB["is_custom_name"];
};

export type UserCategoryApi = {
  id?: UserCategoryDB["id"];
  user_id?: UserCategoryDB["user_id"];
  category_id: UserCategoryDB["category_id"];
  is_hidden?: UserCategoryDB["is_hidden"];
  custom_name: UserCategoryDB["custom_name"];
  custom_icon: UserCategoryDB["custom_icon"];
  custom_color: UserCategoryDB["custom_color"];
};

export type CategoryView = {
  id: string;
  title: string;
  icon: string;
  color: string;
  parentId: string | null;
  isHidden: boolean;
  isGlobal: boolean;
  isCustomName: boolean;
};
