import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db, Schema } from "@/lib/schema/firestore";
import { NextResponse } from "next/server";

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

    const membershipHistory = await db.membershipHistory.query(($) =>
      $.field("userId").eq(userId)
    );

    if (membershipHistory.length === 0) {
      return NextResponse.json(
        { error: "No membership history found for the provided user ID." },
        { status: 404 }
      );
    }

    const paymentResults = await Promise.all(
      membershipHistory.map(async (history) => {
        const paymentId = history?.data.paymentId;

        if (!paymentId) {
          console.warn(
            `Missing paymentId for history entry: ${history.ref.id}`
          );
          return null;
        }

        try {
          const payment = await db.payments.get(paymentId);
          return payment?.data || null;
        } catch (error) {
          console.error(`Error fetching payment ${paymentId}:`, error);
          return null;
        }
      })
    );

    const membershipHistoryData = paymentResults.filter(
      (payment) => payment !== null
    ) as Schema["payments"]["ServerData"][];

    const data: UserHistoryProps[] = membershipHistoryData.map((history) => ({
      id: history.id,
      name: history.availedPlan.name,
      duration: history.availedPlan.duration,
      startDate: history.availedPlan.startDate,
      expiryDate: history.availedPlan.expiryDate,
      amount: history.availedPlan.amount,
    }));

    return NextResponse.json({
      data,
    });
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
