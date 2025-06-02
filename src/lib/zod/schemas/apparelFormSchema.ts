import { z } from "zod";

const apparelFormSchema = (isEdit: boolean) =>
  z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be at most 100 characters"),
    type: z
      .string()
      .min(1, "Type is required")
      .max(50, "Type must be at most 50 characters"),
    price: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .gte(0, "Price must be greater than 0")
        .lte(100_000_000, "Price must not exceed 100 million")
    ),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be at most 500 characters"),
    image: isEdit
      ? z.custom<File | undefined>(
          (file) => file instanceof File || file === undefined,
          {
            message: "Invalid file type",
          }
        )
      : z.custom<File>((file) => file instanceof File, {
          message: "Image is required",
        }),
    discount: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .gte(0, "Discount must be greater than or equal to 0")
        .lte(100_000_000, "Discount must not exceed 100 million")
        .optional()
    ),
  });

export default apparelFormSchema;
