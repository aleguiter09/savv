"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/ui/button";
import { AccountDialog } from "./AccountDialog";
import { DeleteAccountButton } from "./DeleteAccountButton";
import type { AccountView } from "../types/types";

type AccountsListProps = {
  accounts: AccountView[];
};

export function AccountsList({ accounts }: AccountsListProps) {
  return (
    <ul className="text-sm flex flex-col gap-2">
      {accounts.map((account) => (
        <li
          key={account.id}
          className="w-full px-4 py-2 border border-gray-200 bg-white rounded-lg flex justify-between items-center"
        >
          <p>{account.name}</p>
          <div className="flex items-center gap-2">
            <AccountDialog
              account={account}
              trigger={
                <Button size="icon" variant="secondary">
                  <Pencil size={16} />
                </Button>
              }
            />
            <DeleteAccountButton
              id={Number(account.id)}
              name={account.name}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
