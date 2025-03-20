import { z } from "zod";

const coachFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialty is required"),
  contactInfo: z.string().min(1, "Contact info is required"),
  dob: z
    .union([z.string(), z.date()])
    .optional()
    .refine(
      (date) => !date || !isNaN(new Date(date).getTime()),
      "Invalid date format it must be in MM-DD-YYYY"
    ),
  experience: z.preprocess(
    (val) => Number(val),
    z.number().gt(0, "Experience must be greater than 0")
  ),
  certifications: z
    .array(z.string().min(1, "Certification is required"))
    .min(1, { message: "At least one certification is required" }),
  bio: z.string().min(1, "Bio is required"),
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
