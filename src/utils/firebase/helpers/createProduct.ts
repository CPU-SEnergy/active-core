import { revalidateTag } from "next/cache";

export const createProduct = async (data: Product, fileUrl: string) => {
  try {
    const response = await fetch("/api/create-product", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        picture_link: fileUrl,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response:", errorResponse);
      throw new Error("Failed to create product");
    }

    revalidateTag("products");
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred during product creation");
  }
};
