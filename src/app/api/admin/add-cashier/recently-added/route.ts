import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();
    const cashiersCollection = await db.cashier.query(($) => 
      $.field("createdAt").order("desc")
    )

    return new Response(JSON.stringify(cashiersCollection), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error fetching cashiers:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}