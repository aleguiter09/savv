import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function AddButton({ href }: Readonly<{ href: string }>) {
  const t = useTranslations("movements");

  return (
    <Link
      tabIndex={0}
      aria-label={t("addTitle")}
      href={href}
      className="rounded-full focus:outline-hidden focus:ring-3 focus:ring-gray-blue"
    >
      <PlusIcon
        size={30}
        className="rounded-full bg-blue-600 p-2 text-white shadow-md focus:outline-hidden focus:ring-3 focus:ring-gray-blue"
      />
    </Link>
  );
}
