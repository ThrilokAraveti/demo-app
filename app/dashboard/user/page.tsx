"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  name?: string;
  email: string;
  role?: string;
};

type Order = {
  id: string;
  restaurant: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  total: number;
  etaMinutes?: number;
};

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  tag?: string;
};

type Offer = {
  id: string;
  title: string;
  description: string;
  code: string;
  discountText: string;
};

type RatingSummary = {
  averageFood: string;
  averageDelivery: string;
  count: number;
};



function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartMessage, setCartMessage] = useState("");

  const getCartCount = (cart: Array<{ quantity: number }>) =>
    cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileRes, ordersRes, menuRes, offersRes, ratingsRes] =
          await Promise.all([
            fetch("/api/profile", { cache: "no-store" }),
            fetch("/api/orders", { cache: "no-store" }),
            fetch("/api/menu?featured=true", { cache: "no-store" }),
            fetch("/api/offers", { cache: "no-store" }),
            fetch("/api/ratings", { cache: "no-store" }),
          ]);

        if (!profileRes.ok) {
          router.replace("/login");
          return;
        }

        const profile = (await profileRes.json()) as { user: UserProfile };

        if (profile.user.role === "admin") {
          router.replace("/dashboard/admin");
          return;
        }

        setUser(profile.user);

        if (ordersRes.ok) {
          const data = (await ordersRes.json()) as { orders: Order[] };
          setOrders(data.orders);
        }

        if (menuRes.ok) {
          const data = (await menuRes.json()) as { menu: MenuItem[] };
          setMenu(data.menu);
        }

        if (offersRes.ok) {
          const data = (await offersRes.json()) as { offers: Offer[] };
          setOffers(data.offers);
        }

        if (ratingsRes.ok) {
          const data = (await ratingsRes.json()) as {
            summary: RatingSummary;
          };
          setRatingSummary(data.summary);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  useEffect(() => {
    try {
      const existingCart = sessionStorage.getItem("orderCart");
      if (existingCart) {
        const cart = JSON.parse(existingCart);
        setCartCount(getCartCount(cart));
      }
    } catch {
      setCartCount(0);
    }
  }, []);

  const displayName = useMemo(() => {
    if (user?.name?.trim()) return user.name.trim();
    return user?.email?.split("@")[0] || "there";
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
    }
  };

  const handleRemoveFromCart = () => {
    // Get existing cart from sessionStorage
    const existingCart = sessionStorage.getItem("orderCart");
    console.log("Existing cart before removal:", existingCart);
    const cart = existingCart ? JSON.parse(existingCart) : [];
    // REDUCE THE QUANTITY OF THE LAST ITEM IN THE CART
    if (cart.length > 0) {
      const lastItem = cart[cart.length - 1];
      if (lastItem.quantity > 1) {
        lastItem.quantity -= 1;
      } else {
        cart.pop(); // Remove item if quantity is 1
      }
    }
    sessionStorage.setItem("orderCart", JSON.stringify(cart));
    setCartCount(getCartCount(cart));
    setCartMessage(`Last item removed from cart`);
    setTimeout(() => setCartMessage(""), 2500);
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
              User Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              Your food ordering data is loaded from secure MongoDB-backed APIs.
            </p>
          </div>

          <button
            className="w-full rounded-lg border border-white/15 bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto lg:w-auto"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="sticky bottom-0 mt-6 rounded-t-3xl bg-zinc-950/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-end gap-3">
            {cartMessage && (
              <span className="hidden rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-100 sm:inline-flex">
                {cartMessage}
              </span>
            )}
            <button
              onClick={() => router.push("/checkout")}
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              Go to cart ({cartCount})
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-950">
                Recent orders
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                These orders belong to your authenticated account.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-600">
                No orders yet. Start from the menu and create your first order.
              </p>
            ) : (
              orders.map((order) => (
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
                        {order.items
                          .map((item) => `${item.quantity}x ${item.name}`)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold capitalize text-orange-700">
                        {statusLabel(order.status)}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Rs {order.total}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Quick stats</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-3xl font-bold text-orange-700">
                {menu.length}
              </p>
              <p className="mt-1 text-sm text-zinc-600">featured menu items</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-3xl font-bold text-orange-700">
                {offers.length}
              </p>
              <p className="mt-1 text-sm text-zinc-600">active offers</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-4">
              <p className="text-3xl font-bold text-orange-700">
                {ratingSummary?.averageFood || "0.0"}
              </p>
              <p className="mt-1 text-sm text-zinc-600">your food rating avg</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-zinc-950">
            Featured menu picks
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Loaded from the menu API and filtered by featured status.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {menu.map((dish) => (
            <article
              key={dish.id}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                {dish.tag || dish.category}
              </p>
              <h3 className="mt-3 text-lg font-bold text-zinc-950">
                {dish.name}
              </h3>
              <p className="mt-2 text-sm text-zinc-600">{dish.category}</p>
              <div className="mt-5 flex items-center justify-between">
                <p className="font-bold text-zinc-950">Rs {dish.price}</p>
                <button
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                  onClick={() => {
                    handleRemoveFromCart()
                  }}
                >-
                </button>
                {cartCount && cartCount > 0 ? (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    {cartCount}
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    0
                  </span>   

                  )}
                <button
                  onClick={() => {
                    // Get existing cart from sessionStorage
                    const existingCart = sessionStorage.getItem("orderCart");
                    const cart = existingCart ? JSON.parse(existingCart) : [];

                    // Check if item already in cart
                    const existingItem = cart.find(
                      (item: { name: string; quantity: number; price: number }) => item.name === dish.name
                    );

                    if (existingItem) {
                      existingItem.quantity = Math.min(existingItem.quantity + 1, 99);
                    } else {
                      cart.push({
                        name: dish.name,
                        quantity: 1,
                        price: dish.price,
                      });
                    }

                    sessionStorage.setItem("orderCart", JSON.stringify(cart));
                    setCartCount(getCartCount(cart));
                    setCartMessage(`${dish.name} added to cart`);
                    setTimeout(() => setCartMessage(""), 2500);
                  }}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
