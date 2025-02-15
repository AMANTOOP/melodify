"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, CircleUserRound } from "lucide-react";
import AuthContext from "@/context/authContext"; // Import custom hook

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext); // ✅ Use custom hook
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirect to login page
  };

  return (
    <nav className="sticky top-0 left-0 right-0 bg-gray-800 text-white z-50 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold flex">
              <Image
                src="/logo.svg"
                alt="iodify"
                width={200}
                height={200}
                className="mx-auto rounded-md"
              />
              <p className="text-sm">v1.4</p>
              
            </Link>
          </div>
          <div>
          <CircleUserRound  className="ml-[10px]"/>
          {user?.name?.split(" ")[0] || "Guest"}
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/playlists"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/playlists"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Playlists
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/login"
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/signup"
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/playlists"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/playlists"
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Playlists
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/login"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/signup"
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
