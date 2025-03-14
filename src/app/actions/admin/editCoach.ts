"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { uploadImage } from "../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { revalidatePath } from "next/cache";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function editCoach(formData: FormData) {
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
    return { success: false, error: "Invalid coach ID" };
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
        return { success: false, error: "Image upload failed" };
      }
    }

    const updateData: {
      name: string;
      specialization: string;
      bio: string;
      dob: Date;
      experience: number;
      imageUrl: string;
      description: string;
      certifications: string[];
      updatedAt: Date;
    } = {
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

    return { success: true };
  } catch (error) {
    console.error("Error updating coach:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
