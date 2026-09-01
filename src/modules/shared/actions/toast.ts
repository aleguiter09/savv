"use server";

import type { ToastType } from "@/modules/shared/ui/toast";
import { cookies } from "next/headers";

export const setToastMessage = async (type: ToastType, message: string) => {
  const cookieStore = await cookies();

  cookieStore.set(
    "toastMessage",
    JSON.stringify({
      type,
      message,
    }),
    {
      path: "/",
      maxAge: 30,
      sameSite: "lax",
    },
  );
};
