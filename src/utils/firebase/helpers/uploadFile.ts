export const uploadFile = async (file: ProductFormData) => {
  if (
    !file.file ||
    !file.name ||
    !file.price ||
    !file.type ||
    !file.description
  ) {
    throw new Error("No file provided");
  }

  try {
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("name", file.name);
    formData.append("price", file.price);
    formData.append("type", file.type);
    formData.append("description", file.description);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const { success, url } = await response.json();
    if (!success) {
      throw new Error("Failed to get file URL");
    }

    return url;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred during file upload");
  }
};
