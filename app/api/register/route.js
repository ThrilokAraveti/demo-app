import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { cleanText, normalizeEmail } from "@/lib/auth";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const name = cleanText(body.name, 80);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email) || password.length < 6) {
    return NextResponse.json(
      { message: "Invalid registration details" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email }).select("_id");

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "customer",
  });

  return NextResponse.json({
    message: "User registered successfully",
  });
}
