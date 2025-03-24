"use server";

import { db, Schema } from "@/lib/schema/firestore";
import { revalidatePath } from "next/cache";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";

export async function editMembershipPlan(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized. You are not an admin",
      status: 401,
    };
  }

  const id = formData.get("id") as Schema["membershipPlan"]["Id"];
  if (!id) {
    return {
      success: false,
      message: "Membership plan ID not found",
      status: 404,
    };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = JSON.parse(formData.get("price") as string);
  const duration = parseInt(formData.get("duration") as string, 10);
  const status = formData.get("status") as "active" | "archived";
  const planDateEndRaw = formData.get("planDateEnd");

  const updateData = {
    name,
    description,
    price,
    duration,
    status,
    updatedAt: new Date(),
    ...(planDateEndRaw
      ? { planDateEnd: new Date(planDateEndRaw as string) }
      : {}),
  };

  try {
    await db.membershipPlan.update(id, updateData, { as: "server" });

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
