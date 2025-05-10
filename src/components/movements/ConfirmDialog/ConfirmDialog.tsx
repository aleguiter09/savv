"use client";
import { Dialog, DialogPanel } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useTransition } from "react";
import { deleteMovementForm } from "@/utils/movement-action";
import { Movement } from "@/types/database";

export default function ConfirmDialog({
  children,
  isOpen,
  button,
  movement,
}: Readonly<{
  children: ReactNode;
  isOpen: boolean;
  button: ReactNode;
  movement: Movement;
}>) {
  const [pending, startTransition] = useTransition();
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
    startTransition(async () => {
      await deleteMovementForm(movement);
    });
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
              Close
            </button>
            {pending ? (
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
                Confirm
              </button>
            )}
          </div>
        </DialogPanel>
      </Dialog>
      <button onClick={handleOpen}>{button}</button>
    </>
  );
}
