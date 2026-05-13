"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <nav className="bg-white shadow-md px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        South Indian Delights
      </h1>

      <div className="flex gap-2 sm:gap-3 md:gap-4">
        {!isDashboardPage && (
          <Link
            href="/"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 hover:text-gray-900 font-medium transition"
          >
            Home
          </Link>
        )}

        {isDashboardPage ? (
          <>
            <Link
              href="/dashboard#menu"
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 hover:text-orange-700 font-medium transition"
            >
              Menu
            </Link>
            <Link
              href="/dashboard#offers"
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 hover:text-orange-700 font-medium transition"
            >
              Offers
            </Link>
            <Link
              href="/dashboard#feedback"
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 hover:text-orange-700 font-medium transition"
            >
              Feedback
            </Link>
            <Link
              href="/dashboard#ratings"
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 hover:text-orange-700 font-medium transition"
            >
              Ratings
            </Link>
          </>
        ) : !isAuthPage ? (
          <>
            <Link
              href="/login"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-white shadow-md shadow-orange-600/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-600/30"
            >
              Register
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
