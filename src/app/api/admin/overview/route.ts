import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { KpiMonth } from "@/lib/types/kpi";

const db = getFirestore(getFirebaseAdminApp());

export async function GET(req: NextRequest) {
  try {
    const kpiMonth = db.collection(KpiMonth.totalRevenue);

    const querySnapshot = await kpiMonth.get();

    const kpi = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(kpi);
  } catch (error) {
    console.error("Error fetching kpis: ", error);
    return NextResponse.json({ error: "Failed to fetch kpis" });
  }
}
