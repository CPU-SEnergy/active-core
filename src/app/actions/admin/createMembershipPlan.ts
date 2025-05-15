/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import membershipPlanSchema from "@/lib/zod/schemas/membershipPlanFormSchema";
import { db } from "@/lib/schema/firestore";
import { ZodFormattedError } from "zod";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function createMembershipPlan(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { message: "Unauthorized. You are not an admin", status: 401 };
  }

  if (!formData) {
    console.error("FormData is undefined");
    return { message: "Form data not received", status: 400 };
  }

  console.log("FormData entries:", Array.from(formData.entries()));

  let parsedPrice;
  const rawPrice = formData.get("price");

  try {
    parsedPrice = rawPrice
      ? JSON.parse(rawPrice as string)
      : { regular: 0, student: 0, discount: 0 };
  } catch (error) {
    console.error("Error parsing price:", error);
    return { message: "Invalid price format", status: 400 };
  }

  const rawData: any = {
    name: formData.get("name"),
    description: formData.get("description"),
    duration: Number(formData.get("duration")),
    price: parsedPrice,
    status: formData.get("status"),
  };

  const planDateEnd = formData.get("planDateEnd");
  if (planDateEnd) {
    rawData.planDateEnd = planDateEnd;
  }

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
    console.log("Parsed data:", data);

    const membershipPlanData = {
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: {
        regular: data.price.regular,
        student: data.price.student,
        discount: data.price.discount,
      },
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(data.planDateEnd && { planDateEnd: new Date(data.planDateEnd) }),
    };

    await db.membershipPlan.add(membershipPlanData, {
      as: "server",
    });

    return { message: "Membership plan created", status: 201 };
  } catch (error) {
    console.error("Error creating membership plan:", error);
    return { message: "Error creating membership plan", status: 500 };
  }
}
