"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const carouselSlides = [
  {
    id: 1,
    title: "Welcome Home",
    description: "Your gateway to seamless authentication and user management",
    subtitle: "Start your journey here",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Secure Registration",
    description: "Create your account with validated credentials and strong security",
    subtitle: "Sign up in seconds",
    color: "from-green-500 to-green-600",
  },
  {
    id: 3,
    title: "Easy Login",
    description: "Log in to your account with email and password authentication",
    subtitle: "Access your profile",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 4,
    title: "User Profile",
    description: "Manage your account information and preferences",
    subtitle: "Your space, your rules",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 5,
    title: "Built with Modern Tech",
    description: "Powered by Next.js, React, and TypeScript",
    subtitle: "Performance meets reliability",
    color: "from-pink-500 to-pink-600",
  },
];

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 text-gray-700"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoplay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoplay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1
    );
    setIsAutoplay(false);
  };

  const slide = carouselSlides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Auth App</h1>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Carousel */}
          <div
            className={`relative bg-gradient-to-br ${slide.color} rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 min-h-96`}
          >
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {slide.subtitle}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                {slide.title}
              </h2>
              <p className="text-lg sm:text-xl max-w-md text-white/90">
                {slide.description}
              </p>
            </div>

            {/* Slide counter */}
            <div className="absolute bottom-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm text-white">
              {currentSlide + 1} / {carouselSlides.length}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              aria-label="Previous slide"
            >
              <ChevronIcon direction="left" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 w-3 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              aria-label="Next slide"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          {/* Autoplay Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isAutoplay
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isAutoplay ? "Pause" : "Play"}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p className="text-sm">
          Built with modern technologies for a seamless user experience
        </p>
      </footer>
    </div>
  );
}
