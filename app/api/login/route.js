import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { normalizeEmail } from "@/lib/auth";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shouldUseSecureCookie(req) {
  const host = req.headers.get("host") || "";
  const protocol = req.headers.get("x-forwarded-proto");
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  return protocol === "https" && !isLocalhost;
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!email || !password) {
    return Response.json({ message: "Missing credentials" }, { status: 400 });
  }

  const user = await User.findOne({
    email: new RegExp(`^${escapeRegex(email)}$`, "i"),
  }).select("+password");

  console.log(user);
  if (!user || !user.password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const token = jwt.sign(
    {
      userId: String(user._id),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const response = NextResponse.json({
    message: "Login successful",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: shouldUseSecureCookie(req),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
