import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";
import { intervalToDuration, formatDuration } from "date-fns";

export async function GET() {
  try {
    getFirebaseAdminApp();
    const payments = await db.payments.all();

    const activeCustomers = payments
      .filter((p) => new Date(p.data.availedPlan.expiryDate) > new Date())
      .map((p) => {
        const now = new Date();
        const expiry = new Date(p.data.availedPlan.expiryDate);

        const duration = intervalToDuration({ start: now, end: expiry });

        const remainingTime = formatDuration(duration, {
          format: ["months", "days", "hours", "minutes"],
          delimiter: " ",
        });

        return {
          id: p.ref.id,
          customerId: p.data.customer.customerId,
          firstName: p.data.customer.firstName,
          lastName: p.data.customer.lastName,
          price: p.data.availedPlan.amount,
          requestNumber: p.data.id,
          timeApproved: p.data.createdAt
            ? p.data.createdAt.toLocaleString()
            : "N/A",
          subscription: p.data.availedPlan.name,
          remainingTime: remainingTime || "0 minutes",
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
