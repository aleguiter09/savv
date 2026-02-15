"use client";
import Link from "next/link";
import { logout } from "@/modules/auth/actions/user-action";
import { usePathname } from "next/navigation";
import { Home, LogOutIcon, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

const links = [
  { key: "home", href: "/", icon: <Home /> },
  {
    key: "settings",
    href: "/settings",
    icon: <Settings />,
  },
];

export function NavLinks() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const activeLink = links.find((link) => link.href === pathname);

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.key}
            href={link.href}
            aria-label={t(link.key)}
            tabIndex={0}
            className={`flex h-12 grow items-center justify-center focus:ring-2 focus:ring-inset focus:ring-blue-600 ${
              activeLink?.href === link.href ? "text-blue-500" : ""
            }`}
          >
            {link.icon}
          </Link>
        );
      })}
      <form
        action={logout}
        className="flex h-12 grow items-center justify-center"
      >
        <button
          type="submit"
          tabIndex={0}
          aria-label={t("logout")}
          className="grow cursor-pointer h-full flex items-center justify-center focus:ring-2 focus:ring-inset focus:ring-blue-600"
        >
          <LogOutIcon />
        </button>
      </form>
    </>
  );
}
