"use client";

import { useTranslations } from "next-intl";
import { MovementDialog } from "@/modules/movements/ui/MovementDialog";
import { FloatingAddButton } from "./ActionBar/FloatingAddButton";
import { NavLinks } from "@/modules/shared/ui/Navbar/NavLinks";

export function AppNavbar() {
  const tMovements = useTranslations("movements");

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-t-gray-400 bg-white pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-5 max-w-lg sm:mx-auto flex">
        <NavLinks
          center={
            <MovementDialog
              trigger={
                <FloatingAddButton
                  className="-translate-y-3 shadow-lg"
                  aria-label={tMovements("addTitle")}
                />
              }
            />
          }
        />
      </div>
    </nav>
  );
}
