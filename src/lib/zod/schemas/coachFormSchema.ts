import { z } from "zod";

const coachFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  specialization: z
    .string()
    .min(1, "Specialty is required")
    .max(100, "Specialty must be at most 100 characters"),
  contactInfo: z
    .string()
    .min(1, "Contact info is required")
    .max(100, "Contact info must be at most 100 characters"),
  dob: z
    .union([z.string(), z.date()])
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      "Invalid date format, it must be in MM-DD-YYYY"
    ),
  experience: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .gt(0, "Experience must be greater than 0")
      .lte(100, "Experience must be at most 100 years")
  ),
  certifications: z
    .array(
      z
        .string()
        .min(1, "Certifications is required")
        .max(100, "Certification must be at most 100 characters")
    )
    .optional(),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(500, "Bio must be at most 500 characters"),
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

export default coachFormSchema;
