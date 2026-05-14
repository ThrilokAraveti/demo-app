import { requireSession, sanitizeUser } from "@/lib/auth";

export async function GET() {
  const session = await requireSession();

  if (session.error) {
    return session.error;
  }

  return Response.json({
    user: sanitizeUser(session.user),
  });
}
