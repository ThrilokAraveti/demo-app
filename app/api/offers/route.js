import { connectDB } from "@/lib/db";
import { cleanText, requireSession } from "@/lib/auth";
import Offer from "@/models/Offer";

const defaultOffers = [
  {
    title: "Dinner Saver",
    description: "Flat 30% off on your next dinner order.",
    code: "DINNER30",
    discountText: "30% off",
  },
  {
    title: "Sweet Finish",
    description: "Free dessert on carts above Rs 499.",
    code: "SWEET499",
    discountText: "Free dessert",
  },
  {
    title: "Weekend Biryani",
    description: "Weekend biryani combo starting from Rs 199.",
    code: "BIRYANI199",
    discountText: "Combo deal",
  },
];

async function ensureOffersSeeded() {
  const count = await Offer.estimatedDocumentCount();

  if (count === 0) {
    await Offer.insertMany(defaultOffers);
  }
}

export async function GET() {
  const session = await requireSession(["customer", "admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();
  await ensureOffersSeeded();

  const offers = await Offer.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({
    offers: offers.map((offer) => ({
      id: String(offer._id),
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discountText: offer.discountText,
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
  const title = cleanText(body.title, 120);
  const description = cleanText(body.description, 240);
  const code = cleanText(body.code, 30).toUpperCase();
  const discountText = cleanText(body.discountText, 80);

  if (!title || !description || !code || !discountText) {
    return Response.json({ message: "Invalid offer" }, { status: 400 });
  }

  const offer = await Offer.create({
    title,
    description,
    code,
    discountText,
    isActive: body.isActive !== false,
  });

  return Response.json(
    {
      offer: {
        id: String(offer._id),
        title: offer.title,
        description: offer.description,
        code: offer.code,
        discountText: offer.discountText,
      },
    },
    { status: 201 }
  );
}
