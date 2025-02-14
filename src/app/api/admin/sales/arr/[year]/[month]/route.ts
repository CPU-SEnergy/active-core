import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

type Params = {
  year: string;
  month: string;
};

export async function GET(request: Request, context: { params: Params }) {
  try {
    getFirebaseAdminApp();

    if (!context.params) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { year, month } = context.params;

    if (!year || !month) {
      return new Response(JSON.stringify({ error: "Invalid parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const startDate = new Date(`${month}-01-${year}`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const paymentsCollection = await db.payments.query(($) => [
      $.field("createdAt").gte(startDate),
      $.field("createdAt").lt(endDate)
    ]);

    const paymentData = paymentsCollection.map((doc) => ({
      ...doc.data,
    }));
    
    if (!paymentData) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const totalAmount = paymentData.reduce((total, payment) => {
      return total + payment.availedPlan.amount;
    }, 0)

    const uniqueCustomers = new Set(paymentData.map(payment => payment.user.userId));
    const totalCustomers = uniqueCustomers.size;

    const result = {
      payments: paymentData,
      totalAmount,
      totalCustomers
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching document: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
