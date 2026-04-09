import jwt from "jsonwebtoken";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ message: "No token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return Response.json({
      message: "Protected data",
      user: decoded,
    });
  } catch (err) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }
}