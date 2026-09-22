import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const dateStr = req.nextUrl.searchParams.get("date");

  if (!serviceId || !dateStr) {
    return NextResponse.json(
      { error: "serviceId and date are required" },
      { status: 400 },
    );
  }

  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const slots = await getAvailableSlots(serviceId, date);
  return NextResponse.json({ slots });
}
