import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";
import { intervalToDuration, formatDuration, subDays } from "date-fns";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const payments = await db.payments.all();
    const now = new Date();
    const cutoffDate = subDays(now, 30);

    const recentPayments = payments.filter(
      (p) => p.data.createdAt && new Date(p.data.createdAt) >= cutoffDate
    );

    const customers = recentPayments.map((p) => {
      const expiry = new Date(p.data.availedPlan.expiryDate);
      const duration = intervalToDuration({
        start: now,
        end: expiry > now ? expiry : now,
      });

      const remainingTime =
        expiry > now
          ? formatDuration(duration, {
              format: ["months", "days", "hours", "minutes"],
              delimiter: " ",
            })
          : "Expired";

      return {
        id: p.ref.id,
        customerId: p.data.customer.customerId,
        paymentMethod: p.data.paymentMethod,
        firstName: p.data.customer.firstName,
        lastName: p.data.customer.lastName,
        price: p.data.availedPlan.amount,
        requestNumber: p.data.id,
        timeApproved: p.data.createdAt
          ? p.data.createdAt.toLocaleString()
          : "N/A",
        subscription: p.data.availedPlan.name,
        remainingTime,
        duration: p.data.availedPlan.duration ? p.data.availedPlan.duration.toLocaleString()
          : "N/A",
      };
    });

    return new Response(JSON.stringify(customers), {
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
