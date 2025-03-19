"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { uploadImage } from "../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { revalidatePath } from "next/cache";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";

export async function editCoach(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized. You are not an admin",
      status: 401,
    };
  }

  const id = formData.get("id") as Schema["coaches"]["Id"];
  const name = formData.get("name") as string;
  const specialization = formData.get("specialization") as string;
  const contactInfo = formData.get("contactInfo") as string;
  const dob = formData.get("dob") as string;
  const experience = parseFloat(formData.get("experience") as string);
  const bio = formData.get("bio") as string;
  const certifications = formData.getAll("certifications") as string[];
  const existingImageUrl = formData.get("existingImageUrl") as string;
  const file = formData.get("image") as File | null;

  if (!id) {
    return { success: false, message: "Coach ID not found", status: 404 };
  }

  try {
    getFirebaseAdminApp();
    let imageUrl = existingImageUrl;

    if (file && file.size > 0) {
      const uploadResult = await uploadImage(
        file,
        ProductAndServicesType.COACHES
      );
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        return { success: false, message: "Image upload failed", status: 500 };
      }
    }

    const updateData = {
      name,
      specialization,
      bio,
      dob: new Date(dob),
      experience,
      imageUrl,
      description: contactInfo,
      certifications,
      updatedAt: new Date(),
    };

    await db.coaches.update(id, updateData, { as: "server" });

    revalidatePath("/");

    return {
      success: true,
      message: "Coach updated successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating coach:", error);
    return {
      success: false,
      message: "Server error while updating coach",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
