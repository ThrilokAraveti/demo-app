import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import MenuItem from "@/models/MenuItem";

export async function PATCH(req) {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const { itemId, isAvailable } = body;

  if (!itemId) {
    return Response.json({ message: "Item ID required" }, { status: 400 });
  }

  const item = await MenuItem.findByIdAndUpdate(
    itemId,
    { isAvailable },
    { new: true }
  );

  if (!item) {
    return Response.json({ message: "Menu item not found" }, { status: 404 });
  }

  return Response.json({
    menuItem: {
      id: String(item._id),
      name: item.name,
      isAvailable: item.isAvailable,
    },
  });
}

export async function GET() {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const items = await MenuItem.find().lean();

  return Response.json({
    menu: items.map((item) => ({
      id: String(item._id),
      name: item.name,
      category: item.category,
      price: item.price,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
    })),
  });
}
