import { AccountDB } from "@/modules/shared/types/global.types";

export type AccountApi = {
  id: AccountDB["id"];
  name: AccountDB["name"];
  balance: AccountDB["balance"];
  is_default?: AccountDB["is_default"];
};

export type AccountView = {
  id: string;
  name: string;
  balance: number;
  isDefault: boolean;
};
