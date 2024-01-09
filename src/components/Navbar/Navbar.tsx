import LogoutButton from "./LogoutButton";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <nav className="border-t-gray-400 border-t bg-white">
      <div className="mx-5 max-w-lg sm:mx-auto flex">
        <NavLinks />
        <LogoutButton />
      </div>
    </nav>
  );
}
