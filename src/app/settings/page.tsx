import { ArrowRightIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function SettingsPage() {
  const links = [
    { name: "Accounts", href: "/settings/accounts " },
    { name: "Categories", href: "/settings/categories " },
  ];

  return (
    <>
      <h3 className="font-semibold mb-4">Settings</h3>
      <ul className="text-sm flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="w-full px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-blue-500 rounded-lg flex justify-between"
            >
              <p>{link.name}</p>
              <ArrowRightIcon className="w-4" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
