import SelectAccount from "@/components/home/ActionBar/SelectAccount";

export default function ExpensesFilter({
  accountId,
}: Readonly<{ accountId: number }>) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount
        defaultAcc={accountId}
        containerClassName="w-full max-w-none"
      />
    </div>
  );
}
