import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function AddMovementButton({ year, month }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 mt-6 flex justify-center">
      <Link
        className="mb-2 h-12 w-12 rounded-full bg-blue-600 p-3 text-white"
        href={{
          pathname: "/add-movement",
          query: { year: year, month: month },
        }}
      >
        <PlusIcon />
      </Link>
    </div>
  );
}
