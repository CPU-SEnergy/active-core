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

export async function removeItem(
  collection: AllowedCollections, 
  id: string,
) {
  const user = await getCurrentUserCustomClaims();
  if (!user || user?.customClaims?.role !== "admin") {
    return { success: false, error: "Unauthorized. You are not an admin." };
  }

  try {
    getFirebaseAdminApp();
 
    const removeFn = updateMap[collection] as unknown as (
      id: string,
      data: { 
        deletedAt: Date,
        isDeleted: boolean
      }
    ) => Promise<void>;

    await removeFn(id, { 
      deletedAt: new Date(),
      isDeleted: true, 
    });

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