"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Summary = {
  users: number;
  menuItems: number;
  activeOffers: number;
  orders: number;
  openFeedback: number;
  ratings: {
    count: number;
    averageFood: string;
    averageDelivery: string;
  };
};

type AdminUser = {
  userId: string;
  name?: string;
  email: string;
  role: string;
  createdAt?: string;
};

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isFeatured: boolean;
};

type Offer = {
  id: string;
  title: string;
  code: string;
  discountText: string;
  isActive: boolean;
};

type Feedback = {
  id: string;
  message: string;
  status: "new" | "reviewed" | "resolved";
  createdAt: string;
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  total: number;
  etaMinutes: number;
  createdAt: string;
  updatedAt: string;
  address: string;
  phone: string;
};

type StoreHours = {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStartTime: string;
  breakEndTime: string;
  hasBreak: boolean;
  daysOpen: string[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [storeHours, setStoreHours] = useState<StoreHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const [summaryRes, usersRes] = await Promise.all([
          fetch("/api/admin/summary", { cache: "no-store" }),
          fetch("/api/admin/users", { cache: "no-store" }),
        ]);

        if (summaryRes.status === 401) {
          router.replace("/login");
          return;
        }

        if (summaryRes.status === 403) {
          router.replace("/dashboard/user");
          return;
        }

        if (summaryRes.ok) {
          const data = (await summaryRes.json()) as { summary: Summary };
          setSummary(data.summary);
        }

        if (usersRes.ok) {
          const data = (await usersRes.json()) as { users: AdminUser[] };
          setUsers(data.users);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, [router]);

  const loadMenuItems = async () => {
    try {
      const res = await fetch("/api/admin/menu", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { menu: MenuItem[] };
        setMenuItems(data.menu);
      }
    } catch (err) {
      setMessage("Failed to load menu items");
    }
  };

  const loadOffers = async () => {
    try {
      const res = await fetch("/api/admin/offers", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { offers: Offer[] };
        setOffers(data.offers);
      }
    } catch (err) {
      setMessage("Failed to load offers");
    }
  };

  const loadFeedbacks = async () => {
    try {
      const res = await fetch("/api/admin/feedbacks", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { feedbacks: Feedback[] };
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      setMessage("Failed to load feedbacks");
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { orders: Order[] };
        setOrders(data.orders);
      }
    } catch (err) {
      setMessage("Failed to load orders");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: status as Order["status"],
                }
              : order
          )
        );
        setMessage("Order status updated and customer notified");
      }
    } catch (err) {
      setMessage("Failed to update order");
    }
  };

  const loadStoreHours = async () => {
    try {
      const res = await fetch("/api/admin/store-hours", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { storeHours: StoreHours };
        setStoreHours(data.storeHours);
      }
    } catch (err) {
      setMessage("Failed to load store hours");
    }
  };

  const toggleMenuItem = async (itemId: string, isAvailable: boolean) => {
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, isAvailable: !isAvailable }),
      });
      if (res.ok) {
        setMenuItems(
          menuItems.map((item) =>
            item.id === itemId ? { ...item, isAvailable: !isAvailable } : item
          )
        );
        setMessage("Menu item updated");
      }
    } catch (err) {
      setMessage("Failed to update menu item");
    }
  };

  const toggleOffer = async (offerId: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, isActive: !isActive }),
      });
      if (res.ok) {
        setOffers(
          offers.map((offer) =>
            offer.id === offerId ? { ...offer, isActive: !isActive } : offer
          )
        );
        setMessage("Offer updated");
      }
    } catch (err) {
      setMessage("Failed to update offer");
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId, status }),
      });
      if (res.ok) {
        setFeedbacks(
          feedbacks.map((fb) =>
            fb.id === feedbackId
              ? {
                  ...fb,
                  status: status as "new" | "reviewed" | "resolved",
                }
              : fb
          )
        );
        setMessage("Feedback status updated");
      }
    } catch (err) {
      setMessage("Failed to update feedback");
    }
  };

  const saveStoreHours = async () => {
    if (!storeHours) return;
    try {
      const res = await fetch("/api/admin/store-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeHours),
      });
      if (res.ok) {
        setMessage("Store hours updated successfully");
      }
    } catch (err) {
      setMessage("Failed to save store hours");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.replace("/login");
    } catch (err) {
      setMessage("Failed to logout");
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

  const cards = [
    { label: "Users", value: summary?.users || 0 },
    { label: "Menu items", value: summary?.menuItems || 0 },
    { label: "Active offers", value: summary?.activeOffers || 0 },
    { label: "Orders", value: summary?.orders || 0 },
    { label: "Open feedback", value: summary?.openFeedback || 0 },
    { label: "Rating entries", value: summary?.ratings.count || 0 },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-lg bg-zinc-950 px-6 py-8 text-white shadow-lg sm:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
            Admin Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Platform operations
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-zinc-200">
        {[
          { id: "overview", label: "Overview" },
          { id: "orders", label: "Orders" },
          { id: "menu", label: "Menu" },
          { id: "offers", label: "Offers" },
          { id: "hours", label: "Store Hours" },
          { id: "feedback", label: "Feedbacks" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "orders") loadOrders();
              else if (tab.id === "menu") loadMenuItems();
              else if (tab.id === "offers") loadOffers();
              else if (tab.id === "feedback") loadFeedbacks();
              else if (tab.id === "hours") loadStoreHours();
            }}
            className={`px-4 py-3 font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-orange-600 text-orange-700"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.label}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-zinc-500">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-orange-700">
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-950">Recent users</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-zinc-200 text-zinc-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Name</th>
                    <th className="py-3 pr-4 font-semibold">Email</th>
                    <th className="py-3 pr-4 font-semibold">Role</th>
                    <th className="py-3 pr-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId} className="border-b border-zinc-100">
                      <td className="py-3 pr-4 font-semibold text-zinc-900">
                        {user.name || "Unknown"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">{user.email}</td>
                      <td className="py-3 pr-4 capitalize text-zinc-600">
                        {user.role}
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === "menu" && (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Manage Menu Items</h2>
          <div className="mt-5 space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
              >
                <div>
                  <p className="font-semibold text-zinc-900">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    {item.category} • ₹{item.price}
                  </p>
                </div>
                <button
                  onClick={() => toggleMenuItem(item.id, item.isAvailable)}
                  className={`px-4 py-2 rounded font-medium text-sm transition ${
                    item.isAvailable
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "offers" && (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Manage Offers</h2>
          <div className="mt-5 space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
              >
                <div>
                  <p className="font-semibold text-zinc-900">{offer.title}</p>
                  <p className="text-xs text-zinc-500">
                    Code: {offer.code} • {offer.discountText}
                  </p>
                </div>
                <button
                  onClick={() => toggleOffer(offer.id, offer.isActive)}
                  className={`px-4 py-2 rounded font-medium text-sm transition ${
                    offer.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "hours" && storeHours && (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Store Hours</h2>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-zinc-900">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={storeHours.openTime}
                  onChange={(e) =>
                    setStoreHours({ ...storeHours, openTime: e.target.value })
                  }
                  className="mt-2 w-full rounded border border-zinc-200 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-900">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={storeHours.closeTime}
                  onChange={(e) =>
                    setStoreHours({ ...storeHours, closeTime: e.target.value })
                  }
                  className="mt-2 w-full rounded border border-zinc-200 px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasBreak"
                checked={storeHours.hasBreak}
                onChange={(e) =>
                  setStoreHours({ ...storeHours, hasBreak: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="hasBreak" className="font-medium text-zinc-900">
                Store has a break time
              </label>
            </div>

            {storeHours.hasBreak && (
              <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-zinc-50 p-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900">
                    Break Start Time
                  </label>
                  <input
                    type="time"
                    value={storeHours.breakStartTime}
                    onChange={(e) =>
                      setStoreHours({
                        ...storeHours,
                        breakStartTime: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded border border-zinc-200 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-900">
                    Break End Time
                  </label>
                  <input
                    type="time"
                    value={storeHours.breakEndTime}
                    onChange={(e) =>
                      setStoreHours({
                        ...storeHours,
                        breakEndTime: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded border border-zinc-200 px-3 py-2"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-3">
                Operating Days
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {days.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={storeHours.daysOpen.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStoreHours({
                            ...storeHours,
                            daysOpen: [...storeHours.daysOpen, day],
                          });
                        } else {
                          setStoreHours({
                            ...storeHours,
                            daysOpen: storeHours.daysOpen.filter(
                              (d) => d !== day
                            ),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-zinc-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={saveStoreHours}
              className="rounded-lg bg-orange-600 px-6 py-2 font-bold text-white transition hover:bg-orange-700"
            >
              Save Store Hours
            </button>
          </div>
        </section>
      )}

      {activeTab === "feedback" && (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Customer Feedbacks</h2>
          <div className="mt-5 space-y-3">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-zinc-600">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-zinc-900">{feedback.message}</p>
                  </div>
                  <select
                    value={feedback.status}
                    onChange={(e) =>
                      updateFeedbackStatus(feedback.id, e.target.value)
                    }
                    className={`ml-4 rounded px-3 py-1 text-xs font-medium ${
                      feedback.status === "new"
                        ? "bg-yellow-100 text-yellow-700"
                        : feedback.status === "reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
            {feedbacks.length === 0 && (
              <p className="text-center text-zinc-500">No feedbacks yet</p>
            )}
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Manage Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {order.customerName} • {order.customerEmail}
                    </p>
                    <p className="text-sm text-zinc-600">
                      📞 {order.phone || "Not provided"}
                    </p>
                    <p className="text-sm text-zinc-600">
                      📍 {order.address || "Not provided"}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-orange-600">
                      ₹{order.total.toFixed(2)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`mt-2 rounded px-3 py-1 text-sm font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "preparing"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "out_for_delivery"
                          ? "bg-indigo-100 text-indigo-700"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-3">
                  <h4 className="font-medium text-zinc-900 mb-2">Order Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-zinc-500">No orders yet</p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
