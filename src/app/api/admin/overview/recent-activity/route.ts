import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET(request: Request) {
  try {
    getFirebaseAdminApp();

    const paymentsCollection = db.payments;
    const paymentQuery = paymentsCollection.orderBy("createdAt", "desc").limit(5);
    const paymentDoc = await paymentQuery.get();

    if (!paymentDoc || !paymentDoc.data) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(paymentDoc), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching document:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
