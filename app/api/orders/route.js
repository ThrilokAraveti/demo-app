import { connectDB } from "@/lib/db";
import { cleanText, requireSession } from "@/lib/auth";
import Order from "@/models/Order";
import User from "@/models/User";
import { sendOrderConfirmation, sendAdminOrderNotification } from "@/lib/email";

function serializeOrder(order) {
  return {
    id: String(order._id),
    restaurant: order.restaurant,
    items: order.items,
    status: order.status,
    total: order.total,
    etaMinutes: order.etaMinutes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    address: order.address || "Not provided",
    phone: order.phone || "Not provided",
  };
}

export async function GET() {
  const session = await requireSession(["customer", "admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const query =
    session.user.role === "admin" ? {} : { user: session.user._id };

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return Response.json({
    orders: orders.map(serializeOrder),
  });
}

export async function POST(req) {
  const session = await requireSession(["customer"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const restaurant = cleanText(body.restaurant || "South Indian Delights", 120);
  const address = cleanText(body.address || "", 500);
  const phone = cleanText(body.phone || "", 20);
  const rawItems = Array.isArray(body.items) ? body.items : [];

  const items = rawItems
    .map((item) => ({
      name: cleanText(item.name, 120),
      quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 20),
      price: Math.max(Number(item.price) || 0, 0),
    }))
    .filter((item) => item.name && item.price >= 0);

  if (items.length === 0) {
    return Response.json(
      { message: "Order must include at least one item" },
      { status: 400 }
    );
  }

  if (!address) {
    return Response.json(
      { message: "Delivery address is required" },
      { status: 400 }
    );
  }

  if (!phone) {
    return Response.json(
      { message: "Phone number is required" },
      { status: 400 }
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: session.user._id,
    restaurant,
    items,
    total,
    status: "pending",
    etaMinutes: 45,
    address,
    phone,
  });

  // Send confirmation email
  try {
    const user = await User.findById(session.user._id);
    if (user?.email) {
      await sendOrderConfirmation(
        user.email,
        user.name,
        order._id.toString(),
        items,
        total
      );
    }
  } catch (emailErr) {
    console.error("Customer email notification failed:", emailErr);
    // Don't fail the order creation if email fails
  }

  // Send admin notification
  try {
    const user = await User.findById(session.user._id);
    if (user) {
      await sendAdminOrderNotification(
        order._id.toString(),
        user.name,
        user.email,
        phone,
        address,
        items,
        total
      );
    }
  } catch (adminEmailErr) {
    console.error("Admin email notification failed:", adminEmailErr);
    // Don't fail the order creation if admin email fails
  }

  return Response.json(
    {
      order: serializeOrder(order.toObject()),
    },
    { status: 201 }
  );
}
