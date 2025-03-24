import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const adminApp = getFirebaseAdminApp();
    const db = adminApp.firestore();

    const cashiersSnapshot = await db.collection('cashier').get();
    const cashiers = cashiersSnapshot.docs.map(doc => doc.data());
    

    return new Response(JSON.stringify(cashiers), {
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