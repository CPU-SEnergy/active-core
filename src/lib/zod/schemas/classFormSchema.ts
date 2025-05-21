import { z } from "zod";

export const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  schedule: z.string().min(1, "Schedule is required"),
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
  description: z.string().min(1, "Description is required"),
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
