"use client";

import { useEffect, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { validateRegister } from "@/lib/validator";
import { registerUser } from "@/services/authService";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const [message, setMessage] = useState("");

    const handleRegister = async() => {
        const data = {
            name,
            email,
            password,
        };
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }
         try {
            const res = await registerUser(data);
            setMessage(res.message);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage(String(err));
            }
        }
    };


    return (
<div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">            <div className="border p-6 rounded w-80">
                <h2 className="text-xl mb-4">Register</h2>

<input
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"

                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}

               <input
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"

                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}

               <input
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"

                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}


                <button
                    className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
                    onClick={handleRegister}
                    disabled={!name || !email || !password}
                >
                    Register
                </button>
            </div>
        </div>
    );
}