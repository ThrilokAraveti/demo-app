import { cookies } from "next/headers";

function shouldUseSecureCookie(req) {
  const host = req.headers.get("host") || "";
  const protocol = req.headers.get("x-forwarded-proto");
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  return protocol === "https" && !isLocalhost;
}

export async function POST(req) {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: shouldUseSecureCookie(req),
    sameSite: "lax",
    path: "/",
  });

  return Response.json({
    message: "Logged out",
  });
}
