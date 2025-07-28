"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";

type Props = Readonly<{
  children?: React.ReactNode;
  deleteAction: () => Promise<void>;
}>;

export function ConfirmDelete({ children, deleteAction }: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await deleteAction();
      setOpen(false);
    } catch (error) {
      console.error("Error deleting entity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Trash2 className="cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent className="p-4.5">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 justify-end">
          <Button
            variant="outline"
            disabled={loading}
            className={cn("w-24")}
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            className="w-24"
            loading={loading}
            disabled={loading}
            onClick={handleConfirm}
          >
            {t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
