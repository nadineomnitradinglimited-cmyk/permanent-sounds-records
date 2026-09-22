import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(1, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Enter a valid phone number"),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
