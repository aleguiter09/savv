"use server";

import { ToastType } from "@/stores/toast-store";
import { cookies } from "next/headers";

export const setToastMessage = (type: ToastType, message: string) => {
  cookies().set(
    "toastMessage",
    JSON.stringify({
      type,
      message,
    }),
    {
      path: "/",
      maxAge: 30,
      sameSite: "lax",
    }
  );
};
