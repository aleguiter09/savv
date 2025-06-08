import { cookies } from "next/headers";

export const setToastMessage = (
  type: "success" | "error" | "info" | "warning",
  message: string
) => {
  cookies().set(
    "toastMessage",
    JSON.stringify({
      type,
      message,
    })
  );
};
