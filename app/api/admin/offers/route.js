import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import Offer from "@/models/Offer";

export async function PATCH(req) {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const { offerId, isActive } = body;

  if (!offerId) {
    return Response.json({ message: "Offer ID required" }, { status: 400 });
  }

  const offer = await Offer.findByIdAndUpdate(
    offerId,
    { isActive },
    { new: true }
  );

  if (!offer) {
    return Response.json({ message: "Offer not found" }, { status: 404 });
  }

  return Response.json({
    offer: {
      id: String(offer._id),
      title: offer.title,
      isActive: offer.isActive,
    },
  });
}

export async function GET() {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const offers = await Offer.find().lean();

  return Response.json({
    offers: offers.map((offer) => ({
      id: String(offer._id),
      title: offer.title,
      code: offer.code,
      discountText: offer.discountText,
      isActive: offer.isActive,
    })),
  });
}
