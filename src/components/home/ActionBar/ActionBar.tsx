import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";

export default async function ActionBar() {
  return (
    <div className="mb-4 flex justify-between items-center">
      <SelectAccount />
      <AddButton href="/movements/create" />
    </div>
  );
}
