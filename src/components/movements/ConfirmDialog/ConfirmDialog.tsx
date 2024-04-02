"use client";
import { Dialog, DialogPanel } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { deleteMovementForm } from "@/utils/movement-action";
import { MovementDB } from "@/types/database";

export default function ConfirmDialog({
  children,
  isOpen,
  button,
  movement,
}: Readonly<{
  children: ReactNode;
  isOpen: boolean;
  button: ReactNode;
  movement: MovementDB;
}>) {
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
    await deleteMovementForm(movement);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} static={true}>
        <DialogPanel>
          {children}
          <div className="flex gap-2 mt-3">
            <button
              tabIndex={0}
              onClick={handleClose}
              className="w-full rounded-md bg-gray-300 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring focus:ring-gray-blue"
            >
              Close
            </button>
            <button
              tabIndex={0}
              onClick={handleConfirm}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white focus:outline-none focus:ring focus:ring-gray-blue"
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </Dialog>
      <button onClick={handleOpen}>{button}</button>
    </>
  );
}
