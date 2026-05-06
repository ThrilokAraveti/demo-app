"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateLogin } from "@/lib/validator";
import { loginUser } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<string>("");
const handleLogin = async () => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await res.json();

    console.log(result);

    if (res.ok) {
      console.log("Login success");

      router.push("/dashboard");
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.log(err);
  }
};


    return (
<div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">            <div className="border p-6 rounded w-80">
                <h2 className="text-xl mb-4">Login</h2>

  <input
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"

                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}

<input
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"

                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}

                <button
                    className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
                    onClick={handleLogin}
                    disabled={!email || !password}
                >
                    Login
                </button>
                {message && <p className="mt-3 text-sm">{message}</p>}
            </div>
        </div>
    );
}
