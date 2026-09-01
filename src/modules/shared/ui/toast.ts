import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning" | "default";

type ToastPayload = {
  type?: ToastType;
  message: string;
};

export function showToast({ type = "default", message }: ToastPayload) {
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
}
