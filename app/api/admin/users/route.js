import { requireSession, sanitizeUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const users = await User.find({})
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .limit(50);

  return Response.json({
    users: users.map((user) => ({
      ...sanitizeUser(user),
      createdAt: user.createdAt,
    })),
  });
}
