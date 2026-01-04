import { Tables, Enums } from "./database.types";

export type MovementTypes = Enums<"movementType">;
export type CategoryColors = Enums<"categoryColors">;

export type MovementDB = Tables<"movement">;
export type CategoryDB = Tables<"category">;
export type AccountDB = Tables<"account">;
export type SettingsDB = Tables<"user_settings">;

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
  id: CategoryDB["id"];
  title: CategoryDB["title"];
  icon: CategoryDB["icon"];
  color: CategoryDB["color"];
  user_id?: CategoryDB["user_id"];
  parent_id?: CategoryDB["parent_id"];
};

export type Account = {
  id?: AccountDB["id"];
  name: AccountDB["name"];
  balance: AccountDB["balance"];
  is_default?: AccountDB["is_default"];
};
