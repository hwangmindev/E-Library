import Link from "next/link";
import AuthNavItems from "../auth/AuthNavItems";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            E-Library
          </Link>

          {/* Desktop Menu */}
          <div className="flex space-x-6">
            <AuthNavItems />
          </div>
        </div>
      </div>
    </nav>
  );
}
