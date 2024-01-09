import SelectAccount from "./SelectAccount";
import AddButton from "./AddButton";
import { Suspense } from "react";
import { Select } from "@tremor/react";

export default async function ActionBar() {
  return (
    <div className="mb-4 flex justify-between items-center">
      <Suspense
        fallback={
          <Select className="max-w-[11rem] animate-pulse">
            <></>
          </Select>
        }
      >
        <SelectAccount />
      </Suspense>
      <AddButton href="/movements/create" />
    </div>
  );
}
