import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";
import { NextResponse } from "next/server";

interface UserHistoryProps {
  id: string;
  name: string;
  duration: number;
  startDate: Date;
  expiryDate: Date;
  amount: number;
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    getFirebaseAdminApp();

    if (!params?.userId) {
      return NextResponse.json(
        { error: "User ID is required to fetch membership history." },
        { status: 400 }
      );
    }

    const userId = db.users.id(params.userId);

    const payments = await db.payments.query(($) => [
      $.field("customerId").eq(userId),
    ]);

    if (payments.length === 0) {
      return NextResponse.json(
        { error: "No membership history found for the provided user ID." },
        { status: 404 }
      );
    }

    const data: UserHistoryProps[] = payments.map(({ data }) => ({
      id: data.id,
      name: data.availedPlan.name,
      duration: data.availedPlan.duration,
      startDate: data.availedPlan.startDate,
      expiryDate: data.availedPlan.expiryDate,
      amount: data.availedPlan.amount,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching membership history:", error);

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while fetching membership history.",
      },
      { status: 500 }
    );
  }
}
