import { connectDB } from "@/lib/db";
import { cleanText, requireSession } from "@/lib/auth";
import Feedback from "@/models/Feedback";

function serializeFeedback(feedback) {
  return {
    id: String(feedback._id),
    message: feedback.message,
    status: feedback.status,
    createdAt: feedback.createdAt,
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

  const feedback = await Feedback.find(query)
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return Response.json({
    feedback: feedback.map(serializeFeedback),
  });
}

export async function POST(req) {
  const session = await requireSession(["customer"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const message = cleanText(body.message, 600);

  if (message.length < 5) {
    return Response.json(
      { message: "Feedback must be at least 5 characters" },
      { status: 400 }
    );
  }

  const feedback = await Feedback.create({
    user: session.user._id,
    message,
  });

  return Response.json(
    {
      feedback: serializeFeedback(feedback.toObject()),
    },
    { status: 201 }
  );
}
