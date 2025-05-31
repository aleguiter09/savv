import SelectAccount from "@/components/home/ActionBar/SelectAccount";

export default function ExpensesFilter({
  account,
}: Readonly<{ account: number }>) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount
        defaultAcc={account}
        containerClassName="w-full max-w-none"
      />
    </div>
  );
}
