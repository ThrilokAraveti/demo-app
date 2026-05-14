"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type UserProfile = {
  name?: string;
  email: string;
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    address: false,
    phone: false,
  });

  useEffect(() => {
    const loadCheckout = async () => {
      try {
        // Get user profile
        const profileRes = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (profileRes.status === 401) {
          router.replace("/login");
          return;
        }

        if (!profileRes.ok) {
          router.replace("/dashboard/user");
          return;
        }

        const profileData = (await profileRes.json()) as {
          user: UserProfile;
        };
        setUser(profileData.user);

        // Get cart items from session storage
        const cartData = sessionStorage.getItem("orderCart");
        if (cartData) {
          try {
            const parsedItems = JSON.parse(cartData);
            setItems(parsedItems);
          } catch (err) {
            setMessage("Failed to load cart items");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, [router]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const confirmOrder = async () => {
    if (items.length === 0) {
      setMessage("Cart is empty");
      setFieldErrors({ address: false, phone: false });
      return;
    }

    const hasAddress = address.trim().length > 0;
    const hasPhone = phone.trim().length > 0;
    setFieldErrors({ address: !hasAddress, phone: !hasPhone });

    if (!hasAddress || !hasPhone) {
      setMessage("Please fill in the required fields before confirming your order.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          restaurant: "South Indian Delights",
          total,
          address: address.trim(),
          phone: phone.trim(),
        }),
      });

      if (res.ok) {
        setShowConfirmation(true);
        sessionStorage.removeItem("orderCart");

        // Redirect to user dashboard after confirming the order
        setTimeout(() => {
          router.replace("/dashboard/user");
        }, 1500);
      } else {
        const error = (await res.json()) as { message?: string };
        setMessage(error.message || "Failed to confirm order");
      }
    } catch (err) {
      setMessage("Failed to confirm order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </section>
    );
  }

  if (showConfirmation) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-green-700 mt-8">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            A confirmation email has been sent to {user?.email}
          </p>
          <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            ← Back
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Order Checkout
          </h1>
          <p className="mt-2 text-gray-600">Review and confirm your order</p>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        {/* Cart Items */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm mb-6">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-600">
              Your cart is empty
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price}/item</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-600 font-medium transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(index, parseInt(e.target.value) || 1)
                        }
                        className="w-12 text-center border border-gray-300 rounded py-1 font-medium"
                        min="1"
                        max="20"
                      />
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-600 font-medium transition"
                      >
                        +
                      </button>
                    </div>

                    <p className="w-20 text-right font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeItem(index)}
                      className="px-3 py-1.5 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium text-gray-900">₹0.00</span>
          </div>
          <div className="border-t border-orange-200 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-orange-700">
              ₹{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Delivery Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={user?.name || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) {
                    setFieldErrors((prev) => ({ ...prev, phone: false }));
                  }
                }}
                placeholder="Enter your phone number"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  fieldErrors.phone
                    ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300"
                }`}
                aria-invalid={fieldErrors.phone}
                required
              />
              {fieldErrors.phone && (
                <p className="mt-2 text-sm text-red-600">Phone number is required.</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (fieldErrors.address) {
                    setFieldErrors((prev) => ({ ...prev, address: false }));
                  }
                }}
                placeholder="Enter your complete delivery address"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  fieldErrors.address
                    ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300"
                }`}
                aria-invalid={fieldErrors.address}
                required
              />
              {fieldErrors.address && (
                <p className="mt-2 text-sm text-red-600">Delivery address is required.</p>
              )}
            </div>
            <p className="text-sm text-gray-600">
              * Required fields. Confirmation and order updates will be sent to your email.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={confirmOrder}
            disabled={submitting || items.length === 0}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 font-bold text-white shadow-md shadow-orange-600/20 transition hover:shadow-lg hover:shadow-orange-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
