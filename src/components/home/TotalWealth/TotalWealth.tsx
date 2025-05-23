"use client";
import { useData } from "@/providers/DataProvider";
import { Card } from "@tremor/react";

export default function TotalWealth() {
  const { accounts } = useData();

  const totalWealth = accounts.reduce((acc, account) => {
    return acc + account.balance;
  }, 0);

  return (
    <Card className="mb-4 pl-4 pr-3 py-2 shadow-md flex flex-col gap-1">
      <h5 className="font-medium text-xs">Total wealth:</h5>
      <p className="text-2xl font-semibold">${totalWealth.toFixed(2)}</p>
      <div className="flex flex-col gap-1 mt-2">
        {accounts.map((account) => (
          <div key={account.id} className="flex justify-between">
            <p className="text-xs mb-0">{account.name}:</p>
            <p
              className={`text-xs ${account.balance > 0 ? "" : "text-red-500"}`}
            >
              $ {account.balance.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
