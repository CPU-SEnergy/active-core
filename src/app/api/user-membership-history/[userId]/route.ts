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
  paymentMethod: string;
  isWalkIn: boolean;
  createdAt: Date | null;
  paymentReference: string;
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

    getFirebaseAdminApp();

    if (!params?.userId) {
      return NextResponse.json(
        { error: "User ID is required to fetch membership history." },
        { status: 400 }
      );
    }

    const userId = db.users.id(params.userId);

    const payments = await db.payments.query(($) => [
      $.field("customer", "customerId").eq(userId),
    ]);

    const membershipHistory: UserHistoryProps[] = payments.map(({ data }) => ({
      id: data.id,
      name: data.availedPlan.name,
      duration: data.availedPlan.duration,
      startDate: data.availedPlan.startDate,
      expiryDate: data.availedPlan.expiryDate,
      amount: data.availedPlan.amount,
      paymentMethod: data.paymentMethod,
      isWalkIn: data.isWalkIn,
      createdAt: data.createdAt,
      paymentReference: data.id,
    }));

    const sortedHistory = membershipHistory.sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );

    return NextResponse.json({ data: sortedHistory });
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
