import { z } from "zod";

export const classFormSchema = z.object({
  name: z
    .string()
    .min(1, "Class name is required")
    .max(100, "Class name must be at most 100 characters"),
  schedule: z
    .string()
    .min(1, "Schedule is required")
    .max(100, "Schedule must be at most 100 characters"),
  coaches: z
    .array(
      z.object({
        coachId: z.string().min(1, "Coach is required"),
      })
    )
    .min(1, { message: "At least one coach is required" })
    .superRefine((coaches, ctx) => {
      const coachIds = coaches.map((coach) => coach.coachId);
      coachIds.forEach((id, index) => {
        if (coachIds.indexOf(id) !== index) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Duplicate coaches are not allowed",
            path: [index, "coachId"],
          });
        }
      });
    }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be at most 500 characters"),
  image: z.preprocess(
    (val) => (typeof val === "string" ? undefined : val),
    z
      .any()
      .refine(
        (file) =>
          !file || (file instanceof File && file.type.startsWith("image/")),
        { message: "Please upload a valid image file" }
      )
      .optional()
  ),
});
