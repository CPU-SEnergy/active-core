import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";
import { differenceInDays } from "date-fns";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const payments = await db.payments.all();

    const activeCustomers = payments
      .filter((p) => new Date(p.data.availedPlan.expiryDate) > new Date())
      .map((p) => {
        const daysRemaining = differenceInDays(
          new Date(p.data.availedPlan.expiryDate),
          new Date()
        );

        return {
          id: p.ref.id,
          customerId: p.data.customer.customerId,
          requestNumber: `#${String(p.ref.id).padStart(6, "0")}`,
          timeApproved: p.data.createdAt
            ? p.data.createdAt.toLocaleString()
            : "N/A",
          subscription: p.data.availedPlan.name,
          remainingTime:
            daysRemaining > 30
              ? `${Math.floor(daysRemaining / 30)} Month`
              : `${daysRemaining} Days`,
        };
      });

    return new Response(JSON.stringify(activeCustomers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}