/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import apparelFormSchema from "@/lib/zod/schemas/apparelFormSchema";
import { db } from "@/lib/schema/firestore";
import { uploadImage } from "../upload/image";
import { ProductAndServicesType } from "@/lib/types/product-services";
import { ZodFormattedError } from "zod";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function createApparel(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  if (!formData) {
    console.error("FormData is undefined");
    return { message: "Form data not received" };
  }

  console.log("FormData entries:", Array.from(formData.entries()));

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return { message: "Invalid file format" };
  }

  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    discount: Number(formData.get("discount")),
    price: Number(formData.get("price")),
    description: formData.get("description"),
    image: formData.get("image"),
  };

  const parse = apparelFormSchema(false).safeParse(rawData);
  if (!parse.success) {
    return {
      message: "Validation failed",
      errors: parse.error.format() as ZodFormattedError<any, string>,
    };
  }

  const data = parse.data;

  try {
    getFirebaseAdminApp();
    console.log("Parsed data:", data);

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return { message: "Invalid file format" };
    }

    const fileUrl = await uploadImage(file, ProductAndServicesType.APPARELS);

    if (!fileUrl.success) {
      return {
        message: fileUrl.error ?? "Unknown error",
        status: fileUrl.status,
      };
    }

    const apparelData: {
      name: string;
      type: string;
      price: number;
      discount?: number;
      description: string;
      imageUrl: string;
      createdAt: Date;
      updatedAt: Date;
    } = {
      name: data.name,
      type: data.type,
      price: data.price,
      description: data.description,
      imageUrl: fileUrl.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (data.discount !== undefined) {
      apparelData.discount = data.discount;
    }

    await db.apparels.add(apparelData, { as: "server" });

    revalidatePath("/");

    return { message: "Apparel created successfully!" };
  } catch (error) {
    console.error("Error updating apparel:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
