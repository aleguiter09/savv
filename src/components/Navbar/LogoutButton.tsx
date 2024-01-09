"use client";
import { useAuth } from "@/context/authContext";
import { LogoutIcon } from "@heroicons/react/outline";

export default function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      className="flex h-[48px] grow items-center justify-center"
      onClick={signOut}
    >
      <LogoutIcon className="w-6" />
    </button>
  );
}
