import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import React from "react";

export default function AddButton({ href }: { href: string }) {
  return (
    <Link
      className="h-8 w-8 rounded-full bg-blue-600 p-2 text-white"
      href={href}
    >
      <PlusIcon />
    </Link>
  );
}
