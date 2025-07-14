import { Database } from "./database.types";

export type MovementTypes = Database["public"]["Enums"]["movementType"];
export type CategoryColors = Database["public"]["Enums"]["categoryColors"];

export interface Movement {
  id?: number;
  from: number;
  amount: number;
  comment: string;
  category?: number | null;
  type: MovementTypes;
  done_at: string;
  where?: number | null;
  fullCategory?: Category;
  fullAccount?: Account;
}

export type Category = {
  id: number;
  title: string;
  icon: string | null;
  color: CategoryColors;
  parent_id?: number | null;
};

export interface Account {
  id?: number;
  name: string;
  balance: number;
  default?: boolean;
}
