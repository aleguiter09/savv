"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet";

type FormDialogProps = {
  trigger: ReactNode;
  title: string;
  children: (ctx: { onSuccess: () => void }) => ReactNode;
};

const contentClassName =
  "max-h-[90dvh] overflow-y-auto rounded-lg sm:mx-auto sm:max-w-md!";

function isPortaledOverlayTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("[data-radix-popper-content-wrapper]"))
  );
}

export function FormDialog({
  trigger,
  title,
  children,
}: Readonly<FormDialogProps>) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSuccess = () => setOpen(false);
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const dismissGuards = {
    onPointerDownOutside: (e: {
      preventDefault: () => void;
      target: EventTarget | null;
    }) => {
      if (isPortaledOverlayTarget(e.target)) e.preventDefault();
    },
    onInteractOutside: (e: {
      preventDefault: () => void;
      target: EventTarget | null;
    }) => {
      if (isPortaledOverlayTarget(e.target)) e.preventDefault();
    },
  };

  // Avoid SSR/client mismatch and Dialog↔Sheet remount before hydration.
  if (!mounted) {
    return <>{trigger}</>;
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          className={`max-w-full rounded-t-lg ${contentClassName}`}
          {...dismissGuards}
        >
          {children({ onSuccess: handleSuccess })}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={`max-w-[95%]! ${contentClassName}`}
        {...dismissGuards}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children({ onSuccess: handleSuccess })}
      </DialogContent>
    </Dialog>
  );
}
