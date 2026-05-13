"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { validateLogin } from "@/lib/validator";
import { loginUser } from "@/services/authService";

type LoginErrors = {
  email?: string;
  password?: string;
};

const loginPerks = [
  "Track active orders",
  "Reorder favorites",
  "Claim member-only deals",
];

const quickStats = [
  {
    value: "15k+",
    label: "local dishes",
  },
  {
    value: "Live",
    label: "delivery tracking",
  },
  {
    value: "Fresh",
    label: "daily restaurant picks",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      email: email.trim(),
      password,
    };

    const validationErrors = validateLogin(data) as LoginErrors;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await loginUser(data);
      setMessage(result.message || "Login successful");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Unable to login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !email.trim() || !password;

  return (
    <section className="relative left-1/2 -my-6 min-h-[calc(100vh-72px)] w-screen -translate-x-1/2 overflow-hidden bg-zinc-950 text-white">
      <Image
        src="/register-food-wallpaper.png"
        alt="Fresh dishes arranged for online food delivery"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.94)_0%,rgba(8,8,8,0.7)_44%,rgba(8,8,8,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(248,113,22,0.2),transparent_34%),radial-gradient(circle_at_78%_82%,rgba(34,197,94,0.18),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 md:gap-10 md:py-10 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="hidden lg:block max-w-2xl">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-orange-100 backdrop-blur">
            Welcome back to your cravings
          </p>
          <h1 className="max-w-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-normal text-white">
            Your next favorite meal is waiting.
          </h1>
          <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg leading-6 sm:leading-8 text-zinc-200">
            Log in to continue ordering from nearby restaurants, repeat your
            favorite plates, and follow every delivery in real time.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
            {loginPerks.map((perk) => (
              <span
                key={perk}
                className="rounded-full border border-white/15 bg-black/25 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-zinc-100 backdrop-blur"
              >
                {perk}
              </span>
            ))}
          </div>

          <dl className="mt-8 sm:mt-10 grid max-w-2xl gap-3 sm:gap-4 sm:grid-cols-3">
            {quickStats.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur"
              >
                <dt className="text-2xl sm:text-3xl font-bold text-orange-200">
                  {item.value}
                </dt>
                <dd className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-200">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-md rounded-lg border border-white/15 bg-white/95 p-5 sm:p-6 md:p-7 lg:p-8 text-zinc-950 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-5 sm:mb-7">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Customer login
            </p>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold tracking-normal text-zinc-950">
              Sign in to order
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-600">
              Pick up where you left off with saved addresses and favorite
              restaurants.
            </p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin} noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs sm:text-sm font-semibold text-zinc-800"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="aarav@example.com"
                value={email}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs sm:text-sm font-semibold text-zinc-800"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
              {errors.password && (
                <p id="password-error" className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="w-full rounded-lg bg-orange-600 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {message && (
            <p
              className="mt-4 sm:mt-5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-zinc-700"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-zinc-600">
            New to the app?{" "}
            <Link
              href="/register"
              className="font-semibold text-orange-700 transition hover:text-orange-800"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
