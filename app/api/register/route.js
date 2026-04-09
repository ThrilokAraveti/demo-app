import { connectDB } from "@/lib/db";
import { addUser, findUserByEmail } from "@/lib/users";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  console.log("REGISTER HIT");
await connectDB();
console.log("DB CONNECTED");
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return Response.json(
      { message: "All fields required" },
      { status: 400 }
    );
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return Response.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  // 🔐 HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  addUser({
    name,
    email,
    password: hashedPassword,
  });

  const newUser = await User.create({
  name,
  email,
  password: hashedPassword,
});

console.log("Saved user:", newUser);
  return Response.json({
    message: "User registered successfully",
  });
}