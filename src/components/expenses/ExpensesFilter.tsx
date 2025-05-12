import SelectAccount from "@/components/home/ActionBar/SelectAccount";

export default function ExpensesFilter() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SelectAccount containerClassName="w-full max-w-none" />
    </div>
  );
}
