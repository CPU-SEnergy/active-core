export const uploadFile = async (data: ProductFormData) => {
  if (!data.file) {
    throw new Error("No file provided");
  }

  try {
    const formData = new FormData();
    formData.append("picture_link", data.file);

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
