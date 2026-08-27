"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/modules/shared/utils/cn";
import { formatCurrency } from "@/modules/shared/utils/formatCurrency";

type AccountItem = Readonly<{
  id: number;
  name: string;
  balance: number;
}>;

type Props = Readonly<{
  accounts: AccountItem[];
  label: string;
  locale: string;
}>;

export function AccountsCollapse({ accounts, label, locale }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-1 text-left"
        aria-expanded={open}
      >
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-1.5 pt-1">
          {accounts.map((account) => (
            <div key={account.id} className="flex justify-between gap-2">
              <p className="text-xs text-muted-foreground mb-0">
                {account.name}
              </p>
              <p
                className={cn(
                  "text-xs font-medium tabular-nums",
                  account.balance < 0 && "text-red-500",
                )}
              >
                {formatCurrency(locale, account.balance, 2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
