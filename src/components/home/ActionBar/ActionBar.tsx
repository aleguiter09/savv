import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";

export default async function ActionBar({
  defaultAcc,
}: Readonly<{ defaultAcc: number }>) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <SelectAccount defaultAcc={defaultAcc} />
      <AddButton href="/movements/create" />
    </div>
  );
}
