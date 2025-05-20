"use server";

import { db, type Schema } from "@/lib/schema/firestore";
import { revalidatePath } from "next/cache";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import type { MEMBERSHIPDATA } from "@/lib/types/product-services";

export async function editMembershipPlan(formData: FormData) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized. You are not an admin",
      status: 401,
    };
  }

  try {
    const id = formData.get("id") as string;
    if (!id) {
      return {
        success: false,
        message: "Membership plan ID not found",
        status: 404,
      };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const priceRaw = formData.get("price");
    const durationRaw = formData.get("duration");
    const planType = formData.get("planType") as MEMBERSHIPDATA["planType"];

    console.log("Raw form values:", {
      id,
      name,
      description,
      priceRaw,
      durationRaw,
      planType,
    });

    let price: number;
    try {
      if (typeof priceRaw === "string") {
        try {
          const parsed = JSON.parse(priceRaw);
          price = Number(parsed);
        } catch (e) {
          price = Number(priceRaw);
        }
      } else {
        price = Number(priceRaw);
      }
    } catch (e) {
      console.error("Error parsing price:", e);
      return {
        success: false,
        message: "Invalid price format",
        status: 400,
      };
    }

    let duration: number;
    try {
      if (typeof durationRaw === "string") {
        try {
          const parsed = JSON.parse(durationRaw);
          duration = Number(parsed);
        } catch (e) {
          duration = Number(durationRaw);
        }
      } else {
        duration = Number(durationRaw);
      }
    } catch (e) {
      console.error("Error parsing duration:", e);
      return {
        success: false,
        message: "Invalid duration format",
        status: 400,
      };
    }

    if (isNaN(price)) {
      return {
        success: false,
        message: "Invalid price value",
        status: 400,
      };
    }

    if (isNaN(duration)) {
      return {
        success: false,
        message: "Invalid duration value",
        status: 400,
      };
    }

    if (!name || !description || !planType) {
      return {
        success: false,
        message: "Missing required fields",
        status: 400,
      };
    }

    const updateData = {
      name,
      description,
      price,
      duration,
      planType,
      updatedAt: new Date(),
    };

    console.log("Updating membership plan with data:", updateData);

    await db.membershipPlans.update(
      id as Schema["membershipPlans"]["Id"],
      updateData,
      { as: "server" }
    );

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
      message:
        error instanceof Error
          ? error.message
          : "Server error while updating membership plan",
      status: 500,
    };
  }
}
