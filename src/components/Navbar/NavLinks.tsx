"use client";
import Link from "next/link";
import { logout } from "@/utils/actions/user-action";
import { usePathname } from "next/navigation";
import { Home, LogOutIcon, Settings } from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: <Home /> },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
];

export function NavLinks() {
  const pathname = usePathname();
  const activeLink = links.find((link) => link.href === pathname);

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-label={link.name}
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
        className="flex h-[48px] grow items-center justify-center"
      >
        <button
          type="submit"
          tabIndex={0}
          aria-label="Logout"
          className="grow h-full flex items-center justify-center focus:ring-2 focus:ring-inset focus:ring-blue-600"
        >
          <LogOutIcon />
        </button>
      </form>
    </>
  );
}
