"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useToastStore } from "@/stores/toast-store";
import { Toaster } from "@/components/ui/sonner";

export function ToastManager(props: React.ComponentProps<typeof Toaster>) {
  const pathname = usePathname();
  const show = useToastStore((s) => s.show);
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((row) => row.startsWith("toastMessage="))
      ?.split("=")[1];

    if (!raw) return;
    if (handled.current === raw) return;

    handled.current = raw;

    try {
      show(JSON.parse(decodeURIComponent(raw)));
    } catch (e) {
      console.error(e);
    }

    document.cookie = "toastMessage=; Max-Age=0; path=/";
  }, [pathname, show]);

  return (
    <Toaster
      swipeDirections={["left", "right"]}
      position="bottom-center"
      {...props}
    />
  );
}
