"use client";
import {
  AlertDialog,
  AlertDialogCancel,
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
      <AlertDialogContent className="p-5">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className={cn("w-24")}>
            {t("cancel")}
          </AlertDialogCancel>
          <Button
            className={cn(
              "w-24",
              loading && "cursor-default hover:bg-blue-600 disabled:opacity-100"
            )}
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? (
              <output className="h-5 w-5 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white" />
            ) : (
              t("confirm")
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
