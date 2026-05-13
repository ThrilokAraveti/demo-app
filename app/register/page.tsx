"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateRegister } from "@/lib/validator";
import { registerUser } from "@/services/authService";

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const orderingBenefits = [
  "Fast doorstep delivery",
  "Saved favorite meals",
  "Exclusive food deals",
];

const orderingHighlights = [
  {
    value: "30m",
    label: "average delivery window",
  },
  {
    value: "24/7",
    label: "late-night cravings covered",
  },
  {
    value: "1 tap",
    label: "to reorder favorites",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    const validationErrors = validateRegister(data) as RegisterErrors;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await registerUser(data);
      setMessage(res.message || "Registration successful");
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Unable to register. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !name.trim() || !email.trim() || !password;

  return (
    <section className="relative left-1/2 -my-6 min-h-[calc(100vh-72px)] w-screen -translate-x-1/2 overflow-hidden bg-zinc-950 text-white">
      <Image
        src="/register-food-wallpaper.png"
        alt="A spread of fresh food dishes and delivery packaging"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.94)_0%,rgba(8,8,8,0.72)_42%,rgba(8,8,8,0.38)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(248,113,22,0.22),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(22,163,74,0.2),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 md:gap-10 md:py-10 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="hidden lg:block max-w-2xl">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-orange-100 backdrop-blur">
            Fresh meals, right at your door
          </p>
          <h1 className="max-w-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-normal text-white">
            Order the food you love in minutes.
          </h1>
          <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg leading-6 sm:leading-8 text-zinc-200">
            Create your account to discover nearby restaurants, save your go-to
            dishes, unlock deals, and track every order from kitchen to
            doorstep.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
            {orderingBenefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full border border-white/15 bg-black/25 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-zinc-100 backdrop-blur"
              >
                {benefit}
              </span>
            ))}
          </div>

          <dl className="mt-8 sm:mt-10 grid max-w-2xl gap-3 sm:gap-4 sm:grid-cols-3">
            {orderingHighlights.map((item) => (
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
              Customer signup
            </p>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold tracking-normal text-zinc-950">
              Create your account
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-600">
              Save addresses, track orders, and get personalized food deals.
            </p>
          </div>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleRegister} noValidate>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs sm:text-sm font-semibold text-zinc-800"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Aarav Sharma"
                value={name}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
              {errors.name && (
                <p id="name-error" className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

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
                placeholder="Minimum 6 characters"
                value={password}
                autoComplete="new-password"
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
              className="w-full rounded-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-500 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-orange-600/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-600/35 focus:outline-none focus:ring-4 focus:ring-orange-200 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-none disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-700 transition hover:text-orange-800"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
