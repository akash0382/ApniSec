"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile");

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-white">ApniSec</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                pathname === "/"
                  ? "text-primary-400 font-semibold bg-slate-800"
                  : "text-slate-300 hover:text-primary-400 hover:bg-slate-800"
              }`}
            >
              Home
            </Link>
            <Link
              href="/#services"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-primary-400 hover:bg-slate-800 transition-all duration-200"
            >
              Services
            </Link>
            <Link
              href="/#about"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-primary-400 hover:bg-slate-800 transition-all duration-200"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-primary-400 hover:bg-slate-800 transition-all duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === "/dashboard"
                      ? "text-primary-400 font-semibold bg-slate-800"
                      : "text-slate-300 hover:text-primary-400 hover:bg-slate-800"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === "/profile"
                      ? "text-primary-400 font-semibold bg-slate-800"
                      : "text-slate-300 hover:text-primary-400 hover:bg-slate-800"
                  }`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  pathname === "/"
                    ? "text-primary-400 font-semibold bg-slate-800"
                    : "text-slate-300 hover:text-primary-400 hover:bg-slate-800"
                }`}
              >
                Home
              </Link>
              <Link
                href="/#services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-primary-400 hover:bg-slate-800 transition-all"
              >
                Services
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-primary-400 hover:bg-slate-800 transition-all"
              >
                About
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-primary-400 hover:bg-slate-800 transition-all"
              >
                Contact
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pathname === "/dashboard"
                        ? "text-primary-400 font-semibold bg-slate-800"
                        : "text-slate-300 hover:text-primary-400 hover:bg-slate-800"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      pathname === "/profile"
                        ? "text-primary-400 font-semibold bg-slate-800"
                        : "text-slate-300 hover:text-primary-400 hover:bg-slate-800"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all font-medium text-center mt-2"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
