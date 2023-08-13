"use client";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <div className="relative ml-3">
              <div>
                <button
                  className="relative flex rounded-full bg-gray-800 text-sm"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
              {showMenu && (
                <ul className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <li key="signOut">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700"
                      onClick={() => signOut()}
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
