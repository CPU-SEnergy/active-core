import { z } from "zod";

const membershipPlanSchema = z.object({
  name: z.string().min(1, "Plan Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.object({
    regular: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Regular Price must be at least 1")
    ),
    student: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Student Price must be at least 1")
    ),
    discount: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "Discount Price must be at least 0")
    ),
  }),
  duration: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Duration must be at least 1 day")
  ),
  status: z.enum(["active", "archived"]),
  planDateEnd: z
    .union([z.string(), z.date()])
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      "Invalid date format it must be in MM-DD-YYYY"
    ),
});
export default membershipPlanSchema;
