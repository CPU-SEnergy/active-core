import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { db } from "@/lib/schema/firestore";

export async function GET() {
  try {
    getFirebaseAdminApp();
    const cashiers = await db.cashier.all();

    const recentCashiers = cashiers.map(cashier => ({
      uid: cashier.data.uid,
      createdAt: cashier.data.createdAt
        ? cashier.data.createdAt.toLocaleString()
        : "N/A",
    }));

    return new Response(JSON.stringify(recentCashiers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching cashiers:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}