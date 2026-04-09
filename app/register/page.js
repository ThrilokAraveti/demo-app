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
    const [errors, setErrors] = useState({});
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
  } catch (err) {
    setMessage(err.message);
  }
    };

    useEffect(() => {
        const validationErrors = validateRegister({ name, email, password });
        if (name || email || password) {
            setErrors(validationErrors);
        }
    }, [name, email, password]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border p-6 rounded w-80">
                <h2 className="text-xl mb-4">Register</h2>

                <Input
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}

                <Input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}

                <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}


                <Button text="Register" onClick={handleRegister} disabled={!name || !email || !password} />
            </div>
        </div>
    );
}