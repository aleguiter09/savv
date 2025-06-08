import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AddButton({ href }: Readonly<{ href: string }>) {
  return (
    <Link tabIndex={0} aria-label="Add movement" href={href}>
      <PlusIcon
        size={32}
        className="rounded-full bg-blue-600 p-2 text-white focus:outline-none focus:ring focus:ring-blue-300 shadow-md"
      />
    </Link>
  );
}
