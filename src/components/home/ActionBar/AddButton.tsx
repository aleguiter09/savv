import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React from "react";

export default function AddButton({ href }: Readonly<{ href: string }>) {
  return (
    <Link
      tabIndex={0}
      className="h-8 w-8 rounded-full bg-blue-600 p-2 text-white focus:outline-none focus:ring focus:ring-blue-300 shadow-md"
      href={href}
    >
      <PlusIcon />
    </Link>
  );
}
