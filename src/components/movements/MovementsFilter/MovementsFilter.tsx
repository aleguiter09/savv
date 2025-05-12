import SelectAccount from "@/components/home/ActionBar/SelectAccount";
import SelectDateClient from "./SelectDateClient";
import SelectCategory from "./SelectCategory";

export default function MovementsFilter({
  from,
  to,
  categoryId,
}: Readonly<{
  from: Date;
  to: Date;
  categoryId: number;
}>) {
  return (
    <div className="mb-4 flex flex-col gap-2">
      <SelectDateClient from={from} to={to} />
      <div className="flex items-center gap-2">
        <SelectAccount containerClassName="w-full max-w-none" />
        <SelectCategory
          categoryId={categoryId}
          containerClassName="w-full max-w-none"
        />
      </div>
    </div>
  );
}
