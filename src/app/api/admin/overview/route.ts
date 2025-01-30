import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(getFirebaseAdminApp());

type Params = {
  year: number;
  month: number;
}

export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const { year, month } = context.params;
    const numericYear = Number(year);
    const numericMonth = Number(month);

    const yearDocRef = db
      .collection('kpis')
      .doc("year")

    const monthDocRef = yearDocRef
      .collection(numericYear.toString())
      .doc(numericMonth.toString());

    const monthDoc = await monthDocRef.get();

    if (monthDoc.exists) {
      console.log(monthDoc.data());
      return NextResponse.json(monthDoc.data());
    } else {
      return NextResponse.json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error();
  }
}
