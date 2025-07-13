import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function AddButton({ href }: Readonly<{ href: string }>) {
  return (
    <Link
      tabIndex={0}
      aria-label="Add movement"
      href={href}
      className="rounded-full focus:outline-hidden focus:ring-3 focus:ring-gray-blue"
    >
      <PlusIcon
        size={32}
        className="rounded-full bg-blue-600 p-2 text-white shadow-md focus:outline-hidden focus:ring-3 focus:ring-gray-blue"
      />
    </Link>
  );
}
