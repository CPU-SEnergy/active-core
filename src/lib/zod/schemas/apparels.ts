import { z } from "zod";

const apparelFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  price: z.preprocess(
    (val) => Number(val),
    z.number().gt(0, "Price must be greater than 0")
  ),
  description: z.string().min(1, "Description is required"),
  image: z.custom<File>((file) => file instanceof File, {
    message: "Image is required",
  }),
});

export default apparelFormSchema;