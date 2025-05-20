import { db, Schema } from "@/lib/schema/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id as Schema["membershipPlans"]["Ref"]["id"];

    if (!id) {
      return NextResponse.json(
        { error: "Membership plan ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching membership plan with ID:", id);

    getFirebaseAdminApp();

    const membershipPlan = await db.membershipPlans.get(id);

    if (!membershipPlan) {
      console.log("Membership plan not found with ID:", id);
      return NextResponse.json(
        { error: "Membership plan not found" },
        { status: 404 }
      );
    }

    const formattedPlan = {
      id: membershipPlan.ref.id,
      ...membershipPlan.data,
    };

    return NextResponse.json(formattedPlan, { status: 200 });
  } catch (error) {
    console.error("Error fetching membership plan:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
