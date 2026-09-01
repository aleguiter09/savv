import { NavLinks } from "./NavLinks";

export function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-t-gray-400 bg-white pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-5 max-w-lg sm:mx-auto flex">
        <NavLinks />
      </div>
    </nav>
  );
}
