/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { uploadImage } from "../../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { ZodFormattedError } from "zod";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { classFormSchema } from "@/lib/zod/schemas/classFormSchema";

export async function createClass(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  if (!formData) {
    console.error("FormData is undefined");
    return { message: "Form data not received", status: 400 };
  }

  const rawCoaches = formData.getAll("coaches");
  const rawData = {
    name: formData.get("name"),
    schedule: formData.get("schedule"),
    description: formData.get("description"),
    coaches: rawCoaches.map((coach) => ({ coachId: coach })),
    image: formData.get("image"),
  };

  console.log("Raw data:", rawData);

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

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return { message: "Invalid file format", status: 422 };
    }

    const fileUrl = await uploadImage(file, ProductAndServicesType.CLASSES);

    if (!fileUrl.success) {
      return {
        message: fileUrl.error ?? "Unknown error",
        status: fileUrl.status,
      };
    }

    const classData = {
      name: data.name,
      schedule: data.schedule,
      description: data.description,
      coaches: data.coaches.map(
        (coach) => coach.coachId
      ) as unknown as Schema["coaches"]["Id"][],
      isActive: true,
      imageUrl: fileUrl.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Class data:", classData);

    await db.classes.add(classData, { as: "server" });

    return { message: "Class created successfully!", status: 200 };
  } catch (error) {
    console.error("Error creating class:", error);
    return {
      message: "Server error",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
