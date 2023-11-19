import { Title } from "@tremor/react";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <Title className="ms-2 font-bold text-black">Finance tracker</Title>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <NavbarClient />
          </div>
        </div>
      </div>
    </nav>
  );
}
