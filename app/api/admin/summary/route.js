import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import Feedback from "@/models/Feedback";
import MenuItem from "@/models/MenuItem";
import Offer from "@/models/Offer";
import Order from "@/models/Order";
import Rating from "@/models/Rating";
import User from "@/models/User";

export async function GET() {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const [
    users,
    menuItems,
    activeOffers,
    orders,
    feedback,
    ratingsSummary,
  ] = await Promise.all([
    User.countDocuments(),
    MenuItem.countDocuments({ isAvailable: true }),
    Offer.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Feedback.countDocuments({ status: "new" }),
    Rating.aggregate([
      {
        $group: {
          _id: null,
          averageFood: { $avg: "$food" },
          averageDelivery: { $avg: "$delivery" },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const rating = ratingsSummary[0] || {
    averageFood: 0,
    averageDelivery: 0,
    count: 0,
  };

  return Response.json({
    summary: {
      users,
      menuItems,
      activeOffers,
      orders,
      openFeedback: feedback,
      ratings: {
        count: rating.count || 0,
        averageFood: Number(rating.averageFood || 0).toFixed(1),
        averageDelivery: Number(rating.averageDelivery || 0).toFixed(1),
      },
    },
  });
}
