import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { requireSession } from "@/lib/auth";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function GET() {
  try {
    await connectDB();

    const session = await requireSession(["admin"]);
    if (session.error) {
      return session.error;
    }

    const orders = await Order.find()
      .populate("user", "email name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order._id.toString(),
        customerName: order.user?.name || "Unknown",
        customerEmail: order.user?.email || "N/A",
        items: order.items,
        status: order.status,
        total: order.total,
        etaMinutes: order.etaMinutes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        address: order.address,
        phone: order.phone,
      })),
    });
  } catch (err) {
    console.error("Get admin orders error:", err);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const session = await requireSession(["admin"]);
    if (session.error) {
      return session.error;
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { message: "Order ID and status required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "email name");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Send status update email
    if (order.user?.email) {
      const statusMessages = {
        pending: "Your order has been received and is pending confirmation.",
        confirmed: "Your order has been confirmed and is being prepared!",
        preparing: "Your delicious order is being prepared by our chefs.",
        out_for_delivery: "Your order is on the way! Our delivery partner will arrive soon.",
        delivered: "Your order has been delivered. Thank you for ordering!",
        cancelled: "Your order has been cancelled.",
      };

      await sendOrderStatusUpdate(
        order.user.email,
        order.user.name,
        orderId,
        status,
        statusMessages[status] || "Order status updated"
      );
    }

    return NextResponse.json({
      message: "Order status updated",
      order: {
        id: order._id.toString(),
        status: order.status,
      },
    });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
