import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(1, "Enter your name"),
  licenseOptionIds: z
    .array(z.string().min(1))
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
