"use client";
import Link from "next/link";
import { logout } from "@/modules/auth/actions/user-action";
import { usePathname } from "next/navigation";
import { ChartArea, Home, LogOutIcon, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "../../utils/cn";
import { MovementDialog } from "@/modules/movements/ui/MovementDialog";
import { FloatingAddButton } from "@/modules/dashboard/ui/ActionBar/FloatingAddButton";

const leftLinks = [
  { key: "home", href: "/home", icon: <Home /> },
  { key: "analytics", href: "/analytics", icon: <ChartArea /> },
];

const rightLinks = [{ key: "settings", href: "/settings", icon: <Settings /> }];

export function NavLinks() {
  const t = useTranslations("common.nav");
  const tMovements = useTranslations("movements");
  const pathname = usePathname();
  const allLinks = [...leftLinks, ...rightLinks];
  const activeLink =
    allLinks.find(
      (link) => link.href !== "/home" && pathname.startsWith(link.href),
    )?.href ?? leftLinks[0].href;

  const renderLink = (link: (typeof leftLinks)[number]) => (
    <Link
      key={link.key}
      href={link.href}
      aria-label={t(link.key)}
      tabIndex={0}
      className={cn(
        "flex h-12 grow items-center justify-center focus:ring-2 focus:ring-inset focus:ring-blue-600",
        activeLink === link.href && "text-blue-500",
      )}
      aria-current={activeLink === link.href ? "page" : undefined}
    >
      {link.icon}
    </Link>
  );

  return (
    <>
      {leftLinks.map(renderLink)}

      <div className="flex h-12 grow items-center justify-center">
        <MovementDialog
          trigger={
            <FloatingAddButton
              className="-translate-y-3 shadow-lg"
              aria-label={tMovements("addTitle")}
            />
          }
        />
      </div>

      {rightLinks.map(renderLink)}

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
