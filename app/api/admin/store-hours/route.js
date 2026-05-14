import { connectDB } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import StoreHours from "@/models/StoreHours";

export async function GET() {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const storeHours = await StoreHours.findOne().lean();

  if (!storeHours) {
    const newStoreHours = await StoreHours.create({});
    return Response.json({ storeHours: newStoreHours.toObject() });
  }

  return Response.json({ storeHours });
}

export async function PUT(req) {
  const session = await requireSession(["admin"]);

  if (session.error) {
    return session.error;
  }

  await connectDB();

  const body = await req.json();

  const storeHours = await StoreHours.findOneAndUpdate(
    {},
    {
      isOpen: body.isOpen,
      openTime: body.openTime,
      closeTime: body.closeTime,
      breakStartTime: body.breakStartTime,
      breakEndTime: body.breakEndTime,
      hasBreak: body.hasBreak,
      daysOpen: body.daysOpen || [],
    },
    { upsert: true, new: true }
  );

  return Response.json({ storeHours });
}
