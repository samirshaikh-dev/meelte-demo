import { z } from "zod";

export const hrLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(255, "Email address is too long."),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password exceeds maximum permitted length."),
});

