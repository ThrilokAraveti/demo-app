import "./globals.css";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen text-gray-900">
        <Navbar />

        <main className="max-w-5xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}