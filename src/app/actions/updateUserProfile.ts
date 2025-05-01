"use server";

import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";

export async function updateUserProfile(formData: FormData) {
  try {
    getFirebaseAdminApp();

    if (!formData) {
      return { message: "Form data not received", status: 400 };
    }

    const currentUserId = formData.get("id") as Schema["users"]["Id"];
    if (!currentUserId || typeof currentUserId !== "string") {
      return { message: "Invalid user ID", status: 400 };
    }

    const updatedData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dob: new Date(formData.get("dob") as string),
      sex: formData.get("sex") as "male" | "female" | "other",
    };

    await db.users.update(currentUserId, updatedData, { as: "server" });

    return {
      message: "Profile updated successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      message: "Server error while updating profile",
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
