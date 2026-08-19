"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { MovementDialog } from "@/modules/movements/ui/MovementDialog";

const iconClasses =
  "rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700";
const wrapperClasses =
  "cursor-pointer rounded-full focus:outline-1 focus:outline-blue-600 focus:outline-offset-2 transition-all";

export function AddButton({ href }: Readonly<{ href?: string }>) {
  if (href) {
    return (
      <Link href={href} className={wrapperClasses}>
        <PlusIcon size={30} className={iconClasses} />
      </Link>
    );
  }

  return (
    <MovementDialog
      trigger={
        <button type="button" className={wrapperClasses}>
          <PlusIcon size={30} className={iconClasses} />
        </button>
      }
    />
  );
}
