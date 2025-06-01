import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(5, "Email must be at least 5 characters")
    .max(254, "Email must be at most 254 characters")
    .email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
