"use client";

import { useEffect, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import {validateLogin} from "@/lib/validator";
import { loginUser } from "@/services/authService";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        const data = {
            email,
            password,
        };
        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }
          try {
    const res = await loginUser(data);
        setMessage(res.message);
  } catch (err) {
    setMessage(err.message);
  }

  const res = await loginUser(data);
localStorage.setItem("token", res.token);


    };

    useEffect(() => {
        const validationErrors = validateLogin({ email, password });
        if(email || password) {
            setErrors(validationErrors);
        }
    }, [email, password]);


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border p-6 rounded w-80">
                <h2 className="text-xl mb-4">Login</h2>

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

                <Button text="Login" onClick={handleLogin} disabled={!email || !password} />
            </div>
        </div>
    );
}