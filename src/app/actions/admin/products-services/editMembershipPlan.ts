"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { revalidatePath } from "next/cache";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { MEMBERSHIPDATA } from "@/lib/types/product-services";

export async function editMembershipPlan(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized. You are not an admin",
      status: 401,
    };
  }

  const id = formData.get("id") as Schema["membershipPlans"]["Id"];
  if (!id) {
    return {
      success: false,
      message: "Membership plan ID not found",
      status: 404,
    };
  }

  const name = formData.get("name") as MEMBERSHIPDATA["name"];
  const description = formData.get(
    "description"
  ) as MEMBERSHIPDATA["description"];
  const price = JSON.parse(
    formData.get("price") as string
  ) as MEMBERSHIPDATA["price"];
  const duration = parseInt(
    formData.get("duration") as string
  ) as MEMBERSHIPDATA["duration"];
  const planType = formData.get("planType") as MEMBERSHIPDATA["planType"];

  const updateData = {
    name,
    description,
    price,
    duration,
    planType,
    updatedAt: new Date(),
  };

  try {
    await db.membershipPlans.update(id, updateData, { as: "server" });

    revalidatePath("/");

    return {
      success: true,
      message: "Membership plan updated successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating membership plan:", error);
    return {
      success: false,
      message: "Server error while updating membership plan",
      status: 500,
    };
  }
}
