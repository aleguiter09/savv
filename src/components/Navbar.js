"use client";
import { useAuth } from "@/context/authContext";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Title } from "@tremor/react";

export default function Navbar() {
  const { signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClick(event) {
      if (menu.current && !menu.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [showMenu]);

  return (
    <nav>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Title className="ms-2 font-bold text-black">My finances</Title>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <div className="relative ml-3">
              <button
                className="relative flex rounded-full bg-gray-800 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((b) => !b);
                }}
              >
                <Image
                  width={32}
                  height={32}
                  className="rounded-full"
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt=""
                />
              </button>

              {showMenu && (
                <ul
                  ref={menu}
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <li key="signOut">
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                      onClick={signOut}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
