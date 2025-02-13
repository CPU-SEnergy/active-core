import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();

    const paymentsCollection = await db.payments.query(($) =>
      $.field("createdAt").order("desc")
    );

    const cleanPayments = paymentsCollection.map((doc) => ({
      ...doc.data,
    }));

    if (!cleanPayments) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(cleanPayments);

    return new Response(JSON.stringify(cleanPayments), {
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