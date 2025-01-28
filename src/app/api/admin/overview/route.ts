import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(getFirebaseAdminApp());

export async function GET(req: NextRequest) {
  try {
    const monthDocRef = db
      .collection('kpis')
      .doc("2025")
      .collection('months')
      .doc("01");

    const monthDoc = await monthDocRef.get();

    if (monthDoc.exists) {
      console.log(`Data for :`, monthDoc.data());
      return NextResponse.json(monthDoc.data());
    } else {
      console.log(`No data found for `);
      return NextResponse.json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error();
  }
}
