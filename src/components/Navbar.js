"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar({ signOut }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <>
      <header>
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-white font-bold text-xl">
                  RoutineMaster
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <Link
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-3 rounded-md text-sm font-medium"
                    href="/"
                  >
                    Home
                  </Link>
                  <Link
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-3 rounded-md text-sm font-medium"
                    href="/templates"
                  >
                    Templates
                  </Link>
                </div>
              </div>

              {/* Logout Button */}
              <div className="hidden md:block">
                <button
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2"
                  onClick={signOut}
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="-mr-2 flex md:hidden">
                <button
                  type="button"
                  className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="hidden h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/templates"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Templates
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
