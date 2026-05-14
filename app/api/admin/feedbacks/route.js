import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import Feedback from "@/models/Feedback";

export async function GET() {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const feedbacks = await Feedback.find()
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({
    feedbacks: feedbacks.map((fb) => ({
      id: String(fb._id),
      message: fb.message,
      status: fb.status,
      createdAt: fb.createdAt,
    })),
  });
}

export async function PATCH(req) {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();
  const { feedbackId, status } = body;

  if (!feedbackId || !["new", "reviewed", "resolved"].includes(status)) {
    return Response.json({ message: "Invalid feedback update" }, { status: 400 });
  }

  const feedback = await Feedback.findByIdAndUpdate(
    feedbackId,
    { status },
    { new: true }
  );

  if (!feedback) {
    return Response.json({ message: "Feedback not found" }, { status: 404 });
  }

  return Response.json({
    feedback: {
      id: String(feedback._id),
      message: feedback.message,
      status: feedback.status,
    },
  });
}
