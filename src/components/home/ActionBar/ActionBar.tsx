import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";

export default async function ActionBar({
  account,
}: Readonly<{ account: number }>) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <SelectAccount defaultAcc={account} />
      <AddButton href="/movements/create" />
    </div>
  );
}
