import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();
    const payments = await db.payments.all();

    const inactiveCustomers = payments
      .filter(
        (p) =>
          p.data?.availedPlan?.expiryDate &&
          new Date(p.data.availedPlan.expiryDate) <= new Date() &&
          p.data?.customer?.customerId
      )
      .map((p) => ({
        id: p.ref.id,
        customerId: p.data.customer.customerId,
        firstName: p.data.customer.firstName,
        lastName: p.data.customer.lastName,
        price: p.data.availedPlan.amount,
        requestNumber: `#${String(p.ref.id).padStart(6, "0")}`,
        expiryDate: p.data.availedPlan.expiryDate,
        subscription: p.data.availedPlan.name,
      }));

    return new Response(JSON.stringify(inactiveCustomers), {
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
