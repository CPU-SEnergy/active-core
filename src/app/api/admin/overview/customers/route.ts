import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();

    // Get customer statistics
    const customersDoc = await db.customers.get(db.customers.id("stats"));

    if (!customersDoc) {
      return Response.json({
        totalCustomers: 0,
        totalWalkInCustomers: 0,
        regularCustomers: 0,
        isDataAvailable: false,
        message: "No customer data available",
      });
    }

    const customerData = customersDoc.data;
    const regularCustomers =
      customerData.totalCustomers - customerData.totalWalkInCustomers;

    const result = {
      totalCustomers: customerData.totalCustomers || 0,
      totalWalkInCustomers: customerData.totalWalkInCustomers || 0,
      regularCustomers: regularCustomers,
      isDataAvailable: true,
    };

    return Response.json(result);
  } catch (error: unknown) {
    console.error("Error fetching customer statistics:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      {
        error: "Failed to fetch customer statistics",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
