import { NavLinks } from "./NavLinks";

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t-gray-400 border-t bg-white">
      <div className="mx-5 max-w-lg sm:mx-auto flex">
        <NavLinks />
      </div>
    </nav>
  );
}
