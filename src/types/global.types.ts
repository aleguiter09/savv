import { Database } from "./database.types";

export type MovementTypes = Database["public"]["Enums"]["movementType"];
export type CategoryColors = Database["public"]["Enums"]["categoryColors"];

type MovementDB = Database["public"]["Tables"]["movement"]["Row"];
type CategoryDB = Database["public"]["Tables"]["category"]["Row"];
type AccountDB = Database["public"]["Tables"]["account"]["Row"];

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
