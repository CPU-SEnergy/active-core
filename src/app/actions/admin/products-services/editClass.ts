/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { uploadImage } from "../../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { ZodFormattedError } from "zod";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { classFormSchema } from "@/lib/zod/schemas/classFormSchema";

export async function editClass(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  if (!formData) {
    console.error("FormData is undefined");
    return { message: "Form data not received", status: 400 };
  }

  const id = formData.get("id") as Schema["classes"]["Id"];
  console.log("Class ID:", id);
  if (!id || typeof id !== "string") {
    return { message: "Invalid class ID", status: 400 };
  }

  const rawData = {
    name: formData.get("name"),
    schedule: formData.get("schedule"),
    description: formData.get("description"),
    coaches: formData.getAll("coaches").map((coach) => ({ coachId: coach })),
    image: formData.get("image"),
    existingImageUrl: formData.get("existingImageUrl"),
  };

  console.log("Raw data for update:", rawData);

  const parse = classFormSchema.safeParse(rawData);
  console.log("Parsed data:", parse);

  if (!parse.success) {
    return {
      message: "Validation failed",
      status: 400,
      errors: parse.error.format() as ZodFormattedError<any, string>,
    };
  }

  const data = parse.data;

  try {
    getFirebaseAdminApp();

    const file = formData.get("image") as File | null;
    let imageUrl: string = (rawData.existingImageUrl as string) || "";
    if (file && file.size > 0) {
      const uploadResult = await uploadImage(
        file,
        ProductAndServicesType.CLASSES
      );
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        return { message: "Image upload failed", status: 500 };
      }
    }

    const updatedClassData = {
      name: data.name,
      schedule: data.schedule,
      description: data.description,
      coaches: data.coaches.map(
        (coach) => coach.coachId
      ) as unknown as Schema["coaches"]["Id"][],
      imageUrl,
      updatedAt: new Date(),
    };

    console.log("Updated class data:", updatedClassData);

    await db.classes.update(id, updatedClassData, { as: "server" });

    return { message: "Class updated successfully!", status: 200 };
  } catch (error) {
    console.error("Error updating class:", error);
    return {
      message: "Server error",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
