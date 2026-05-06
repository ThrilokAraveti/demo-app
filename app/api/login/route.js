import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json({ message: "Missing credentials" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // 🔐 Generate JWT
  if (!process.env.JWT_SECRET) {
    return Response.json({ message: "Server configuration error" }, { status: 500 });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });
  return Response.json({ message: "Login successful" });
}
