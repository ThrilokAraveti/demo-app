import { connectDB } from "@/lib/db";
import { cleanText, requireSession } from "@/lib/auth";
import Rating from "@/models/Rating";

function clampRating(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(rating), 1), 5);
}

function serializeRating(rating) {
  return {
    id: String(rating._id),
    food: rating.food,
    delivery: rating.delivery,
    comment: rating.comment,
    createdAt: rating.createdAt,
  };
}

async function getSummary(query) {
  const result = await Rating.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        averageFood: { $avg: "$food" },
        averageDelivery: { $avg: "$delivery" },
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = result[0] || {
    averageFood: 0,
    averageDelivery: 0,
    count: 0,
  };

  return {
    averageFood: Number(summary.averageFood || 0).toFixed(1),
    averageDelivery: Number(summary.averageDelivery || 0).toFixed(1),
    count: summary.count || 0,
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

  const [ratings, summary] = await Promise.all([
    Rating.find(query).sort({ createdAt: -1 }).limit(30).lean(),
    getSummary(query),
  ]);

  return Response.json({
    summary,
    ratings: ratings.map(serializeRating),
  });
}

export async function POST(req) {
  const session = await requireSession(["customer"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const food = clampRating(body.food);
  const delivery = clampRating(body.delivery);
  const comment = cleanText(body.comment, 300);

  if (!food || !delivery) {
    return Response.json({ message: "Invalid rating" }, { status: 400 });
  }

  const rating = await Rating.create({
    user: session.user._id,
    food,
    delivery,
    comment,
  });

  return Response.json(
    {
      rating: serializeRating(rating.toObject()),
    },
    { status: 201 }
  );
}
