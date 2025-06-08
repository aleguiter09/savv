"use client";
import { Dialog, DialogPanel } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { deleteMovementForm } from "@/utils/actions/movement-action";
import { Account, Movement } from "@/types/database";
import { useTranslations } from "next-intl";
import { deleteAccountForm } from "@/utils/actions/account-actions";

export default function ConfirmDialog({
  children,
  isOpen,
  button,
  movement,
  account,
  entity,
}: Readonly<{
  children: ReactNode;
  isOpen: boolean;
  button: ReactNode;
  movement?: Movement;
  account?: Account;
  entity: "movements" | "accounts";
}>) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.set("confirm", "false");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleOpen = () => {
    const params = new URLSearchParams(searchParams);
    params.set("confirm", "true");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (entity === "accounts" && account) {
        await deleteAccountForm(account);
      } else if (entity === "movements" && movement) {
        await deleteMovementForm(movement);
      }
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} static={true}>
        <DialogPanel>
          {children}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleClose}
              className="w-full rounded-md bg-gray-300 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring focus:ring-gray-blue"
            >
              {t("cancel")}
            </button>
            {loading ? (
              <div className="flex w-full justify-center rounded-md bg-blue-600 py-2">
                <output
                  className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white"
                  aria-live="polite"
                />
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white focus:outline-none focus:ring focus:ring-gray-blue"
              >
                {t("confirm")}
              </button>
            )}
          </div>
        </DialogPanel>
      </Dialog>
      <button onClick={handleOpen}>{button}</button>
    </>
  );
}
