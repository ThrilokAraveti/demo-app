import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const publicUserFields = "name email role createdAt";

export function sanitizeUser(user) {
  if (!user) return null;

  return {
    userId: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function getSessionUser() {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await User.findById(decoded.userId).select(publicUserFields);

    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireSession(allowedRoles) {
  const user = await getSessionUser();

  if (!user) {
    return {
      error: Response.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = user.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return {
      error: Response.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function cleanText(value, maxLength = 160) {
  return String(value || "").trim().slice(0, maxLength);
}
