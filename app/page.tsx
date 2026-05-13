"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const carouselSlides = [
  {
    id: 1,
    title: "Welcome to South Indian Delights",
    description: "Discover authentic flavors from Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, and Telangana",
    subtitle: "Your culinary journey begins here",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 2,
    title: "Authentic South Indian Cuisine",
    description: "From dosas and idlis to biryanis and curries - experience the rich heritage of South Indian cooking",
    subtitle: "Traditional recipes, modern delivery",
    color: "from-green-500 to-teal-600",
  },
  {
    id: 3,
    title: "Fresh Ingredients, Fast Delivery",
    description: "Log in to order from nearby restaurants and track your delivery in real-time",
    subtitle: "Quality you can taste",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 4,
    title: "Join Our Food Community",
    description: "Create your account to save favorites, reorder easily, and access exclusive deals",
    subtitle: "More than just food",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: 5,
    title: "Powered by Modern Technology",
    description: "Built with Next.js and React for seamless ordering experience",
    subtitle: "Innovation meets tradition",
    color: "from-blue-500 to-cyan-600",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1
    );
  };

  const slide = carouselSlides[currentSlide];

  return (
    <section className="relative left-1/2 -my-6 min-h-[calc(100vh-72px)] w-screen -translate-x-1/2 overflow-hidden bg-zinc-950 text-white">
      <Image
        src="/register-food-wallpaper.png"
        alt="South Indian food wallpaper background"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_28%)]" />

      {/* Main Content */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl flex-col justify-center gap-8 px-4 py-10 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-4xl text-center lg:text-left">
          <p className="mx-auto inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-orange-100 backdrop-blur lg:mx-0">
            Discover South Indian Flavors
          </p>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Authentic South Indian cuisine at your doorstep.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base md:text-lg leading-7 text-zinc-200 lg:mx-0">
            Explore regional specialties from Kerala to Karnataka. Order authentic dishes,
            track deliveries, and discover new favorites from South India&apos;s culinary heritage.
          </p>
        </div>

        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-black/50 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-white/80">
                  {slide.subtitle}
                </span>
                <h2 className="mt-6 text-3xl sm:text-4xl font-bold leading-tight">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-white/80">
                  {slide.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={prevSlide}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  onClick={nextSlide}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                  aria-label="Next slide"
                >
                  ›
                </button>
                <div className="flex flex-1 justify-center gap-2">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-blue-400 w-10"
                          : "bg-white/30 w-3 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-950/80 via-slate-900/80 to-slate-800/90 p-6 text-white shadow-2xl shadow-slate-950/40 ring-1 ring-white/10">
              <div className="rounded-[1.5rem] bg-white/5 p-6 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">
                  South India map showcase
                </p>
                <div className="mt-6 flex h-72 items-center justify-center rounded-3xl bg-white/5 text-white">
                  <span className="text-sm text-white/70">Carousel visual panel</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm text-white/70">5 States</p>
              <p className="mt-3 text-2xl font-semibold text-orange-300">Kerala • TN • KA • AP • TG</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm text-white/70">Average delivery</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-300">30m</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
              <p className="text-sm text-white/70">Service available</p>
              <p className="mt-3 text-2xl font-semibold text-sky-300">24/7</p>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

