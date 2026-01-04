import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const links = [
  { name: "accounts", href: "/settings/accounts " },
  { name: "languages", href: "/settings/languages " },
  { name: "categories", href: "/settings/categories " },
];

export default async function SettingsPage() {
  const t = await getTranslations("settings");

  return (
    <>
      <h3 className="font-semibold mb-4">{t("title")}</h3>
      <ul className="text-sm flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              tabIndex={0}
              className="w-full px-4 py-2 border border-gray-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:text-blue-500 rounded-lg flex justify-between"
            >
              <p>{t(link.name)}</p>
              <ArrowRight className="w-4" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
