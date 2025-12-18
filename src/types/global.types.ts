import { Tables, Enums } from "./database.types";

export type MovementTypes = Enums<"movementType">;
export type CategoryColors = Enums<"categoryColors">;

type MovementDB = Tables<"movement">;
type CategoryDB = Tables<"category">;
type AccountDB = Tables<"account">;

export interface Movement {
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
}

export type Category = {
  id: CategoryDB["id"];
  title: CategoryDB["title"];
  icon: CategoryDB["icon"];
  color: CategoryDB["color"];
  user_id?: CategoryDB["user_id"];
  parent_id?: CategoryDB["parent_id"];
};

export interface Account {
  id?: AccountDB["id"];
  name: AccountDB["name"];
  balance: AccountDB["balance"];
  default?: AccountDB["default"];
}
