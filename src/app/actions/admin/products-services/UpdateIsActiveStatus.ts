"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/schema/firestore";
import { getCurrentUserCustomClaims } from "@/utils/helpers/getCurrentUserClaims";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

const updateMap = {
  classes: db.classes.update,
  membershipPlans: db.membershipPlans.update,
  apparels: db.apparels.update,
  coaches: db.coaches.update,
} as const;

export async function updateIsActiveStatus(
  collection: AllowedCollections,
  id: string,
  isActive: boolean
) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { success: false, error: "Unauthorized. You are not an admin." };
  }

  try {
    getFirebaseAdminApp();

    const updateFn = updateMap[collection] as unknown as (
      id: string,
      data: { isActive: boolean }
    ) => Promise<void>;

    await updateFn(id, { isActive });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
