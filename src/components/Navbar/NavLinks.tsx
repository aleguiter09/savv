import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiCog,
  mdiCogOutline,
  mdiHome,
  mdiHomeOutline,
  mdiLogout,
} from "@mdi/js";
import { logout } from "@/utils/user-action";

const links = [
  { name: "Home", href: "/", icon: mdiHomeOutline, activeIcon: mdiHome },
  {
    name: "Settings",
    href: "/settings",
    icon: mdiCogOutline,
    activeIcon: mdiCog,
  },
];

export default function NavLinks() {
  // const pathname = usePathname();
  // const activeLink = links.find((link) => link.href === pathname);
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-12 grow items-center justify-center ${
              /*activeLink?.href === link.href ? "text-blue-500" : */ ""
            }`}
          >
            <Icon
              path={
                /*activeLink?.href === link.href ? link.activeIcon : */ link.icon
              }
              size="24px"
            />
          </Link>
        );
      })}
      <form
        action={logout}
        className="flex h-[48px] grow items-center justify-center"
      >
        <button type="submit">
          <Icon path={mdiLogout} size="24px" />
        </button>
      </form>
    </>
  );
}
