/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import coachFormSchema from "@/lib/zod/schemas/coachFormSchema";
import { db } from "@/lib/schema/firestore";
import { uploadImage } from "../../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { ZodFormattedError } from "zod";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function createCoach(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  if (!formData) {
    console.error("FormData is undefined");
    return { message: "Form data not received", status: 400 };
  }

  console.log("FormData entries:", Array.from(formData.entries()));

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return { message: "Invalid file format", status: 422 };
  }

  const rawData = {
    name: formData.get("name"),
    specialization: formData.get("specialization"),
    contactInfo: formData.get("contactInfo"),
    dob: formData.get("dob"),
    experience: Number(formData.get("experience")),
    bio: formData.get("bio"),
    certifications: formData.getAll("certifications") as string[],
    image: formData.get("image"),
  };

  const parse = coachFormSchema.safeParse(rawData);
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
    console.log("Parsed data:", data);

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return { message: "Invalid file format", status: 422 };
    }

    const fileUrl = await uploadImage(file, ProductAndServicesType.COACHES);

    if (!fileUrl.success) {
      return {
        message: fileUrl.error ?? "Unknown error",
        status: fileUrl.status,
      };
    }

    const coachData = {
      name: data.name,
      specialization: data.specialization,
      bio: data.bio,
      dob: new Date(data.dob!),
      experience: data.experience,
      imageUrl: fileUrl.url,
      contactInfo: data.contactInfo,
      certifications: data.certifications ?? [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.coaches.add(coachData, { as: "server" });

    return { message: "Coach created successfully!", status: 200 };
  } catch (error) {
    console.error("Error adding coach! :", error);
    return {
      message: "Server error",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
