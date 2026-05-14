"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ProfileResponse = {
  user?: {
    role?: "customer" | "restaurant" | "admin";
  };
};

export default function DashboardGateway() {
  const router = useRouter();

  useEffect(() => {
    const routeByRole = async () => {
      const res = await fetch("/api/profile", {
        cache: "no-store",
      });

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = (await res.json()) as ProfileResponse;

      if (data.user?.role === "admin") {
        router.replace("/dashboard/admin");
        return;
      }

      router.replace("/dashboard/user");
    };

    routeByRole();
  }, [router]);

  return (
    <section className="min-h-[70vh] rounded-lg bg-white p-8 shadow-sm">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-lg bg-zinc-100"
          />
        ))}
      </div>
    </section>
  );
}
