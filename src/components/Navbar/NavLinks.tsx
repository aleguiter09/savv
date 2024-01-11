import React from "react";
import Link from "next/link";
import { CogIcon, HomeIcon } from "@heroicons/react/outline";
// import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
  },
];

export default function NavLinks() {
  // const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-12 grow items-center justify-center"
          >
            <LinkIcon className="w-6" />
          </Link>
        );
      })}
    </>
  );
}
