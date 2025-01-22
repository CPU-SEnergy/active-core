import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/lib/firebaseAdmin';
import { ProductType } from '@/lib/types/product';

const db = getFirestore(getFirebaseAdminApp());

export async function GET() {
  try {
    const coachCollection = db.collection(ProductType.COACHES);

    const querySnapshot = await coachCollection.get();

    const coaches = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(coaches)
    return NextResponse.json(coaches);
  } catch (error) {
    console.error("Error fetching coaches: ", error);
    return NextResponse.json({ error: "Failed to fetch coaches" });
  }
}