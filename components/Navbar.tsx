"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminDashboard = pathname.startsWith("/dashboard/admin");
  const isCheckoutPage = pathname === "/checkout"; 

  return (
    <nav className="bg-white shadow-md px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        South Indian Delights
      </h1>
      <div className="flex gap-2 sm:gap-3 md:gap-4">
        {isAuthPage && (
          <Link
            href="/"
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium transition ${
              pathname === "/"
                ? "border-b-2 border-orange-700 text-orange-700"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
        )}

        {isDashboardPage || isCheckoutPage ? (
          <>
            <Link
              href={isAdminDashboard ? "/dashboard/admin" : "/dashboard/user"}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium transition ${
                isAdminDashboard
                  ? pathname === "/dashboard/admin"
                    ? "border-b-2 border-orange-700 text-orange-700"
                    : "text-gray-700 hover:text-orange-700"
                  : pathname === "/dashboard/user"
                  ? "border-b-2 border-orange-700 text-orange-700"
                  : "text-gray-700 hover:text-orange-700"
              }`}
            >
              {isAdminDashboard ? "Admin" : "Dashboard"}
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
