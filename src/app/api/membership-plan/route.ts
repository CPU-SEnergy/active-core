import { db } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    getFirebaseAdminApp();
    const membershipPlans = await db.membershipPlan.query(($) =>
      $.field("status").eq("active")
    );

    const formattedPlans = membershipPlans.map((plan) => ({
      id: plan.ref.id,
      ...plan.data,
    }));

    return Response.json(formattedPlans, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
