import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "No token" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    await connectDB();

    const storedUser = await User.findById(decoded.userId).select(
      "name email role"
    );

    if (!storedUser) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      user: {
        userId: String(storedUser._id),
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role || decoded.role || "customer",
      },
    });
  } catch {
    return Response.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}
