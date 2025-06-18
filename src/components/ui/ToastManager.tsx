"use client";
import { CheckIcon } from "lucide-react";
import { Toaster } from "./sonner";
import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function ToastManager({ ...props }: ToasterProps) {
  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((row) => row.startsWith("toastMessage="))
      ?.split("=")[1];

    if (raw) {
      try {
        const { type, message } = JSON.parse(decodeURIComponent(raw));

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
      } catch (err) {
        console.error("Invalid toastMessage cookie:", err);
      }

      document.cookie = "toastMessage=; Max-Age=0";
    }
  }, []);

  return (
    <Toaster
      icons={{
        success: (
          <CheckIcon
            size={20}
            className="rounded-full bg-blue-600 p-1 text-white shadow-md"
          />
        ),
        error: "alert-circle",
        info: "information",
        warning: "alert",
      }}
      swipeDirections={["right"]}
      position="bottom-center"
      duration={Infinity}
      {...props}
    />
  );
}
