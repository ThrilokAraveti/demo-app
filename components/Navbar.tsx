"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">
        Auth App
      </h1>

      <div className="flex gap-4">
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/login">
          Login
        </Link>
      </div>
    </nav>
  );
}