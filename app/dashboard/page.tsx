"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

const handleLogout = async () => {
  await fetch("/api/logout", {
    method: "POST",
  });

  router.push("/login");
};

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
    <h1 className="text-3xl font-bold mb-2">
  Dashboard 🎉
</h1>

<p className="text-gray-600">
  Welcome back, {user?.email}
</p>
      <button
  className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
  onClick={handleLogout}
>
  Logout
</button>
    </div>
  );
}