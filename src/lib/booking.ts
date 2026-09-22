import { prisma } from "@/lib/prisma";
import { startOfDay, isSameDay, isBefore } from "date-fns";

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export async function getAvailableSlots(serviceId: string, date: Date) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];

  const day = startOfDay(date);
  const dayOfWeek = day.getDay();

  const blackout = await prisma.blackoutDate.findFirst({
    where: { date: day },
  });
  if (blackout) return [];

  const windows = await prisma.availability.findMany({
    where: { dayOfWeek },
  });
  if (windows.length === 0) return [];

  const existingBookings = await prisma.booking.findMany({
    where: {
      date: day,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  const now = new Date();
  const isToday = isSameDay(day, now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: { start: string; end: string }[] = [];

  for (const window of windows) {
    let cursor = toMinutes(window.startTime);
    const windowEnd = toMinutes(window.endTime);

    while (cursor + service.durationMinutes <= windowEnd) {
      const slotStart = cursor;
      const slotEnd = cursor + service.durationMinutes;

      if (!isToday || slotStart > nowMinutes) {
        const overlaps = existingBookings.some((b) => {
          const bStart = toMinutes(b.startTime);
          const bEnd = toMinutes(b.endTime);
          return slotStart < bEnd && slotEnd > bStart;
        });

        if (!overlaps) {
          slots.push({
            start: toTimeString(slotStart),
            end: toTimeString(slotEnd),
          });
        }
      }

      cursor += service.durationMinutes;
    }
  }

  return slots;
}

export function isPastDate(date: Date) {
  return isBefore(startOfDay(date), startOfDay(new Date()));
}
