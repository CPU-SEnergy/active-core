import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(getFirebaseAdminApp());

export async function GET(req: NextRequest) {
  try {
    const kpiCollection = db.collection()
  } catch (error) {
    console.error("Error fetching kpis: ", error);
    return NextResponse.json({ error: "Failed to fetch kpis" });
  }
}
