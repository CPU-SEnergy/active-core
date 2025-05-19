"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { uploadImage } from "../../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { revalidatePath } from "next/cache";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";

export async function editApparel(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  const id = formData.get("id") as Schema["apparels"]["Id"];
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount = formData.get("discount")
    ? parseFloat(formData.get("discount") as string)
    : undefined;
  const existingImageUrl = formData.get("existingImageUrl") as string;
  const file = formData.get("image") as File | null;

  if (!id) {
    return { success: false, error: "Invalid apparel ID" };
  }

  try {
    getFirebaseAdminApp();
    let imageUrl = existingImageUrl;

    if (file && file.size > 0) {
      const uploadResult = await uploadImage(
        file,
        ProductAndServicesType.APPARELS
      );
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        return { success: false, error: "Image upload failed" };
      }
    }

    const updateData: {
      name: string;
      price: number;
      imageUrl: string;
      discount?: number;
    } = {
      name,
      price,
      imageUrl,
    };

    if (discount !== undefined) {
      updateData.discount = discount;
    }

    await db.apparels.update(id, updateData);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating apparel:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
