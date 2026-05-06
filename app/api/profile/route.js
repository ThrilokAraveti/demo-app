import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

    return Response.json({
      user: decoded,
    });
  } catch (err) {
    return Response.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}