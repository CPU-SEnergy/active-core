export const createProduct = async (data: ProductFormData, fileUrl: string) => {
  try {
    const response = await fetch("/api/create-product", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        file: fileUrl,
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

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred during product creation");
  }
};
