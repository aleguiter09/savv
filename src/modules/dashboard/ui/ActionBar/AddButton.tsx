import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function AddButton({ href }: Readonly<{ href: string }>) {
  return (
    <Link
      href={href}
      className="rounded-full focus:outline-1 focus:outline-blue-600 focus:outline-offset-2 transition-all"
    >
      <PlusIcon
        size={30}
        className="rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700"
      />
    </Link>
  );
}
