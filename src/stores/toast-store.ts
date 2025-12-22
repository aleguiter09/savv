import { create } from "zustand";
import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning" | "default";

type ToastPayload = {
  type?: ToastType;
  message: string;
};

type ToastStore = {
  show: (payload: ToastPayload) => void;
};

export const useToastStore = create<ToastStore>(() => ({
  show: ({ type = "default", message }) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast(message);
    }
  },
}));
