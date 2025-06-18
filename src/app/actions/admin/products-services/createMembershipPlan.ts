/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import membershipPlanSchema from "@/lib/zod/schemas/membershipPlanFormSchema";
import { db } from "@/lib/schema/firestore";
import { ZodFormattedError } from "zod";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { revalidatePath } from "next/cache";

export async function createMembershipPlan(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  if (!formData) {
    console.error("FormData is undefined");
    return { message: "Form data not received", status: 400 };
  }

  const rawPrice = formData.get("price");
  const parsedPrice = rawPrice ? Number(rawPrice) : 0;

  if (isNaN(parsedPrice)) {
    return { message: "Invalid price format", status: 400 };
  }

  // Prepare raw data for validation (no planDateEnd here)
  const rawData: any = {
    name: formData.get("name"),
    description: formData.get("description"),
    duration: Number(formData.get("duration")),
    price: parsedPrice,
    planType: formData.get("planType"),
  };

  const parse = membershipPlanSchema.safeParse(rawData);
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

    const membershipPlanData = {
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      isActive: true,
      isDeleted: false,
      planType: data.planType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.membershipPlans.add(membershipPlanData, {
      as: "server",
    });
    
    revalidatePath("/");

    return { message: "Membership plan created", status: 201 };
  } catch (error) {
    console.error("Error creating membership plan:", error);
    return { message: "Error creating membership plan", status: 500 };
  }
}
