"use server";

import { db, type Schema } from "@/lib/schema/firestore";
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

  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string | null;
  const priceStr = formData.get("price") as string | null;
  const description = formData.get("description") as string | null;
  const type = formData.get("type") as string | null;
  const existingImageUrl = formData.get("existingImageUrl") as string | null;
  const file = formData.get("image") as File | null;
  const discountStr = formData.get("discount") as string | null;

  if (!id || !name || !priceStr || !description || !type || !existingImageUrl) {
    return { success: false, error: "Missing required fields" };
  }

  const price = Number.parseFloat(priceStr);
  if (isNaN(price)) {
    return { success: false, error: "Invalid price value" };
  }

  try {
    getFirebaseAdminApp();

    let imageUrl = existingImageUrl;
    if (file && file.size > 0) {
      const uploadResult = await uploadImage(
        file,
        ProductAndServicesType.APPARELS
      );
      if (!uploadResult.success) {
        return { success: false, error: "Image upload failed" };
      }
      imageUrl = uploadResult.url;
    }

    const currentApparel = await db.apparels.get(
      id as Schema["apparels"]["Id"]
    );
    if (!currentApparel) {
      return { success: false, error: "Apparel not found" };
    }

    const apparelId = id as Schema["apparels"]["Id"];

    await db.apparels.update(
      apparelId,
      ($) => {
        const updateData = {
          name,
          price,
          imageUrl,
          description,
          type,
        };

        if (
          discountStr === null ||
          discountStr.trim() === "" ||
          discountStr === "0"
        ) {
          return {
            ...updateData,
            discount: $.remove(),
          };
        } else {
          const parsedDiscount = Number.parseFloat(discountStr);
          if (isNaN(parsedDiscount)) {
            return {
              ...updateData,
              discount: $.remove(),
            };
          } else {
            return {
              ...updateData,
              discount: parsedDiscount,
            };
          }
        }
      },
      { as: "server" }
    );

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
