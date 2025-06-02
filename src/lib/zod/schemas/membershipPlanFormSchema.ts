import { z } from "zod";

const membershipPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan Name is required")
    .max(100, "Plan Name must be at most 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be at most 500 characters"),
  price: z
    .number()
    .min(0, "Price must be 0 or more")
    .max(100_000_000, "Price must be less than or equal to 100 million"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(3650, "Duration must be at most 3650 days (10 years)"),
  planType: z.enum(["individual", "package", "walk-in"]),
});

export default membershipPlanSchema;
