import { connectDB } from "@/lib/db";
import { cleanText, requireSession } from "@/lib/auth";
import MenuItem from "@/models/MenuItem";

const defaultMenuItems = [
  {
    name: "Paneer Biryani Bowl",
    category: "Biryani",
    description: "Aromatic rice, paneer tikka, raita, and fresh herbs.",
    price: 249,
    rating: 4.8,
    isFeatured: true,
    tag: "Best seller",
  },
  {
    name: "Masala Dosa Combo",
    category: "South Indian",
    description: "Crisp dosa with sambar, chutneys, and filter coffee.",
    price: 149,
    rating: 4.7,
    isFeatured: true,
    tag: "Breakfast hit",
  },
  {
    name: "Tandoori Veg Pizza",
    category: "Pizza",
    description: "Smoky vegetables, spicy sauce, and melted cheese.",
    price: 299,
    rating: 4.6,
    isFeatured: true,
    tag: "Family pick",
  },
  {
    name: "Millet Healthy Bowl",
    category: "Healthy bowls",
    description: "Millets, grilled vegetables, sprouts, and mint dressing.",
    price: 219,
    rating: 4.5,
    isFeatured: false,
    tag: "Light meal",
  },
  {
    name: "Classic Veg Burger",
    category: "Burgers",
    description: "Crispy patty, lettuce, tomato, and house sauce.",
    price: 179,
    rating: 4.4,
    isFeatured: false,
    tag: "Quick bite",
  },
  {
    name: "Gulab Jamun Box",
    category: "Desserts",
    description: "Warm gulab jamun packed for a sweet finish.",
    price: 99,
    rating: 4.8,
    isFeatured: false,
    tag: "Dessert",
  },
];

async function ensureMenuSeeded() {
  const count = await MenuItem.estimatedDocumentCount();

  if (count === 0) {
    await MenuItem.insertMany(defaultMenuItems);
  }
}

export async function GET(req) {
  const session = await requireSession(["customer", "admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();
  await ensureMenuSeeded();

  const { searchParams } = new URL(req.url);
  const category = cleanText(searchParams.get("category"), 80);
  const featuredOnly = searchParams.get("featured") === "true";

  const query = {
    isAvailable: true,
  };

  if (category) {
    query.category = category;
  }

  if (featuredOnly) {
    query.isFeatured = true;
  }

  const items = await MenuItem.find(query)
    .sort({ isFeatured: -1, rating: -1, name: 1 })
    .lean();

  return Response.json({
    menu: items.map((item) => ({
      id: String(item._id),
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      rating: item.rating,
      tag: item.tag,
      isFeatured: item.isFeatured,
    })),
  });
}

export async function POST(req) {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const name = cleanText(body.name, 120);
  const category = cleanText(body.category, 80);
  const description = cleanText(body.description, 240);
  const tag = cleanText(body.tag, 60);
  const price = Number(body.price);

  if (!name || !category || !description || !Number.isFinite(price) || price < 0) {
    return Response.json({ message: "Invalid menu item" }, { status: 400 });
  }

  const item = await MenuItem.create({
    name,
    category,
    description,
    tag,
    price,
    rating: Number(body.rating) || 4.5,
    isAvailable: body.isAvailable !== false,
    isFeatured: Boolean(body.isFeatured),
  });

  return Response.json(
    {
      menuItem: {
        id: String(item._id),
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        rating: item.rating,
        tag: item.tag,
      },
    },
    { status: 201 }
  );
}
