"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "customer" | "restaurant" | "admin";

interface User {
  name?: string;
  email: string;
  role?: UserRole;
}

interface DashboardAction {
  title: string;
  description: string;
  cta: string;
}

const roleLabels: Record<UserRole, string> = {
  customer: "Food lover",
  restaurant: "Restaurant partner",
  admin: "Platform admin",
};

const roleActions: Record<UserRole, DashboardAction[]> = {
  customer: [
    {
      title: "Browse menu",
      description: "Find trending dishes, meal combos, and delivery-ready picks.",
      cta: "Explore dishes",
    },
    {
      title: "Track orders",
      description: "Follow active orders from preparation to doorstep delivery.",
      cta: "View tracking",
    },
    {
      title: "Saved favorites",
      description: "Reorder your regular meals without rebuilding the cart.",
      cta: "Open favorites",
    },
    {
      title: "Deals for you",
      description: "Use coupons for lunch, dinner, and late-night cravings.",
      cta: "See offers",
    },
  ],
  restaurant: [
    {
      title: "Manage menu",
      description: "Update dishes, prices, availability, and preparation times.",
      cta: "Edit menu",
    },
    {
      title: "Order queue",
      description: "Accept, prepare, and hand off incoming customer orders.",
      cta: "Open queue",
    },
    {
      title: "Promotions",
      description: "Create meal combos and time-based offers to increase orders.",
      cta: "Plan offers",
    },
    {
      title: "Performance",
      description: "Review sales, repeat customers, ratings, and payout health.",
      cta: "View insights",
    },
  ],
  admin: [
    {
      title: "User management",
      description: "Review customers, restaurants, roles, and account status.",
      cta: "Manage users",
    },
    {
      title: "Restaurant approval",
      description: "Verify restaurant profiles, menus, documents, and locations.",
      cta: "Review partners",
    },
    {
      title: "Order operations",
      description: "Monitor stuck orders, refunds, complaints, and delivery issues.",
      cta: "Open ops",
    },
    {
      title: "Catalog controls",
      description: "Maintain cuisines, categories, banners, and campaign slots.",
      cta: "Manage catalog",
    },
  ],
};

const recentOrders = [
  {
    id: "ORD-1048",
    restaurant: "Spice Junction",
    items: "Paneer biryani, lime soda",
    status: "Out for delivery",
    eta: "12 min",
  },
  {
    id: "ORD-1032",
    restaurant: "Urban Tandoor",
    items: "Butter naan, dal makhani",
    status: "Delivered",
    eta: "Yesterday",
  },
  {
    id: "ORD-1019",
    restaurant: "Green Bowl",
    items: "Falafel wrap, hummus",
    status: "Delivered",
    eta: "May 10",
  },
];

const menuCategories = [
  "Biryani",
  "Pizza",
  "Healthy bowls",
  "Burgers",
  "Desserts",
  "South Indian",
];

const featuredDishes = [
  {
    name: "Paneer Biryani Bowl",
    category: "Biryani",
    price: "₹249",
    tag: "Best seller",
  },
  {
    name: "Masala Dosa Combo",
    category: "South Indian",
    price: "₹149",
    tag: "Breakfast hit",
  },
  {
    name: "Tandoori Veg Pizza",
    category: "Pizza",
    price: "₹299",
    tag: "Family pick",
  },
];

const offers = [
  "Flat 30% off on your next dinner order",
  "Free dessert above ₹499",
  "Weekend biryani combo from ₹199",
];

const ratingSummary = [
  {
    value: "4.8",
    label: "average food rating",
  },
  {
    value: "96%",
    label: "on-time delivery",
  },
  {
    value: "12k+",
    label: "happy orders",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = (await res.json()) as { user: User };
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const role = user?.role || "customer";
  const displayName = useMemo(() => {
    if (user?.name?.trim()) return user.name.trim();
    return user?.email?.split("@")[0] || "there";
  }, [user]);

  const handleLogout = async () => {
    const shouldLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!shouldLogout) {
      return;
    }

    setLoggingOut(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
    }
  };

  if (loading) {
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

  return (
    <section className="space-y-8">
      <div className="rounded-lg bg-zinc-950 px-6 py-8 text-white shadow-lg sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
              {roleLabels[role]}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              {role === "customer"
                ? "Your dashboard is ready with orders, menu picks, offers, feedback, and ratings."
                : "Your role-based workspace is ready with the tools needed to keep the food ordering platform moving."}
            </p>
          </div>

          <button
            className="w-full rounded-lg border border-white/15 bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-950">Your actions</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Shortcuts based on your current account role.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roleActions[role].map((action) => (
            <article
              key={action.title}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-zinc-950">
                {action.title}
              </h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-zinc-600">
                {action.description}
              </p>
              <button className="mt-5 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                {action.cta}
              </button>
            </article>
          ))}
        </div>
      </div>

      {role === "customer" && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-950">
                    Recent orders
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Track current food and repeat past favorites.
                  </p>
                </div>
                <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-orange-300 hover:text-orange-700">
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                          {order.id}
                        </p>
                        <h3 className="mt-1 font-bold text-zinc-950">
                          {order.restaurant}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600">
                          {order.items}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-orange-700">
                          {order.status}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {order.eta}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="menu"
              className="scroll-mt-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-zinc-950">Order menu</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Popular categories to start your next order.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {menuCategories.map((category) => (
                  <button
                    key={category}
                    className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-zinc-950">
                Featured menu picks
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Customer favorites ready to add to your next order.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredDishes.map((dish) => (
                <article
                  key={dish.name}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                    {dish.tag}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-zinc-950">
                    {dish.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    {dish.category}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-bold text-zinc-950">{dish.price}</p>
                    <button className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                      Add
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <section
              id="offers"
              className="scroll-mt-24 rounded-lg border border-orange-100 bg-orange-50 p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-zinc-950">Offers</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Deals ready for your next checkout.
              </p>
              <div className="mt-5 space-y-3">
                {offers.map((offer) => (
                  <div
                    key={offer}
                    className="rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-800"
                  >
                    {offer}
                  </div>
                ))}
              </div>
            </section>

            <section
              id="feedback"
              className="scroll-mt-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-zinc-950">Feedback</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Tell us how your last order tasted.
              </p>
              <textarea
                className="mt-5 min-h-28 w-full resize-none rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="Share food quality, packing, delivery, or app feedback..."
              />
              <button className="mt-3 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                Submit feedback
              </button>
            </section>

            <section
              id="ratings"
              className="scroll-mt-24 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-zinc-950">Ratings</h2>
              <p className="mt-1 text-sm text-zinc-600">
                A quick pulse on food and delivery quality.
              </p>
              <div className="mt-5 grid gap-3">
                {ratingSummary.map((item) => (
                  <div key={item.label} className="rounded-lg bg-zinc-50 p-4">
                    <p className="text-3xl font-bold text-orange-700">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}
