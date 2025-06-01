"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/schema/firestore";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function removeItem(id: string) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { success: false, error: "Unauthorized. You are not an admin." };
  }

  try {
    getFirebaseAdminApp();

    await db.apparels.remove(db.apparels.id(id));

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error removing apparel: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}