import { z } from "zod";

const membershipPlanSchema = z.object({
  name: z.string().min(1, "Plan Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  status: z.enum(["active", "archived"]),
  planType: z.enum(["individual", "package", "walk-in"]),
});
export default membershipPlanSchema;
