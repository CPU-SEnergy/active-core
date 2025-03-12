import { z } from "zod";

const apparelFormSchema = (isEdit: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    price: z.preprocess(
      (val) => Number(val),
      z.number().gte(0, "Price must be greater than 0")
    ),
    description: z.string().min(1, "Description is required"),
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
      z.number().gte(0, "Price must be greater than 0").optional()
    ),
  });

export default apparelFormSchema;
