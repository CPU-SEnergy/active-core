"use server";

import apparelFormSchema from "@/lib/zod/schemas/apparels";

export async function createApparel(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    price: Number(formData.get("price")),
    description: formData.get("description"),
    image: formData.get("image"),
  };

  const validation = apparelFormSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.format() };
  }

  try {
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return { error: { image: "Invalid file format" } };
    }

    const filePath = `/uploads/${file.name}`;

    console.log("Saved apparel:", {
      ...validation.data,
      imagePath: filePath,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating apparel:", error);
    return { error: "Server error occurred" };
  }
}
